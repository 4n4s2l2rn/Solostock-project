import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Offer {
  id: number;
  productName: string;
  proposedPrice: number;
  quantity: number;
  status: string;
  message: string;
  supplierId: number;
}

const statusColor: Record<string, string> = {
  PENDING: '#fbbf24', ACCEPTED: '#34d399', REJECTED: '#f87171', COUNTER_OFFERED: '#a78bfa',
};

const METHODS = ['VIREMENT', 'CREDIT', 'TRAITE', 'CASH'];

const btnBase: React.CSSProperties = {
  flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
  fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '8px',
  border: '1px solid #334155', background: '#0f172a', color: '#fff',
  marginBottom: '16px', boxSizing: 'border-box',
};

const Negotiation: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [counterTarget, setCounterTarget] = useState<number | null>(null);
  const [counterPrice, setCounterPrice] = useState('');

  // Payment modal state
  const [payTarget, setPayTarget] = useState<Offer | null>(null);
  const [payMethod, setPayMethod] = useState('VIREMENT');
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [paySuccess, setPaySuccess] = useState('');
  const [paidOfferIds, setPaidOfferIds] = useState<Set<number>>(new Set());

  const loadOffers = () => {
    setLoading(true);
    setError('');
    api.get('/api/negotiation/offers')
      .then(res => { setOffers(res.data); setLoading(false); })
      .catch(() => { setError('Could not load offers'); setLoading(false); });
  };

  useEffect(() => { loadOffers(); }, []);

  const accept = async (id: number) => {
    setActionLoading(id);
    try {
      await api.put(`/api/negotiation/offers/${id}/accept`);
      loadOffers();
    } catch { setError('Accept failed'); }
    finally { setActionLoading(null); }
  };

  const reject = async (id: number) => {
    setActionLoading(id);
    try {
      await api.put(`/api/negotiation/offers/${id}/reject`);
      loadOffers();
    } catch { setError('Reject failed'); }
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

  const openPayment = (offer: Offer) => {
    setPayTarget(offer);
    setPayMethod('VIREMENT');
    setPaySuccess('');
    setError('');
  };

  const submitPayment = async () => {
    if (!payTarget) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || 0;
    setPaySubmitting(true);
    try {
      await api.post('/api/payment/pay', {
        payerId: userId,
        receiverId: payTarget.supplierId,
        amount: payTarget.proposedPrice * payTarget.quantity,
        method: payMethod,
      });
      setPaySuccess('Payment processed successfully!');
      setPaidOfferIds(prev => new Set(prev).add(payTarget.id));
      setTimeout(() => { setPayTarget(null); setPaySuccess(''); }, 1500);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setPaySubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Negotiation</h1>
        <button
          onClick={() => navigate('/catalog')}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3d5afe, #00bcd4)', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
        >
          + New Offer
        </button>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Manage your B2B offers</p>

      {error && <div style={{ background: '#3f1f1f', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: '#f87171' }}>⚠️ {error}</div>}
      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}

      {!loading && offers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
          <p style={{ fontSize: '3rem' }}>🤝</p>
          <p>No offers yet</p>
          <button
            onClick={() => navigate('/catalog')}
            style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3d5afe, #00bcd4)', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
          >
            Browse Catalog
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {offers.map(offer => (
          <div key={offer.id} style={{ background: '#1e2a3a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: '600', margin: 0 }}>{offer.productName}</h3>
              <span style={{ color: statusColor[offer.status] || '#94a3b8', fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {offer.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Price:</span>
              <span style={{ color: '#60a5fa', fontWeight: '600' }}>{offer.proposedPrice} MAD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Qty:</span>
              <span>{offer.quantity}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: offer.message ? '6px' : '0' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total:</span>
              <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{(offer.proposedPrice * offer.quantity).toFixed(2)} MAD</span>
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
                    <button
                      onClick={() => accept(offer.id)}
                      disabled={actionLoading === offer.id}
                      style={{ ...btnBase, background: '#052e16', color: '#34d399' }}
                    >
                      {actionLoading === offer.id ? '...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => reject(offer.id)}
                      disabled={actionLoading === offer.id}
                      style={{ ...btnBase, background: '#3f1f1f', color: '#f87171' }}
                    >
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

            {/* ACCEPTED: Pay Now or Payment Done */}
            {offer.status === 'ACCEPTED' && (
              <div style={{ marginTop: '16px' }}>
                {paidOfferIds.has(offer.id) ? (
                  <div style={{ textAlign: 'center', padding: '8px', borderRadius: '6px', background: '#052e16', color: '#34d399', fontWeight: '600', fontSize: '0.875rem' }}>
                    ✓ Payment Done
                  </div>
                ) : (
                  <button
                    onClick={() => openPayment(offer)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #059669, #34d399)', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    Pay Now — {(offer.proposedPrice * offer.quantity).toFixed(2)} MAD
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {payTarget && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={e => e.target === e.currentTarget && setPayTarget(null)}
        >
          <div style={{ background: '#1e2a3a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '420px', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: 0, marginBottom: '4px' }}>Confirm Payment</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
              {payTarget.productName} · {payTarget.quantity} unit{payTarget.quantity !== 1 ? 's' : ''}
            </p>

            {paySuccess && (
              <div style={{ background: '#052e16', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#34d399' }}>
                {paySuccess}
              </div>
            )}

            {/* Read-only amount */}
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Amount (MAD)</label>
            <div style={{ ...inputStyle, color: '#34d399', fontWeight: '700', fontSize: '1.1rem', cursor: 'default' }}>
              {(payTarget.proposedPrice * payTarget.quantity).toFixed(2)}
            </div>

            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Payment Method</label>
            <select
              value={payMethod}
              onChange={e => setPayMethod(e.target.value)}
              style={inputStyle}
            >
              {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {/* Hidden pre-filled values shown as read-only info */}
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px 14px', marginBottom: '24px', fontSize: '0.8rem', color: '#64748b' }}>
              Paying to supplier #{payTarget.supplierId}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setPayTarget(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                disabled={paySubmitting}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: paySubmitting ? '#1e3a5f' : 'linear-gradient(135deg, #059669, #34d399)', color: '#fff', fontWeight: '700', cursor: paySubmitting ? 'not-allowed' : 'pointer' }}
              >
                {paySubmitting ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Negotiation;