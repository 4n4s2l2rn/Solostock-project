import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  method: string;
  status: string;
  reference: string;
  createdAt: string | number[];
  payerId: number;
  receiverId: number;
}

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: '#34d399', PENDING: '#fbbf24', FAILED: '#f87171', REFUNDED: '#a78bfa',
};

const formatDate = (raw: string | number[] | undefined): string => {
  if (!raw) return '—';
  let d: Date;
  if (Array.isArray(raw)) {
    // LocalDateTime serialized as [year, month, day, hour, minute, second?, nano?]
    d = new Date(raw[0], raw[1] - 1, raw[2], raw[3] || 0, raw[4] || 0);
  } else {
    d = new Date(raw as string);
  }
  if (isNaN(d.getTime())) return String(raw);
  const day = d.getDate();
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} at ${hh}:${mm}`;
};

const Payments: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.id || 0;
  const role: string = user.role || 'ACHETEUR';
  const isBuyer = role === 'ACHETEUR';
  const isSupplier = role === 'FOURNISSEUR';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const url = (isBuyer && userId > 0)
      ? `/api/payment/transactions/payer/${userId}`
      : '/api/payment/transactions';

    api.get(url)
      .then(res => {
        const data: Transaction[] = res.data;
        const filtered = isSupplier && userId > 0
          ? data.filter(t => t.receiverId === userId)
          : data;
        setTransactions(filtered);
        setLoading(false);
      })
      .catch(() => { setError('Could not load transactions'); setLoading(false); });
  }, []);

  const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const title = isBuyer ? 'My Payments' : isSupplier ? 'My Earnings' : 'All Transactions';
  const subtitle = isBuyer ? 'Your outgoing payment history' : isSupplier ? 'Payments received from buyers' : 'Platform-wide transaction log';

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>{title}</h1>
      <p style={{ color: '#94a3b8', marginBottom: '16px' }}>{subtitle}</p>

      {/* Summary card */}
      {!loading && transactions.length > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          background: isBuyer ? 'rgba(96,165,250,0.08)' : 'rgba(52,211,153,0.08)',
          border: `1px solid ${isBuyer ? 'rgba(96,165,250,0.25)' : 'rgba(52,211,153,0.25)'}`,
          borderRadius: '10px', padding: '12px 20px', marginBottom: '24px',
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {isBuyer ? 'Total Spent:' : isSupplier ? 'Total Earned:' : 'Total Revenue:'}
          </span>
          <span style={{ color: isBuyer ? '#60a5fa' : '#34d399', fontWeight: '700', fontSize: '1.2rem' }}>
            {total.toFixed(2)} MAD
          </span>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>
            · {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {error && (
        <div style={{ background: '#3f1f1f', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: '#f87171' }}>
          ⚠️ {error}
        </div>
      )}
      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}

      {!loading && transactions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
          <p style={{ fontSize: '3rem' }}>💳</p>
          <p>{isBuyer ? 'No payments yet' : isSupplier ? 'No earnings yet' : 'No transactions yet'}</p>
          <p style={{ fontSize: '0.875rem', marginTop: '8px', color: '#64748b' }}>
            {isBuyer
              ? 'Accept a supplier offer and pay from My Offers.'
              : isSupplier
              ? 'Accept buyer offers to receive payments.'
              : 'Transactions will appear here once payments are made.'}
          </p>
        </div>
      )}

      {transactions.length > 0 && (
        <div style={{ background: '#1e2a3a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
          {transactions.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: i < transactions.length - 1 ? '1px solid #263447' : 'none',
              }}
            >
              <div>
                <p style={{ fontWeight: '600', margin: '0 0 3px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', letterSpacing: '0.05em' }}>
                  {t.reference}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0 0 3px' }}>
                  {t.method}
                  {isBuyer
                    ? <span> · to supplier <span style={{ color: '#94a3b8' }}>#{t.receiverId}</span></span>
                    : <span> · from buyer <span style={{ color: '#94a3b8' }}>#{t.payerId}</span></span>}
                </p>
                <p style={{ color: '#475569', fontSize: '0.75rem', margin: 0 }}>
                  {formatDate(t.createdAt)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '700', color: isBuyer ? '#60a5fa' : '#34d399', margin: '0 0 4px', fontSize: '1rem' }}>
                  {isBuyer ? '−' : '+'}{t.amount?.toFixed(2)} {t.currency || 'MAD'}
                </p>
                <span style={{
                  background: `${STATUS_COLOR[t.status] || '#94a3b8'}22`,
                  color: STATUS_COLOR[t.status] || '#94a3b8',
                  padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700',
                }}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;