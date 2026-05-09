// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const STAT_CONFIG = [
  { key: 'etudiants',  label: 'Étudiants',          icon: '🎓', path: '/liste',        color: ['#6366f1', '#8b5cf6'], light: '#f5f3ff', text: '#6d28d9' },
  { key: 'inscriptions', label: 'Inscriptions',      icon: '✏️',  path: '/inscriptions', color: ['#06b6d4', '#0891b2'], light: '#ecfeff', text: '#0e7490' },
  { key: 'ecoles',    label: 'Écoles',               icon: '🏫', path: '/ecoles',       color: ['#f59e0b', '#d97706'], light: '#fffbeb', text: '#92400e' },
  { key: 'filieres',  label: 'Filières',             icon: '📚', path: '/filieres',     color: ['#10b981', '#059669'], light: '#ecfdf5', text: '#065f46' },
];

const QUICK_LINKS = [
  { label: 'Ajouter un étudiant',     icon: '➕', path: '/ajouter',      color: '#6366f1' },
  { label: 'Inscrire un étudiant',    icon: '✏️',  path: '/inscriptions', color: '#06b6d4' },
  { label: 'Liste des étudiants',     icon: '📋', path: '/liste',        color: '#10b981' },
  { label: "Certificat d'inscription",icon: '📜', path: '/certificats',  color: '#f59e0b' },
  { label: 'Gérer les écoles',        icon: '🏫', path: '/ecoles',       color: '#ec4899' },
  { label: 'Années académiques',      icon: '📅', path: '/annees',       color: '#8b5cf6' },
];

export default function Dashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [stats, setStats]     = useState({ etudiants: '—', inscriptions: '—', ecoles: '—', filieres: '—' });
  const [loading, setLoading] = useState(true);
  const [time, setTime]       = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get('/api/etudiants').catch(() => ({ data: [] })),
      axios.get('/api/inscriptions').catch(() => ({ data: [] })),
      axios.get('/api/ecoles').catch(() => ({ data: [] })),
      axios.get('/api/filieres').catch(() => ({ data: [] })),
    ]).then(([e, i, ec, f]) => {
      setStats({
        etudiants:    Array.isArray(e.data.data)  ? e.data.data.length  : '—',
        inscriptions: Array.isArray(i.data.data)  ? i.data.data.length  : '—',
        ecoles:       Array.isArray(ec.data.data) ? ec.data.data.length : '—',
        filieres:     Array.isArray(f.data.data)  ? f.data.data.length  : '—',
      });
      setLoading(false);
    });
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const fmt = (d) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtTime = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .dash * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .dash h1, .dash h2, .dash h3 { font-family: 'Syne', sans-serif; }
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.1) !important; }
        .quick-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .quick-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; }
        .pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="dash">

        {/* Hero welcome */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)', borderRadius: '20px', padding: '32px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '40%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                {fmt(time)}
              </p>
              <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '800', margin: '0 0 6px', lineHeight: 1.2 }}>
                {greeting}, {user?.nom ?? 'Administrateur'} 
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>
                Bienvenue sur le tableau de bord de gestion académique 2iE.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '14px 20px', textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a78bfa', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
                {fmtTime(time)}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Heure locale</div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {STAT_CONFIG.map(s => (
            <div
              key={s.key}
              className="stat-card"
              onClick={() => navigate(s.path)}
              style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ width: '44px', height: '44px', background: `linear-gradient(135deg, ${s.color[0]}, ${s.color[1]})`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: `0 4px 12px ${s.color[0]}40` }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: '10px', fontWeight: '600', color: s.text, background: s.light, padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Total
                </span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                {loading ? <span className="pulse" style={{ display: 'inline-block', width: '40px', height: '28px', background: '#e2e8f0', borderRadius: '6px' }} /> : stats[s.key]}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '4px', height: '18px', background: 'linear-gradient(180deg, #6366f1, #ec4899)', borderRadius: '2px', display: 'inline-block' }} />
            Accès rapide
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {QUICK_LINKS.map(q => (
              <button
                key={q.path}
                className="quick-card"
                onClick={() => navigate(q.path)}
                style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: '36px', height: '36px', background: `${q.color}18`, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>
                  {q.icon}
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155', lineHeight: 1.3 }}>
                  {q.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}