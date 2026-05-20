import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  wholesalePrice: number;
  stockQuantity: number;
  category: string;
  supplierName: string;
  supplierId: number;
}

interface OfferForm {
  proposedPrice: string;
  quantity: string;
  message: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '8px',
  border: '1px solid #334155', background: '#0f172a', color: '#fff',
  marginBottom: '16px', boxSizing: 'border-box',
};

const Catalog: React.FC = () => {
  const { role: userRole } = JSON.parse(localStorage.getItem('user') || '{}');
  const canMakeOffer = userRole !== 'FOURNISSEUR';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [offerTarget, setOfferTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<OfferForm>({ proposedPrice: '', quantity: '1', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    api.get('/api/catalog/products')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => { setError('Could not load products'); setLoading(false); });
  }, []);

  const openOffer = (product: Product) => {
    setOfferTarget(product);
    setForm({ proposedPrice: String(product.wholesalePrice), quantity: '1', message: '' });
    setSuccessMsg('');
    setError('');
  };

  const closeOffer = () => { setOfferTarget(null); setSuccessMsg(''); };

  const submitOffer = async () => {
    if (!offerTarget) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setSubmitting(true);
    try {
      await api.post('/api/negotiation/offers', {
        productId: offerTarget.id,
        productName: offerTarget.name,
        buyerId: user.id,
        supplierId: offerTarget.supplierId,
        proposedPrice: parseFloat(form.proposedPrice),
        originalPrice: offerTarget.wholesalePrice,
        quantity: parseInt(form.quantity),
        message: form.message,
      });
      setSuccessMsg('Offer submitted!');
      setTimeout(closeOffer, 1500);
    } catch {
      setError('Failed to submit offer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>Product Catalog</h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{products.length} products available</p>

      {error && <div style={{ background: '#3f1f1f', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: '#f87171' }}>⚠️ {error}</div>}

      <input
        type="text" placeholder="Search products..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', marginBottom: '24px' }}
      />

      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
          <p style={{ fontSize: '3rem' }}>📦</p><p>No products found</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map(product => (
          <div key={product.id} style={{ background: '#1e2a3a', borderRadius: '12px', padding: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: '600', margin: 0 }}>{product.name}</h3>
              <span style={{ background: '#1e3a5f', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{product.category}</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '12px', flexGrow: 1 }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Wholesale:</span>
              <span style={{ color: '#34d399', fontWeight: '600' }}>{product.wholesalePrice} MAD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Stock:</span>
              <span>{product.stockQuantity} units</span>
            </div>
            {canMakeOffer && (
              <button
                onClick={() => openOffer(product)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3d5afe, #00bcd4)', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Make an Offer
              </button>
            )}
          </div>
        ))}
      </div>

      {offerTarget && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={e => e.target === e.currentTarget && closeOffer()}
        >
          <div style={{ background: '#1e2a3a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Make an Offer</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
              {offerTarget.name} · {offerTarget.supplierName} · Listed at {offerTarget.wholesalePrice} MAD
            </p>

            {successMsg && <div style={{ background: '#052e16', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#34d399' }}>{successMsg}</div>}

            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Proposed Price (MAD)</label>
            <input type="number" value={form.proposedPrice} onChange={e => setForm({ ...form, proposedPrice: e.target.value })} style={inputStyle} />

            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Quantity</label>
            <input type="number" value={form.quantity} min="1" onChange={e => setForm({ ...form, quantity: e.target.value })} style={inputStyle} />

            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Message (optional)</label>
            <textarea
              value={form.message} rows={3}
              onChange={e => setForm({ ...form, message: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={closeOffer} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={submitOffer}
                disabled={submitting || !form.proposedPrice || !form.quantity}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: submitting ? '#1e3a5f' : 'linear-gradient(135deg, #3d5afe, #00bcd4)', color: '#fff', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Submitting...' : 'Submit Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;