/**
 * WorldBankGDP.jsx
 * GDP insight widget using World Bank RapidAPI.
 * Falls back to dummy data gracefully.
 * Isolated — does NOT modify any existing service.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWorldBankGDP } from '../services/worldBankService';

const FLAG = { IND: '🇮🇳', USA: '🇺🇸', CHN: '🇨🇳', DEU: '🇩🇪', GBR: '🇬🇧', JPN: '🇯🇵' };

export default function WorldBankGDP() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt] = useState(() =>
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  );

  useEffect(() => {
    fetchWorldBankGDP().then(d => { setData(d); setLoading(false); });
  }, []);

  const maxGDP = Math.max(...data.map(d => Number(d.gdp)), 1);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: '#26262a' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}
            >
              🌍
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Global GDP Insights</h3>
              <p className="text-slate-500 text-xs mt-0.5">World Bank · RapidAPI</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated {updatedAt}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl shimmer-bg" />
          ))
        ) : (
          data.map((item, i) => {
            const barWidth = ((Number(item.gdp) / maxGDP) * 100).toFixed(1);
            const isPositive = (item.growth || '').startsWith('+');

            return (
              <motion.div
                key={item.code}
                className="space-y-1.5"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{FLAG[item.code] || '🌐'}</span>
                    <span className="text-slate-300 font-medium">{item.country}</span>
                    <span className="text-slate-600 text-xs">{item.code}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.growth}
                    </span>
                    <span className="text-white font-semibold text-xs">
                      ${item.gdp}{item.unit}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #9333ea, #3b82f6)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer tag */}
      <div className="px-6 pb-4">
        <div className="text-center text-[10px] text-slate-600 border-t pt-3" style={{ borderColor: '#26262a' }}>
          Data sourced from World Bank via RapidAPI · GDP in USD Trillions
        </div>
      </div>
    </div>
  );
}
