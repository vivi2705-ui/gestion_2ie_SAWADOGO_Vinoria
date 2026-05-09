import { useState, useEffect } from 'react';
import ResourceTable from '../../components/ResourceTable';
import axios from 'axios';


const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '7px', outline: 'none' };
const btnStyle   = { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' };

export default function AnneeAcademiquePage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    axios.get('/api/anneeacademiques')
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => { setError('Erreur chargement.'); setLoading(false); });
  }, []);

  const columns = [
    { key: 'id',         label: 'ID' },
    { key: 'libelle',    label: 'Libellé' },
    { key: 'date_debut', label: 'Début',  render: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
    { key: 'date_fin',   label: 'Fin',    render: (v) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
    {
      key: 'est_active', label: 'Statut',
      render: (v) => (
        <span style={{
          background: v ? '#dcfce7' : '#f1f5f9',
          color:      v ? '#166534' : '#64748b',
          padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500'
        }}>
          {v ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cette année académique ?')) return;
    axios.delete(`/api/anneeacademiques/${id}`)
      .then(() => setData(p => p.filter(r => r.id !== id)))
      .catch(() => alert('Erreur suppression.'));
  };

  const AddForm = ({ onClose }) => {
    const [form, setForm] = useState({ libelle: '', date_debut: '', date_fin: '', est_active: 0 });
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
    const handleSubmit = (ev) => {
      ev.preventDefault();
      axios.post('/api/anneeacademiques', form)
        .then(r => { setData(p => [...p, r.data.data]); onClose(); })
        .catch(() => alert('Erreur ajout.'));
    };
    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Libellé * (ex: 2024-2025)</label>
            <input required style={inputStyle} placeholder="2024-2025" value={form.libelle} onChange={set('libelle')} />
          </div>
          <div>
            <label style={labelStyle}>Date début *</label>
            <input required type="date" style={inputStyle} value={form.date_debut} onChange={set('date_debut')} />
          </div>
          <div>
            <label style={labelStyle}>Date fin *</label>
            <input required type="date" style={inputStyle} value={form.date_fin} onChange={set('date_fin')} />
          </div>
          <div>
            <label style={labelStyle}>Statut</label>
            <select style={inputStyle} value={form.est_active} onChange={set('est_active')}>
              <option value={0}>Inactive</option>
              <option value={1}>Active</option>
            </select>
          </div>
        </div>
        <button type="submit" style={btnStyle}>Enregistrer</button>
      </form>
    );
  };

  return (
    <ResourceTable title="Années académiques" icon="📅" description="Gestion des années académiques."
      columns={columns} data={data} loading={loading} error={error}
      onDelete={handleDelete} addForm={AddForm}  />
  );
}
