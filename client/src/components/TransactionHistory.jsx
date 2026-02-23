/**
 * TransactionHistory.jsx
 * Scrollable frosted-glass transaction list.
 * Uses real API data if provided (mapped from backend shape).
 * Falls back to 20 diverse dummy entries if none exist.
 */
import { motion } from 'framer-motion';

const DUMMY_TRANSACTIONS = [
  { id: 1,  type: 'credit', description: 'Salary Credit',           amount: 85000,  status: 'success', created_at: '2026-02-01T09:00:00Z', icon: '💰' },
  { id: 2,  type: 'debit',  description: 'SWIFT Transfer – London',  amount: 15000,  status: 'success', created_at: '2026-02-02T11:30:00Z', icon: '🌍' },
  { id: 3,  type: 'credit', description: 'Dividend Pay – Q4 2025',   amount: 4250,   status: 'success', created_at: '2026-02-03T08:15:00Z', icon: '📈' },
  { id: 4,  type: 'debit',  description: 'Cloud API Subscription',   amount: 1999,   status: 'success', created_at: '2026-02-04T00:00:00Z', icon: '☁️' },
  { id: 5,  type: 'debit',  description: 'ATM Withdrawal',           amount: 5000,   status: 'success', created_at: '2026-02-05T14:20:00Z', icon: '🏧' },
  { id: 6,  type: 'credit', description: 'GDP Disbursement – IND',   amount: 12500,  status: 'success', created_at: '2026-02-06T10:00:00Z', icon: '🇮🇳' },
  { id: 7,  type: 'debit',  description: 'Card Payment – Amazon',    amount: 3499,   status: 'success', created_at: '2026-02-07T18:45:00Z', icon: '🛒' },
  { id: 8,  type: 'debit',  description: 'EMI Debit – Home Loan',    amount: 22000,  status: 'success', created_at: '2026-02-08T06:00:00Z', icon: '🏠' },
  { id: 9,  type: 'credit', description: 'UPI Transfer – Received',  amount: 8000,   status: 'success', created_at: '2026-02-09T13:10:00Z', icon: '📱' },
  { id: 10, type: 'debit',  description: 'Global Trade Settlement',  amount: 45000,  status: 'pending', created_at: '2026-02-10T09:30:00Z', icon: '🤝' },
  { id: 11, type: 'credit', description: 'Freelance Payment',        amount: 20000,  status: 'success', created_at: '2026-02-11T15:00:00Z', icon: '💼' },
  { id: 12, type: 'debit',  description: 'UPI – Swiggy',             amount: 549,    status: 'success', created_at: '2026-02-12T20:15:00Z', icon: '🍕' },
  { id: 13, type: 'debit',  description: 'Electricity Bill',         amount: 1200,   status: 'success', created_at: '2026-02-13T08:00:00Z', icon: '⚡' },
  { id: 14, type: 'credit', description: 'Fixed Deposit Matured',    amount: 50000,  status: 'success', created_at: '2026-02-14T10:00:00Z', icon: '🏦' },
  { id: 15, type: 'debit',  description: 'SWIFT Transfer – USA',     amount: 25000,  status: 'failed',  created_at: '2026-02-15T11:00:00Z', icon: '🌐' },
  { id: 16, type: 'debit',  description: 'SIM Recharge',             amount: 299,    status: 'success', created_at: '2026-02-16T12:00:00Z', icon: '📡' },
  { id: 17, type: 'credit', description: 'Cashback – HDFC Card',     amount: 450,    status: 'success', created_at: '2026-02-17T09:00:00Z', icon: '🎁' },
  { id: 18, type: 'debit',  description: 'OTT Subscriptions',        amount: 599,    status: 'success', created_at: '2026-02-18T00:00:00Z', icon: '🎬' },
  { id: 19, type: 'debit',  description: 'EMI Debit – Car Loan',     amount: 12500,  status: 'pending', created_at: '2026-02-19T07:00:00Z', icon: '🚗' },
  { id: 20, type: 'credit', description: 'Investment Returns',       amount: 7800,   status: 'success', created_at: '2026-02-20T14:00:00Z', icon: '📊' },
];

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const statusConfig = {
  success: { label: 'Success', dot: '#22c55e', text: 'text-green-400' },
  pending: { label: 'Pending', dot: '#94a3b8', text: 'text-slate-400' },
  failed:  { label: 'Failed',  dot: '#ef4444', text: 'text-red-400'   },
};

function getIcon(tx) {
  if (tx.icon) return tx.icon;
  if (tx.type === 'credit') return '↑';
  return '↓';
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: '2-digit',
  });
}

export default function TransactionHistory({ transactions = [] }) {
  const data = transactions.length > 0 ? transactions : DUMMY_TRANSACTIONS;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: '#26262a' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-base">Transaction History</h3>
            <p className="text-slate-500 text-xs mt-0.5">{data.length} recent transactions</p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', border: '1px solid rgba(168,85,247,0.25)' }}>
            Feb 2026
          </span>
        </div>
      </div>

      {/* Transactions list */}
      <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
        <div className="p-4 space-y-2">
          {data.map((tx, i) => {
            const isCredit = tx.type === 'credit' || (tx.amount > 0 && tx.type !== 'debit');
            const sc       = statusConfig[tx.status] || statusConfig.success;

            return (
              <motion.div
                key={tx.id || tx.txid || i}
                className="tx-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.3 }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: isCredit ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
                    border:     isCredit ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.18)',
                  }}
                >
                  {getIcon(tx)}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {tx.description || tx.desc || 'Transaction'}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {formatDate(tx.created_at || tx.date || new Date().toISOString())}
                    {tx.recipient ? ` · to ${tx.recipient}` : ''}
                  </p>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                  <span className={`text-xs ${sc.text} hidden sm:block`}>{sc.label}</span>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0 min-w-[90px]">
                  <p className={`text-sm font-semibold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                    {isCredit ? '+' : '-'}{formatINR(Math.abs(Number(tx.amount)))}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
