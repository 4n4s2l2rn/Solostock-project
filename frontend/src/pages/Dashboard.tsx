import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface DashboardData {
  totalProducts: number;
  totalOffers: number;
  acceptedOffers: number;
  conversionRate: number;
  totalRevenue: number;
  topCategory: string;
}

const kpiCard = (label: string, value: string | number, color: string) => (
  <div style={{ background: '#1e2a3a', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 8px' }}>{label}</p>
    <p style={{ fontSize: '2rem', fontWeight: 'bold', color, margin: 0 }}>{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.id || 0;
  const role: string = user.role || 'ACHETEUR';

  const [adminData, setAdminData] = useState<DashboardData | null>(null);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [productsAvailable, setProductsAvailable] = useState(0);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<any[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);

    if (role === 'ADMIN') {
      api.get('/api/analytics/dashboard')
        .then(res => { setAdminData(res.data); setLoading(false); })
        .catch(() => { setError('Could not load dashboard'); setLoading(false); });

    } else if (role === 'ACHETEUR') {
      const offersUrl = userId > 0 ? `/api/negotiation/offers/buyer/${userId}` : '/api/negotiation/offers';
      Promise.all([
        api.get(offersUrl).catch(() => ({ data: [] })),
        userId > 0 ? api.get(`/api/payment/transactions/payer/${userId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        api.get('/api/catalog/products').catch(() => ({ data: [] })),
      ]).then(([offersRes, paymentsRes, productsRes]) => {
        setMyOffers(offersRes.data as any[]);
        const payments = paymentsRes.data as any[];
        setTotalSpent(payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0));
        setProductsAvailable((productsRes.data as any[]).length);
        setLoading(false);
      }).catch(() => { setError('Could not load dashboard'); setLoading(false); });

    } else if (role === 'FOURNISSEUR') {
      const offersUrl = userId > 0 ? `/api/negotiation/offers/supplier/${userId}` : '/api/negotiation/offers';
      const productsUrl = userId > 0 ? `/api/catalog/products/supplier/${userId}` : '/api/catalog/products';
      Promise.all([
        api.get(offersUrl).catch(() => ({ data: [] })),
        api.get('/api/payment/transactions').catch(() => ({ data: [] })),
        api.get(productsUrl).catch(() => ({ data: [] })),
      ]).then(([offersRes, paymentsRes, productsRes]) => {
        const offers = offersRes.data as any[];
        setReceivedOffers(offers);
        const payments = paymentsRes.data as any[];
        const mine = userId > 0 ? payments.filter((p: any) => p.receiverId === userId) : payments;
        setTotalEarned(mine.reduce((sum: number, p: any) => sum + (p.amount || 0), 0));
        setMyProducts(productsRes.data as any[]);
        setLoading(false);
      }).catch(() => { setError('Could not load dashboard'); setLoading(false); });
    }
  }, []);

  const greeting = role === 'FOURNISSEUR' ? 'Welcome back, Supplier' : role === 'ADMIN' ? 'Admin Overview' : 'Welcome back, Buyer';
  const acceptedOffers = myOffers.filter(o => o.status === 'ACCEPTED' || o.status === 'PAID').length;
  const pendingOffers = receivedOffers.filter(o => o.status === 'PENDING').length;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>Dashboard</h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{greeting} — {user.fullName || user.email}</p>

      {error && <div style={{ background: '#3f1f1f', borderRadius: '8px', padding: '12px', marginBottom: '24px', color: '#f87171' }}>⚠️ {error}</div>}
      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}

      {!loading && (
        <>
          {role === 'ACHETEUR' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {kpiCard('My Offers', myOffers.length, '#a78bfa')}
                {kpiCard('Accepted Offers', acceptedOffers, '#34d399')}
                {kpiCard('Total Spent', `${totalSpent.toFixed(0)} MAD`, '#fbbf24')}
                {kpiCard('Products Available', productsAvailable, '#60a5fa')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div
                  onClick={() => navigate('/catalog')}
                  style={{ background: 'linear-gradient(135deg, rgba(61,90,254,0.15), rgba(0,188,212,0.1))', borderRadius: '12px', padding: '20px', border: '1px solid rgba(61,90,254,0.25)', cursor: 'pointer' }}
                >
                  <p style={{ color: '#8187ff', fontWeight: '700', fontSize: '1rem', margin: '0 0 6px' }}>Browse Catalog →</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Find products and make offers</p>
                </div>
                <div
                  onClick={() => navigate('/my-offers')}
                  style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(52,211,153,0.08))', borderRadius: '12px', padding: '20px', border: '1px solid rgba(167,139,250,0.25)', cursor: 'pointer' }}
                >
                  <p style={{ color: '#a78bfa', fontWeight: '700', fontSize: '1rem', margin: '0 0 6px' }}>My Offers ({myOffers.length}) →</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Track status and pay accepted offers</p>
                </div>
              </div>
            </>
          )}

          {role === 'FOURNISSEUR' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {kpiCard('My Products', myProducts.length, '#60a5fa')}
                {kpiCard('Received Offers', receivedOffers.length, '#a78bfa')}
                {kpiCard('Pending Offers', pendingOffers, '#fbbf24')}
                {kpiCard('Total Earned', `${totalEarned.toFixed(0)} MAD`, '#34d399')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div
                  onClick={() => navigate('/my-products')}
                  style={{ background: 'linear-gradient(135deg, rgba(0,230,118,0.1), rgba(0,188,212,0.08))', borderRadius: '12px', padding: '20px', border: '1px solid rgba(0,230,118,0.25)', cursor: 'pointer' }}
                >
                  <p style={{ color: '#00e676', fontWeight: '700', fontSize: '1rem', margin: '0 0 6px' }}>My Products →</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Manage your catalog listings</p>
                </div>
                <div
                  onClick={() => navigate('/received-offers')}
                  style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(167,139,250,0.08))', borderRadius: '12px', padding: '20px', border: `1px solid ${pendingOffers > 0 ? 'rgba(251,191,36,0.5)' : 'rgba(251,191,36,0.2)'}`, cursor: 'pointer' }}
                >
                  <p style={{ color: '#fbbf24', fontWeight: '700', fontSize: '1rem', margin: '0 0 6px' }}>
                    Received Offers {pendingOffers > 0 ? <span style={{ background: '#fbbf2422', padding: '1px 7px', borderRadius: '10px', fontSize: '0.8rem' }}>{pendingOffers} pending</span> : ''} →
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Accept, reject or counter buyer offers</p>
                </div>
              </div>
            </>
          )}

          {role === 'ADMIN' && adminData && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {kpiCard('Total Products', adminData.totalProducts, '#60a5fa')}
                {kpiCard('Total Offers', adminData.totalOffers, '#a78bfa')}
                {kpiCard('Accepted Offers', adminData.acceptedOffers, '#34d399')}
                {kpiCard('Total Revenue', `${adminData.totalRevenue?.toFixed(0)} MAD`, '#fbbf24')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div
                  onClick={() => navigate('/admin')}
                  style={{ background: 'linear-gradient(135deg, rgba(255,82,82,0.1), rgba(61,90,254,0.08))', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,82,82,0.25)', cursor: 'pointer' }}
                >
                  <p style={{ color: '#ff5252', fontWeight: '700', fontSize: '1rem', margin: '0 0 6px' }}>Admin Panel →</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>All products, offers, and transactions</p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;