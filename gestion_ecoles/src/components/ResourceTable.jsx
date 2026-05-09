
import { useState } from 'react';

const ResourceTable = ({
  title, icon, description,
  columns, data, loading, error,
  onDelete, onEdit,
  readOnly = false,
  addForm = null,
}) => {
  const [showForm, setShowForm]     = useState(false);
  const [search, setSearch]         = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const filtered = (Array.isArray(data) ? data : []).filter(row =>
    columns.some(col =>
      String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <span style={{ color: '#6366f1', fontSize: '13px', fontWeight: '500' }}>Chargement...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ background: 'linear-gradient(135deg, #fef2f2, #fff1f2)', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', color: '#dc2626', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '20px' }}>⚠️</span> {error}
    </div>
  );

  return (
    <>
      <style>{`
        .rt-add-btn { transition: all 0.2s; }
        .rt-add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.35) !important; }
        .rt-search:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); outline: none; }
        .rt-row:hover td { background: #f5f3ff !important; }
        .rt-del-btn:hover { background: #fee2e2 !important; border-color: #f87171 !important; color: #dc2626 !important; }
        .rt-edit-btn:hover { background: #ede9fe !important; border-color: #a78bfa !important; color: #7c3aed !important; }
      `}</style>

      <div>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                {icon}
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: "'Syne', sans-serif" }}>{title}</h1>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0, marginTop: '2px' }}>{description}</p>
              </div>
            </div>
          </div>
          {!readOnly && (
            <button
              className="rt-add-btn"
              onClick={() => { setEditingItem(null); setShowForm(s => !s); }}
              style={{ background: showForm ? '#64748b' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {showForm ? '✕ Annuler' : '＋ Ajouter'}
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && addForm && (() => {
          const Form = addForm;
          return (
            <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #faf5ff)', border: '1.5px solid #c4b5fd', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
              <Form onClose={handleFormClose} editItem={editingItem} />
            </div>
          );
        })()}

        {/* Stats + Search row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          {/* Stat pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '10px 18px' }}>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#4f46e5', fontFamily: "'Syne', sans-serif" }}>{(data || []).length}</span>
            <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>entrée{(data || []).length !== 1 ? 's' : ''}</span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#94a3b8' }}>🔍</span>
            <input
              className="rt-search"
              type="text"
              placeholder={`Rechercher dans ${title.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px', paddingRight: '14px', paddingTop: '9px', paddingBottom: '9px', fontSize: '13px', border: '1.5px solid #e2e8f0', borderRadius: '10px', color: '#1e293b', background: '#fff', width: '280px', transition: 'all 0.2s' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '14px' }}>✕</button>
            )}
          </div>
        </div>

        {/* Search result count */}
        {search && (
          <p style={{ fontSize: '12px', color: '#6366f1', marginBottom: '12px', fontWeight: '500' }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour « {search} »
          </p>
        )}

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #f5f3ff, #eef2ff)' }}>
                  {columns.map(col => (
                    <th key={col.key} style={{ padding: '11px 16px', fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', borderBottom: '2px solid #ddd6fe' }}>
                      {col.label}
                    </th>
                  ))}
                  {!readOnly && (onDelete || onEdit || addForm) && (
                    <th style={{ padding: '11px 16px', fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', borderBottom: '2px solid #ddd6fe', width: '130px' }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} style={{ padding: '56px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                      {search ? `Aucun résultat pour « ${search} »` : 'Aucune donnée disponible.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, i) => (
                    <tr key={row.id ?? i} className="rt-row" style={{ transition: 'background 0.15s' }}>
                      {columns.map(col => (
                        <td key={col.key} style={{ padding: '13px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafe' }}>
                          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                        </td>
                      ))}
                      {!readOnly && (onDelete || onEdit || addForm) && (
                        <td style={{ padding: '13px 16px', textAlign: 'center', borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafe' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            {(onEdit || addForm) && (
                              <button
                                className="rt-edit-btn"
                                onClick={() => onEdit ? onEdit(row) : handleEditClick(row)}
                                style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '7px', padding: '5px 10px', fontSize: '11px', color: '#7c3aed', cursor: 'pointer', fontWeight: '500', transition: 'all 0.15s' }}
                              >
                                ✏️ Modifier
                              </button>
                            )}
                            {onDelete && (
                              <button
                                className="rt-del-btn"
                                onClick={() => onDelete(row.id)}
                                style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '7px', padding: '5px 10px', fontSize: '11px', color: '#ef4444', cursor: 'pointer', fontWeight: '500', transition: 'all 0.15s' }}
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceTable;