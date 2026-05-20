import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  wholesalePrice: number;
  retailPrice: number;
  stockQuantity: number;
  minOrderQuantity: number;
  category: string;
  status: string;
}

interface ProductForm {
  name: string;
  description: string;
  wholesalePrice: string;
  retailPrice: string;
  stockQuantity: string;
  minOrderQuantity: string;
  category: string;
}

const CATEGORIES = ['ELECTRONIQUE', 'ALIMENTAIRE', 'TEXTILE', 'MATERIEL_BUREAU', 'COSMETIQUE', 'MOBILIER', 'INFORMATIQUE', 'AUTRE'];

const EMPTY_FORM: ProductForm = {
  name: '', description: '', wholesalePrice: '', retailPrice: '',
  stockQuantity: '', minOrderQuantity: '1', category: 'ELECTRONIQUE',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '8px',
  border: '1px solid #334155', background: '#0f172a', color: '#fff',
  marginBottom: '16px', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px',
};

const MyProducts: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || 0;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadProducts = () => {
    setLoading(true);
    const url = userId > 0 ? `/api/catalog/products/supplier/${userId}` : '/api/catalog/products';
    api.get(url)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => { setError('Could not load products'); setLoading(false); });
  };

  useEffect(() => { loadProducts(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setSuccessMsg('');
    setError('');
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      description: p.description || '',
      wholesalePrice: String(p.wholesalePrice),
      retailPrice: String(p.retailPrice || ''),
      stockQuantity: String(p.stockQuantity),
      minOrderQuantity: String(p.minOrderQuantity || 1),
      category: p.category,
    });
    setSuccessMsg('');
    setError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditTarget(null); setSuccessMsg(''); };

  const submitProduct = async () => {
    setSubmitting(true);
    const payload = {
      name: form.name,
      description: form.description,
      wholesalePrice: parseFloat(form.wholesalePrice),
      retailPrice: parseFloat(form.retailPrice) || parseFloat(form.wholesalePrice),
      stockQuantity: parseInt(form.stockQuantity),
      minOrderQuantity: parseInt(form.minOrderQuantity) || 1,
      category: form.category,
      supplierId: userId,
      supplierName: user.fullName || user.email,
    };
    try {
      if (editTarget) {
        await api.put(`/api/catalog/products/${editTarget.id}`, payload);
      } else {
        await api.post('/api/catalog/products', payload);
      }
      setSuccessMsg(editTarget ? 'Product updated!' : 'Product created!');
      loadProducts();
      setTimeout(closeModal, 1200);
    } catch {
      setError('Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/api/catalog/products/${id}`);
      loadProducts();
    } catch { setError('Delete failed'); }
  };

  const isFormValid = form.name && form.wholesalePrice && form.stockQuantity;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>My Products</h1>
        <button
          onClick={openAdd}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3d5afe, #00bcd4)', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
        >
          + Add Product
        </button>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{products.length} product{products.length !== 1 ? 's' : ''} listed in the catalog</p>

      {error && <div style={{ background: '#3f1f1f', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: '#f87171' }}>⚠️ {error}</div>}
      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
          <p style={{ fontSize: '3rem' }}>📦</p>
          <p>No products yet</p>
          <button
            onClick={openAdd}
            style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3d5afe, #00bcd4)', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
          >
            Add Your First Product
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {products.map(product => (
          <div key={product.id} style={{ background: '#1e2a3a', borderRadius: '12px', padding: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: '600', margin: 0 }}>{product.name}</h3>
              <span style={{ background: '#1e3a5f', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{product.category}</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '12px', flexGrow: 1 }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Wholesale:</span>
              <span style={{ color: '#34d399', fontWeight: '600' }}>{product.wholesalePrice} MAD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Stock:</span>
              <span style={{ color: product.stockQuantity === 0 ? '#f87171' : '#e2e8f0' }}>{product.stockQuantity} units</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => openEdit(product)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid rgba(61,90,254,0.5)', background: 'rgba(61,90,254,0.1)', color: '#8187ff', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#3f1f1f', color: '#f87171', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px', overflowY: 'auto' }}
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div style={{ background: '#1e2a3a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '520px', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: 0, marginBottom: '24px' }}>
              {editTarget ? 'Edit Product' : 'Add New Product'}
            </h2>

            {successMsg && <div style={{ background: '#052e16', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#34d399' }}>{successMsg}</div>}

            <label style={labelStyle}>Product Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Laptop Pro 15" style={inputStyle} />

            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Product description..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Wholesale Price (MAD) *</label>
                <input type="number" value={form.wholesalePrice} onChange={e => setForm({ ...form, wholesalePrice: e.target.value })} placeholder="0.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Retail Price (MAD)</label>
                <input type="number" value={form.retailPrice} onChange={e => setForm({ ...form, retailPrice: e.target.value })} placeholder="0.00" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Stock Quantity *</label>
                <input type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Min Order Qty</label>
                <input type="number" value={form.minOrderQuantity} onChange={e => setForm({ ...form, minOrderQuantity: e.target.value })} placeholder="1" style={inputStyle} />
              </div>
            </div>

            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={closeModal} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={submitProduct}
                disabled={submitting || !isFormValid}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: submitting || !isFormValid ? '#1e3a5f' : 'linear-gradient(135deg, #3d5afe, #00bcd4)', color: '#fff', fontWeight: '600', cursor: submitting || !isFormValid ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Saving...' : (editTarget ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;