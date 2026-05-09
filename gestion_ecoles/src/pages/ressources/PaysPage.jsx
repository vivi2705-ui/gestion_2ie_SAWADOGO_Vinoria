// src/pages/ressources/PaysPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PaysPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => { 
    axios.get('/api/pays')
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => { setError('Erreur chargement.'); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#94a3b8', padding: '48px', textAlign: 'center' }}>Chargement...</div>;
  if (error)   return <div style={{ color: '#dc2626', padding: '16px' }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontSize: '22px' }}>🌍</span>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Pays</h1>
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Liste des pays disponibles dans le système.</p>
      </div>

      {/* Stats */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'inline-block' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Total</div>
        <div style={{ fontSize: '26px', fontWeight: '600', color: '#1e293b' }}>{data.length}</div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        {data.map(pays => (
          <div key={pays.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
              🌍
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{pays.libelle}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{pays.code ?? '—'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
