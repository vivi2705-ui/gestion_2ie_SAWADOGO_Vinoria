// src/pages/ressources/SpecialitesPage.jsx
import { useState, useEffect } from 'react';
import ResourceTable from '../../components/ResourceTable';
import axios from 'axios';

const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '7px', outline: 'none' };
const btnStyle   = { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' };

export default function SpecialitesPage() {
  const [data, setData]       = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    Promise.all([axios.get('/api/specialites'), axios.get('/api/filieres')])
      .then(([s, f]) => { setData(s.data.data); setFilieres(f.data.data); setLoading(false); })
      .catch(() => { setError('Erreur chargement.'); setLoading(false); });
  }, []);

  const columns = [
    { key: 'id',          label: 'ID' },
    { key: 'libelle',     label: 'Libellé' },
    { key: 'filieres_id', label: 'Filière', render: (v) => filieres.find(f => f.id === v)?.libelle ?? v },
    { key: 'description', label: 'Description' },
  ];

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cette spécialité ?')) return;
    axios.delete(`/api/specialites/${id}`)
      .then(() => setData(p => p.filter(r => r.id !== id)))
      .catch(() => alert('Erreur suppression.'));
  };

  const AddForm = ({ onClose }) => {
    const [form, setForm] = useState({ libelle: '', filieres_id: '', description: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('/api/specialites', form)
        .then(r => { setData(p => [...p, r.data.data]); onClose(); })
        .catch(() => alert('Erreur ajout.'));
    };
    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Libellé *</label>
            <input required style={inputStyle} value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Filière *</label>
            <select required style={inputStyle} value={form.filieres_id} onChange={e => setForm(p => ({ ...p, filieres_id: e.target.value }))}>
              <option value="">-- Choisir --</option>
              {filieres.map(f => <option key={f.id} value={f.id}>{f.libelle}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <input style={inputStyle} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
        </div>
        <button type="submit" style={btnStyle}>Enregistrer</button>
      </form>
    );
  };

  return (
    <ResourceTable title="Spécialités" icon="🎯" description="Gestion des spécialités par filière."
      columns={columns} data={data} loading={loading} error={error}
      onDelete={handleDelete} addForm={AddForm} />
  );
}
