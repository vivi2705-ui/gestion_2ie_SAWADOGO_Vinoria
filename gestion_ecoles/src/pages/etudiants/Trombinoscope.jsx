// src/pages/etudiants/Trombinoscope.jsx
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { X, Search, Users, Mail, Phone, Globe, Calendar } from 'lucide-react';
import axios from 'axios';

// Generate a consistent gradient from a string
const gradientFromName = (str = '') => {
  const gradients = [
    ['#6366f1', '#8b5cf6'],
    ['#06b6d4', '#0891b2'],
    ['#10b981', '#059669'],
    ['#f59e0b', '#d97706'],
    ['#ec4899', '#db2777'],
    ['#ef4444', '#dc2626'],
    ['#8b5cf6', '#7c3aed'],
    ['#14b8a6', '#0d9488'],
    ['#f97316', '#ea580c'],
    ['#6366f1', '#ec4899'],
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
};

const Avatar = ({ nom, prenoms, size = 80 }) => {
  const initials = `${nom?.[0] ?? ''}${prenoms?.[0] ?? ''}`.toUpperCase();
  const [c1, c2] = gradientFromName(nom + prenoms);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: '700', color: '#fff',
      fontFamily: "'Syne', sans-serif",
      flexShrink: 0,
      boxShadow: `0 4px 14px ${c1}55`,
    }}>
      {initials}
    </div>
  );
};

export default function Trombinoscope() {
  const [etudiants, setEtudiants]   = useState([]);
  const [pays, setPays]             = useState([]);
  const [civilites, setCivilites]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterPays, setFilterPays] = useState('');
  const [selected, setSelected]     = useState(null);
  const [view, setView]             = useState('grid'); 

  useEffect(() => {
    Promise.all([
      axios.get('/api/etudiants'),
      axios.get('/api/pays'),
      axios.get('/api/civilites'),
    ])
      .then(([e, p, c]) => {
        setEtudiants(e.data.data);
        setPays(p.data.data);
        setCivilites(c.data.data);
        setLoading(false);
      })
      .catch(() => { toast.error('Erreur lors du chargement.'); setLoading(false); });
  }, []);

  const getPays     = (id) => pays.find(p => p.id === id)?.libelle ?? '—';
  const getCivilite = (id) => civilites.find(c => c.id === id)?.abreviation ?? '';
  const formatDate  = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

  const filtered = etudiants.filter(e => {
    const matchSearch = `${e.nom} ${e.prenoms}`.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase());
    const matchPays = !filterPays || e.pays_id === parseInt(filterPays);
    return matchSearch && matchPays;
  });

  // Unique pays in current data
  const paysPresents = pays.filter(p => etudiants.some(e => e.pays_id === p.id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .trombi * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .trombi h1, .trombi h2 { font-family: 'Syne', sans-serif; }

        .student-card {
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 24px 20px 20px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s, border-color .2s;
          box-shadow: 0 1px 4px rgba(0,0,0,.04);
          position: relative; overflow: hidden;
        }
        .student-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--card-gradient); opacity: 0; transition: opacity .2s;
        }
        .student-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,.09); border-color: #e0e7ff; }
        .student-card:hover::before { opacity: 1; }

        .compact-card {
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex; align-items: center; gap: 14px;
          cursor: pointer;
          transition: transform .15s, box-shadow .15s, border-color .15s;
          box-shadow: 0 1px 3px rgba(0,0,0,.03);
        }
        .compact-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.07); border-color: #ddd6fe; }

        .view-btn { padding: 6px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 500; cursor: pointer; transition: all .15s; color: #64748b; }
        .view-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }

        .filter-select { padding: 8px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 13px; color: #334155; background: #fff; cursor: pointer; outline: none; transition: border-color .2s; }
        .filter-select:focus { border-color: #6366f1; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.55); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); }
        .modal-box { background: #fff; border-radius: 20px; width: 100%; max-width: 420px; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,.2); animation: slideUp .25s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }

        .search-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.12); outline: none; }
      `}</style>

      <div className="trombi">
        <Toaster position="top-right" />

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 12px rgba(99,102,241,.3)' }}>
              🖼️
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Trombinoscope</h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {etudiants.length} étudiant{etudiants.length !== 1 ? 's' : ''} enregistré{etudiants.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#94a3b8' }} />
            <input
              className="search-input"
              type="text" placeholder="Rechercher un étudiant..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '36px', paddingRight: search ? '32px' : '12px', paddingTop: '9px', paddingBottom: '9px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#1e293b', transition: 'all .2s' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '14px', display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter by pays */}
          <select className="filter-select" value={filterPays} onChange={e => setFilterPays(e.target.value)}>
            <option value="">Tous les pays</option>
            {paysPresents.map(p => <option key={p.id} value={p.id}>{p.libelle}</option>)}
          </select>

          {/* View toggle */}
          <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '3px' }}>
            <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞ Grille</button>
            <button className={`view-btn ${view === 'compact' ? 'active' : ''}`} onClick={() => setView('compact')}>☰ Liste</button>
          </div>

          {/* Result count when filtering */}
          {(search || filterPays) && (
            <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', background: '#eef2ff', padding: '4px 12px', borderRadius: '20px' }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <span style={{ color: '#6366f1', fontSize: '13px' }}>Chargement...</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#94a3b8' }}>
            <Users size={48} style={{ margin: '0 auto 12px', opacity: .3 }} />
            <p style={{ fontSize: '15px', fontWeight: '500', color: '#64748b' }}>
              {search || filterPays ? 'Aucun étudiant ne correspond aux filtres.' : 'Aucun étudiant enregistré.'}
            </p>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {filtered.map(e => {
              const [c1, c2] = gradientFromName(e.nom + e.prenoms);
              return (
                <div
                  key={e.id}
                  className="student-card"
                  style={{ '--card-gradient': `linear-gradient(90deg, ${c1}, ${c2})` }}
                  onClick={() => setSelected(e)}
                >
                  <Avatar nom={e.nom} prenoms={e.prenoms} size={72} />
                  <div style={{ marginTop: '14px', width: '100%' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', lineHeight: 1.3, marginBottom: '2px' }}>
                      {getCivilite(e.civilites_id)} {e.nom}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '500', marginBottom: '6px' }}>
                      {e.prenoms}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2px 8px' }}>
                      <span style={{ fontSize: '10px' }}>🌍</span>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>{getPays(e.pays_id)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(e => (
              <div key={e.id} className="compact-card" onClick={() => setSelected(e)}>
                <Avatar nom={e.nom} prenoms={e.prenoms} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                    {getCivilite(e.civilites_id)} {e.nom} {e.prenoms}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.email || '—'} · {getPays(e.pays_id)}
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: '#6366f1', background: '#eef2ff', padding: '3px 10px', borderRadius: '20px', fontWeight: '600', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  #{e.id}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              {/* Modal header with gradient */}
              <div style={{ background: `linear-gradient(135deg, ${gradientFromName(selected.nom + selected.prenoms)[0]}, ${gradientFromName(selected.nom + selected.prenoms)[1]})`, padding: '28px 24px 24px', position: 'relative' }}>
                <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '14px' }}>
                  <X size={14} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: '#fff', fontFamily: "'Syne', sans-serif", border: '2px solid rgba(255,255,255,.4)', flexShrink: 0 }}>
                    {selected.nom?.[0]}{selected.prenoms?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>
                      {selected.nom} {selected.prenoms}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', marginTop: '3px' }}>
                      {getCivilite(selected.civilites_id)} · ID #{selected.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal body */}
              <div style={{ padding: '20px 24px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: Mail,     label: 'Email',      value: selected.email || '—' },
                    { icon: Phone,    label: 'Téléphone',  value: selected.telephone || '—' },
                    { icon: Globe,    label: 'Pays',       value: getPays(selected.pays_id) },
                    { icon: Calendar, label: 'Naissance',  value: formatDate(selected.dateNaissance) },
                    { icon: Calendar, label: 'Inscrit le', value: formatDate(selected.created_at) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                      <div style={{ width: '32px', height: '32px', background: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={14} color="#6366f1" />
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>{label}</div>
                        <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500', marginTop: '1px' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelected(null)}
                  style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer', transition: 'background .2s', fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => e.target.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.target.style.background = '#f1f5f9'}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}