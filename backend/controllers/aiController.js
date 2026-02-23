/**
 * AI Controller – KodBank AI Banking Assistant
 * Uses Hugging Face Router API (OpenAI-compatible) with Llama-3.1-8B-Instruct
 * Endpoint: https://router.huggingface.co/v1/chat/completions  (novita provider)
 */

const HF_API_URL =
  'https://router.huggingface.co/v1/chat/completions';

const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct:novita';

const SYSTEM_PROMPT =
  'You are KodBank\'s helpful AI banking assistant. ' +
  'Answer only banking-related questions concisely and clearly. ' +
  'If asked non-banking questions, politely say you can only help with banking topics. ' +
  'Keep every response under 180 words.';

/**
 * POST /api/ai/chat
 * Body: { message: string }
 */
const chat = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(422).json({ success: false, message: 'Message is required' });
  }

  if (message.trim().length > 500) {
    return res.status(422).json({ success: false, message: 'Message too long (max 500 chars)' });
  }

  if (!process.env.HF_API_KEY) {
    return res.status(503).json({ success: false, message: 'AI service not configured' });
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: message.trim() },
        ],
        max_tokens: 300,
        temperature: 0.6,
        top_p: 0.9,
        stream: false,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    // Model warming up
    if (response.status === 503) {
      const errorBody = await response.json().catch(() => ({}));
      const estimatedTime = errorBody.estimated_time || 20;
      return res.status(503).json({
        success: false,
        message: `AI model is warming up. Please try again in ~${Math.ceil(estimatedTime)} seconds.`,
        retryAfter: Math.ceil(estimatedTime),
      });
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const isDev = process.env.NODE_ENV !== 'production';
      console.error('[ai/chat] HF API error', response.status, JSON.stringify(errorBody));
      return res.status(502).json({
        success: false,
        message: isDev
          ? `AI API error ${response.status}: ${errorBody?.error || JSON.stringify(errorBody)}`
          : 'AI service temporarily unavailable. Please try again.',
      });
    }

    const data = await response.json();

    // OpenAI-compatible response shape
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.error('[ai/chat] Unexpected HF response shape:', JSON.stringify(data).slice(0, 200));
      return res.status(502).json({ success: false, message: 'AI returned an empty response' });
    }

    return res.json({ success: true, response: text.trim() });
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return res.status(504).json({ success: false, message: 'AI request timed out. Please try again.' });
    }
    console.error('[ai/chat]', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { chat };
