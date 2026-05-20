import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface DashboardData { totalProducts: number; totalOffers: number; acceptedOffers: number; conversionRate: number; totalRevenue: number; topCategory: string; }
interface Product { id: number; name: string; wholesalePrice: number; stockQuantity: number; category: string; supplierName: string; }
interface Offer { id: number; productName: string; proposedPrice: number; quantity: number; status: string; buyerId: number; supplierId: number; }
interface Transaction { id: number; amount: number; currency: string; method: string; status: string; reference: string; createdAt: string | number[]; payerId: number; receiverId: number; }

const formatDate = (raw: string | number[] | undefined): string => {
  if (!raw) return '—';
  let d: Date;
  if (Array.isArray(raw)) {
    d = new Date(raw[0], raw[1] - 1, raw[2], raw[3] || 0, raw[4] || 0);
  } else {
    d = new Date(raw as string);
  }
  if (isNaN(d.getTime())) return String(raw);
  const month = d.toLocaleString('en-GB', { month: 'short' });
  return `${d.getDate()} ${month} ${d.getFullYear()} at ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#fbbf24', ACCEPTED: '#34d399', REJECTED: '#f87171', COUNTER_OFFERED: '#a78bfa', PAID: '#60a5fa',
  COMPLETED: '#34d399', FAILED: '#f87171',
};

const TAB_STYLE = (active: boolean): React.CSSProperties => ({
  padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem',
  background: active ? 'rgba(61,90,254,0.2)' : 'transparent',
  color: active ? '#8187ff' : '#94a3b8',
  borderBottom: active ? '2px solid #3d5afe' : '2px solid transparent',
});

const Admin: React.FC = () => {
  const [tab, setTab] = useState<'kpi' | 'products' | 'offers' | 'transactions'>('kpi');
  const [kpi, setKpi] = useState<DashboardData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/api/analytics/dashboard'),
      api.get('/api/catalog/products'),
      api.get('/api/negotiation/offers'),
      api.get('/api/payment/transactions'),
    ]).then(([kpiRes, prodRes, offerRes, txRes]) => {
      setKpi(kpiRes.data);
      setProducts(prodRes.data);
      setOffers(offerRes.data);
      setTransactions(txRes.data);
      setLoading(false);
    }).catch(() => { setError('Could not load admin data'); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>Admin Panel</h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Global platform overview</p>

      {error && <div style={{ background: '#3f1f1f', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: '#f87171' }}>⚠️ {error}</div>}
      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '0' }}>
        {(['kpi', 'products', 'offers', 'transactions'] as const).map(t => (
          <button key={t} style={TAB_STYLE(tab === t)} onClick={() => setTab(t)}>
            {t === 'kpi' ? 'KPIs' : t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'offers' && offers.length > 0 && <span style={{ marginLeft: '6px', background: '#3d5afe33', color: '#8187ff', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{offers.length}</span>}
            {t === 'transactions' && transactions.length > 0 && <span style={{ marginLeft: '6px', background: '#3d5afe33', color: '#8187ff', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{transactions.length}</span>}
          </button>
        ))}
      </div>

      {/* KPIs */}
      {tab === 'kpi' && kpi && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Products', value: kpi.totalProducts, color: '#60a5fa' },
              { label: 'Total Offers', value: kpi.totalOffers, color: '#a78bfa' },
              { label: 'Accepted Offers', value: kpi.acceptedOffers, color: '#34d399' },
              { label: 'Conversion Rate', value: `${(kpi.conversionRate * 100).toFixed(1)}%`, color: '#fbbf24' },
              { label: 'Total Revenue', value: `${kpi.totalRevenue?.toFixed(2)} MAD`, color: '#34d399' },
              { label: 'Top Category', value: kpi.topCategory || '—', color: '#f472b6' },
            ].map(card => (
              <div key={card.label} style={{ background: '#1e2a3a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 8px' }}>{card.label}</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: card.color, margin: 0 }}>{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {tab === 'products' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['ID', 'Name', 'Category', 'Wholesale Price', 'Stock', 'Supplier'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #1e2a3a' }}>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>#{p.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '600' }}>{p.name}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ background: '#1e3a5f', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{p.category}</span></td>
                  <td style={{ padding: '12px 14px', color: '#34d399', fontWeight: '600' }}>{p.wholesalePrice} MAD</td>
                  <td style={{ padding: '12px 14px', color: p.stockQuantity === 0 ? '#f87171' : '#e2e8f0' }}>{p.stockQuantity}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{p.supplierName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && !loading && <p style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No products.</p>}
        </div>
      )}

      {/* Offers */}
      {tab === 'offers' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['ID', 'Product', 'Status', 'Price', 'Qty', 'Total', 'Buyer', 'Supplier'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #1e2a3a' }}>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>#{o.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '600' }}>{o.productName}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: `${STATUS_COLOR[o.status] || '#94a3b8'}22`, color: STATUS_COLOR[o.status] || '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#60a5fa' }}>{o.proposedPrice} MAD</td>
                  <td style={{ padding: '12px 14px' }}>{o.quantity}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '600' }}>{(o.proposedPrice * o.quantity).toFixed(2)} MAD</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>#{o.buyerId}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>#{o.supplierId}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {offers.length === 0 && !loading && <p style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No offers.</p>}
        </div>
      )}

      {/* Transactions */}
      {tab === 'transactions' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                {['ID', 'Reference', 'Amount', 'Method', 'Status', 'Payer', 'Receiver', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #1e2a3a' }}>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>#{t.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '600', fontFamily: 'monospace', fontSize: '0.8rem' }}>{t.reference}</td>
                  <td style={{ padding: '12px 14px', color: '#34d399', fontWeight: '700' }}>{t.amount} {t.currency}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{t.method}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: `${STATUS_COLOR[t.status] || '#94a3b8'}22`, color: STATUS_COLOR[t.status] || '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>{t.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>#{t.payerId}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>#{t.receiverId}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && !loading && <p style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>No transactions.</p>}
        </div>
      )}
    </div>
  );
};

export default Admin;