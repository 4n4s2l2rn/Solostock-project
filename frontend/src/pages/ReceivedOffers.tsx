import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Offer {
  id: number;
  productName: string;
  proposedPrice: number;
  quantity: number;
  status: string;
  message: string;
  buyerId: number;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#fbbf24', ACCEPTED: '#34d399', REJECTED: '#f87171',
  COUNTER_OFFERED: '#a78bfa', PAID: '#60a5fa',
};

const btnBase: React.CSSProperties = {
  flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
  fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem',
};

const ReceivedOffers: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || 0;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [counterTarget, setCounterTarget] = useState<number | null>(null);
  const [counterPrice, setCounterPrice] = useState('');

  const loadOffers = () => {
    setLoading(true);
    setError('');
    const url = userId > 0 ? `/api/negotiation/offers/supplier/${userId}` : '/api/negotiation/offers';
    api.get(url)
      .then(res => { setOffers(res.data); setLoading(false); })
      .catch(() => { setError('Could not load offers'); setLoading(false); });
  };

  useEffect(() => { loadOffers(); }, []);

  const accept = async (id: number) => {
    setActionLoading(id);
    try { await api.put(`/api/negotiation/offers/${id}/accept`); loadOffers(); }
    catch { setError('Accept failed'); }
    finally { setActionLoading(null); }
  };

  const reject = async (id: number) => {
    setActionLoading(id);
    try { await api.put(`/api/negotiation/offers/${id}/reject`); loadOffers(); }
    catch { setError('Reject failed'); }
    finally { setActionLoading(null); }
  };

  const counter = async (id: number) => {
    if (!counterPrice) return;
    setActionLoading(id);
    try {
      await api.put(`/api/negotiation/offers/${id}/counter`, null, {
        params: { newPrice: parseFloat(counterPrice) },
      });
      setCounterTarget(null);
      setCounterPrice('');
      loadOffers();
    } catch { setError('Counter offer failed'); }
    finally { setActionLoading(null); }
  };

  const pendingCount = offers.filter(o => o.status === 'PENDING').length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Received Offers</h1>
        {pendingCount > 0 && (
          <span style={{ background: '#fbbf2422', color: '#fbbf24', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid #fbbf2444' }}>
            {pendingCount} pending
          </span>
        )}
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Offers from buyers on your products</p>

      {error && <div style={{ background: '#3f1f1f', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: '#f87171' }}>⚠️ {error}</div>}
      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}

      {!loading && offers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
          <p style={{ fontSize: '3rem' }}>📥</p>
          <p>No offers received yet</p>
          <p style={{ fontSize: '0.875rem', marginTop: '8px', color: '#64748b' }}>Buyers will make offers on your products from the catalog.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {offers.map(offer => {
          const color = STATUS_COLOR[offer.status] || '#94a3b8';
          return (
            <div
              key={offer.id}
              style={{ background: '#1e2a3a', borderRadius: '12px', padding: '20px', border: `1px solid ${offer.status === 'PENDING' ? 'rgba(251,191,36,0.35)' : '#334155'}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontWeight: '600', margin: 0 }}>{offer.productName}</h3>
                <span style={{ background: `${color}22`, color, padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {offer.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Buyer #:</span>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{offer.buyerId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Offered Price:</span>
                <span style={{ color: '#60a5fa', fontWeight: '600' }}>{offer.proposedPrice} MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Qty:</span>
                <span>{offer.quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: offer.message ? '6px' : '0' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total:</span>
                <span style={{ color: '#e2e8f0', fontWeight: '700' }}>{(offer.proposedPrice * offer.quantity).toFixed(2)} MAD</span>
              </div>
              {offer.message && (
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', marginTop: '8px', marginBottom: 0 }}>"{offer.message}"</p>
              )}

              {/* PENDING: Accept / Reject / Counter */}
              {offer.status === 'PENDING' && (
                <div style={{ marginTop: '16px' }}>
                  {counterTarget === offer.id ? (
                    <div>
                      <input
                        type="number"
                        placeholder="Counter price (MAD)"
                        value={counterPrice}
                        onChange={e => setCounterPrice(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', marginBottom: '8px', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => { setCounterTarget(null); setCounterPrice(''); }}
                          style={{ ...btnBase, border: '1px solid #334155', background: 'transparent', color: '#94a3b8' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => counter(offer.id)}
                          disabled={actionLoading === offer.id || !counterPrice}
                          style={{ ...btnBase, background: '#92400e', color: '#fbbf24', cursor: !counterPrice ? 'not-allowed' : 'pointer' }}
                        >
                          {actionLoading === offer.id ? '...' : 'Send Counter'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => accept(offer.id)} disabled={actionLoading === offer.id} style={{ ...btnBase, background: '#052e16', color: '#34d399' }}>
                        {actionLoading === offer.id ? '...' : 'Accept'}
                      </button>
                      <button onClick={() => reject(offer.id)} disabled={actionLoading === offer.id} style={{ ...btnBase, background: '#3f1f1f', color: '#f87171' }}>
                        {actionLoading === offer.id ? '...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => { setCounterTarget(offer.id); setCounterPrice(String(offer.proposedPrice)); }}
                        disabled={actionLoading === offer.id}
                        style={{ ...btnBase, background: '#422006', color: '#fbbf24' }}
                      >
                        Counter
                      </button>
                    </div>
                  )}
                </div>
              )}

              {offer.status === 'PAID' && (
                <div style={{ marginTop: '12px', textAlign: 'center', padding: '8px', borderRadius: '6px', background: '#052e16', color: '#34d399', fontWeight: '600', fontSize: '0.875rem' }}>
                  ✓ Payment Received
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReceivedOffers;