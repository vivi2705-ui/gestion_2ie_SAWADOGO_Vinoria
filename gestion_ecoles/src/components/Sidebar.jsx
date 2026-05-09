// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



const RESSOURCES = [
  { path: '/ecoles',      label: 'Ecoles' },
  { path: '/cycles',      label: 'Cycles' },
  { path: '/filieres',    label: 'Filières' },
  { path: '/specialites', label: 'Spécialités' },
  { path: '/parcours',    label: 'Parcours' },
  { path: '/niveaux',     label: 'Niveaux' },
  { path: '/pays',        label: 'Pays' },
  { path: '/annees',      label: 'Années académiques' },
];

const ETUDIANTS = [
  { path: '/ajouter',       label: 'Ajouter étudiant' },
  { path: '/inscriptions',  label: 'Inscrire un étudiant' },
  { path: '/liste',         label: 'Liste des étudiants' },
  { path: '/trombinoscope', label: 'Trombinoscope' },
  { path: '/certificats',   label: "Certificats d'inscription" },
];

export default function Sidebar() {
  const [open, setOpen]         = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openSections, setOpenSections] = useState({ ressources: true, etudiants: true });
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box}
        .app-shell{display:flex;min-height:100vh;background:#f0f4ff;font-family:'DM Sans',sans-serif;position:relative}
        .sidebar{width:260px;min-width:260px;background:linear-gradient(160deg,#0f172a 0%,#1e1b4b 60%,#312e81 100%);display:flex;flex-direction:column;position:relative;z-index:50;transition:width .3s cubic-bezier(.4,0,.2,1),min-width .3s cubic-bezier(.4,0,.2,1),transform .3s cubic-bezier(.4,0,.2,1);overflow:hidden;flex-shrink:0}
        .sidebar.collapsed-desktop{width:0;min-width:0}
        .sidebar.mobile-open{position:fixed;top:0;left:0;height:100%}
        .sidebar.mobile-closed{position:fixed;top:0;left:0;height:100%;transform:translateX(-100%)}
        .sidebar::before{content:'';position:absolute;top:-60px;right:-60px;width:180px;height:180px;background:radial-gradient(circle,rgba(99,102,241,.35) 0%,transparent 70%);border-radius:50%;pointer-events:none}
        .sidebar::after{content:'';position:absolute;bottom:80px;left:-40px;width:140px;height:140px;background:radial-gradient(circle,rgba(236,72,153,.2) 0%,transparent 70%);border-radius:50%;pointer-events:none}
        .sidebar-brand{padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,.08);white-space:nowrap;flex-shrink:0}
        .brand-logo{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1}
        .brand-logo span{color:#818cf8}
        .brand-sub{font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.1em;text-transform:uppercase;margin-top:4px}

        /* ── Dashboard pill button ── */
        .dash-btn{
          margin:14px 14px 2px;
          display:flex;align-items:center;gap:10px;
          padding:11px 14px;
          background:rgba(99,102,241,.15);
          border:1px solid rgba(129,140,248,.25);
          border-radius:11px;
          color:rgba(165,180,252,.85);
          font-size:13px;font-weight:600;
          cursor:pointer;text-decoration:none;
          transition:all .2s;white-space:nowrap;
          font-family:'DM Sans',sans-serif;
          position:relative;overflow:hidden;
        }
        .dash-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(99,102,241,.3),rgba(139,92,246,.2));opacity:0;transition:opacity .2s}
        .dash-btn:hover::before,.dash-btn.active::before{opacity:1}
        .dash-btn:hover,.dash-btn.active{color:#fff;border-color:rgba(129,140,248,.55);transform:translateY(-1px);box-shadow:0 4px 16px rgba(99,102,241,.3)}
        .dash-icon{width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;position:relative;z-index:1;box-shadow:0 2px 8px rgba(99,102,241,.4)}
        .dash-label{position:relative;z-index:1}

        .sidebar-nav{flex:1;overflow-y:auto;padding:8px 0;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}
        .section-toggle{width:100%;background:none;border:none;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-family:'Syne',sans-serif;font-size:10px;font-weight:700;color:rgba(255,255,255,.35);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;transition:color .2s;margin-top:6px}
        .section-toggle:hover{color:rgba(255,255,255,.6)}
        .section-arrow{font-size:8px;transition:transform .2s}
        .section-arrow.open{transform:rotate(90deg)}
        .nav-link{display:flex;align-items:center;gap:10px;padding:9px 20px;font-size:13px;font-weight:400;color:rgba(255,255,255,.55);text-decoration:none;border-left:3px solid transparent;transition:all .18s;white-space:nowrap}
        .nav-link:hover{color:#fff;background:rgba(255,255,255,.06);border-left-color:rgba(129,140,248,.5)}
        .nav-link.active{color:#fff;background:linear-gradient(90deg,rgba(99,102,241,.25),rgba(99,102,241,.05));border-left-color:#818cf8;font-weight:500}
        .nav-icon{font-size:14px;opacity:.7;flex-shrink:0}
        .nav-link.active .nav-icon{opacity:1}

        .sidebar-footer{padding:16px;border-top:1px solid rgba(255,255,255,.08);flex-shrink:0;position:relative;z-index:1}
        .user-pill{display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,.06);border-radius:10px;margin-bottom:10px}
        .user-avatar{width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#ec4899);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
        .user-name{font-size:12px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user-role{font-size:10px;color:rgba(255,255,255,.35)}
        .logout-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:9px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.25);border-radius:10px;color:#fca5a5;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:'DM Sans',sans-serif}
        .logout-btn:hover{background:rgba(239,68,68,.25);border-color:rgba(239,68,68,.5);color:#fff}

        .main-area{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
        .topbar{height:56px;background:#fff;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;padding:0 24px;gap:16px;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,.04)}
        .topbar-toggle{width:36px;height:36px;background:#f1f5f9;border:none;border-radius:8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:background .2s;flex-shrink:0}
        .topbar-toggle:hover{background:#e2e8f0}
        .topbar-toggle span{display:block;width:16px;height:1.5px;background:#475569;border-radius:2px}
        .topbar-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:#1e293b}
        .topbar-accent{margin-left:auto;width:8px;height:8px;background:linear-gradient(135deg,#6366f1,#ec4899);border-radius:50%}
        .content-area{flex:1;padding:28px;overflow-y:auto}
        .mobile-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:40;backdrop-filter:blur(2px)}
      `}</style>

      <div className="app-shell">
        {isMobile && open && (
          <div className="mobile-overlay" onClick={() => setOpen(false)} />
        )}

        <div className={`sidebar ${isMobile ? (open ? 'mobile-open' : 'mobile-closed') : (open ? '' : 'collapsed-desktop')}`}>

          <div className="sidebar-brand">
            <div className="brand-logo">2i<span>E</span></div>
            <div className="brand-sub">Gestion académique</div>
          </div>

          {/* ── Dashboard button ── */}
          <NavLink
            to="/dashboard"
            onClick={() => isMobile && setOpen(false)}
            className={({ isActive }) => `dash-btn${isActive ? ' active' : ''}`}
          >
            
            <span className="dash-label">Tableau de bord</span>
          </NavLink>

          <nav className="sidebar-nav">
            <button className="section-toggle" onClick={() => toggleSection('ressources')}>
              <span>Ressources</span>
              <span className={`section-arrow ${openSections.ressources ? 'open' : ''}`}>▶</span>
            </button>
            {openSections.ressources && RESSOURCES.map(l => (
              <NavLink key={l.path} to={l.path} onClick={() => isMobile && setOpen(false)}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {l.label}
              </NavLink>
            ))}

            <button className="section-toggle" onClick={() => toggleSection('etudiants')}>
              <span>Étudiants</span>
              <span className={`section-arrow ${openSections.etudiants ? 'open' : ''}`}>▶</span>
            </button>
            {openSections.etudiants && ETUDIANTS.map(l => (
              <NavLink key={l.path} to={l.path} onClick={() => isMobile && setOpen(false)}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            {user && (
              <div className="user-pill">
                <div className="user-avatar">{user.nom?.[0]?.toUpperCase() ?? 'A'}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="user-name">{user.nom}</div>
                  <div className="user-role">Administrateur</div>
                </div>
              </div>
            )}
            <button className="logout-btn" onClick={handleLogout}>⏻ Déconnexion</button>
          </div>
        </div>

        <div className="main-area">
          <div className="topbar">
            <button className="topbar-toggle" onClick={() => setOpen(o => !o)}>
              <span /><span /><span />
            </button>
            <span className="topbar-title">2iE — Gestion académique</span>
            <div className="topbar-accent" />
          </div>
          <div className="content-area"><Outlet /></div>
        </div>
      </div>
    </>
  );
}