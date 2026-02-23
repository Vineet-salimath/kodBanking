/**
 * StatementsSection.jsx
 * Displays statement entries with animated glass progress bar on "download".
 * Client-side generation — no backend dependency required.
 * If backend PDF route exists it can be wired in via prop; otherwise generates inline.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const STATEMENTS = [
  {
    id:      'feb-2026',
    name:    'Statement_Feb_2026.pdf',
    size:    '1.2 MB',
    period:  'February 2026',
    entries: 20,
    opening: 125000,
    closing: 182251,
  },
  {
    id:      'jan-2026',
    name:    'Statement_Jan_2026.pdf',
    size:    '0.9 MB',
    period:  'January 2026',
    entries: 16,
    opening: 98000,
    closing: 125000,
  },
];

function generateCSVContent(stmt) {
  const header  = 'Date,Description,Type,Amount,Status\n';
  const rows = [
    '2026-02-01,Salary Credit,credit,85000,success',
    '2026-02-02,SWIFT Transfer – London,debit,15000,success',
    '2026-02-03,Dividend Pay – Q4 2025,credit,4250,success',
    '2026-02-04,Cloud API Subscription,debit,1999,success',
    '2026-02-05,ATM Withdrawal,debit,5000,success',
    '2026-02-06,GDP Disbursement – IND,credit,12500,success',
    '2026-02-07,Card Payment – Amazon,debit,3499,success',
    '2026-02-08,EMI Debit – Home Loan,debit,22000,success',
    '2026-02-09,UPI Transfer – Received,credit,8000,success',
    '2026-02-10,Global Trade Settlement,debit,45000,pending',
    '2026-02-11,Freelance Payment,credit,20000,success',
    '2026-02-12,UPI – Swiggy,debit,549,success',
    '2026-02-13,Electricity Bill,debit,1200,success',
    '2026-02-14,Fixed Deposit Matured,credit,50000,success',
    '2026-02-15,SWIFT Transfer – USA,debit,25000,failed',
    '2026-02-16,SIM Recharge,debit,299,success',
    '2026-02-17,Cashback – HDFC Card,credit,450,success',
    '2026-02-18,OTT Subscriptions,debit,599,success',
    '2026-02-19,EMI Debit – Car Loan,debit,12500,pending',
    '2026-02-20,Investment Returns,credit,7800,success',
  ].join('\n');

  const summary = `\n\nSUMMARY\nOpening Balance,${stmt.opening}\nClosing Balance,${stmt.closing}\nNet Change,${stmt.closing - stmt.opening}`;
  return header + rows + summary;
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename.replace('.pdf', '.csv');
  a.click();
  URL.revokeObjectURL(url);
}

export default function StatementsSection({ apiDownloadUrl }) {
  const [downloading, setDownloading] = useState(null);
  const [progress,    setProgress]    = useState(0);

  const handleDownload = async (stmt) => {
    if (downloading) return;
    setDownloading(stmt.id);
    setProgress(0);

    // Animated progress fill
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 18;
      });
    }, 120);

    await new Promise(r => setTimeout(r, 1400));
    clearInterval(interval);
    setProgress(100);
    await new Promise(r => setTimeout(r, 350));

    // Generate client-side CSV statement
    const content = generateCSVContent(stmt);
    downloadFile(content, stmt.name);

    toast.success(`Downloaded ${stmt.name}`);
    setDownloading(null);
    setProgress(0);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: '#26262a' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">Account Statements</h3>
            <p className="text-slate-500 text-xs mt-0.5">Download your monthly statements</p>
          </div>
        </div>
      </div>

      {/* Statement list */}
      <div className="p-4 space-y-3">
        {STATEMENTS.map((stmt) => (
          <motion.div
            key={stmt.id}
            className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(22,22,26,0.7)', border: '1px solid #26262a' }}
            whileHover={{ borderColor: 'rgba(168,85,247,0.3)' }}
          >
            <div className="flex items-center gap-4 p-4">
              {/* File icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)' }}
              >
                📄
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{stmt.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {stmt.period} · {stmt.entries} transactions · {stmt.size}
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Opening {formatINR(stmt.opening)} → Closing {formatINR(stmt.closing)}
                </p>
              </div>

              {/* Download button */}
              <motion.button
                onClick={() => handleDownload(stmt)}
                disabled={!!downloading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 flex-shrink-0 transition-all duration-200 disabled:opacity-50"
                style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}
                whileHover={{ background: 'rgba(168,85,247,0.22)' }}
                whileTap={{ scale: 0.97 }}
              >
                {downloading === stmt.id ? (
                  <span className="w-3.5 h-3.5 border-2 border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                {downloading === stmt.id ? 'Downloading…' : 'Download'}
              </motion.button>
            </div>

            {/* Animated progress bar */}
            <AnimatePresence>
              {downloading === stmt.id && (
                <motion.div
                  className="px-4 pb-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(168,85,247,0.12)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #9333ea, #3b82f6)' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-purple-400/60 text-[10px] mt-1.5">Preparing statement… {Math.round(progress)}%</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
