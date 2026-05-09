// src/pages/ressources/NiveauxPage.jsx
import { useState, useEffect } from 'react';
import ResourceTable from '../../components/ResourceTable';
import axios from 'axios';

const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '7px', outline: 'none' };
const btnStyle   = { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' };

export default function NiveauxPage() { 
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => { 
    axios.get('/api/niveaux')
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => { setError('Erreur chargement.'); setLoading(false); });
  }, []);

  const columns = [
    { key: 'id',     label: 'ID' },
    { key: 'libelle', label: 'Libellé' },
    { key: 'ordre',  label: 'Ordre' },
  ];

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce niveau ?')) return;
    axios.delete(`/api/niveaux/${id}`)
      .then(() => setData(p => p.filter(r => r.id !== id)))
      .catch(() => alert('Erreur suppression.'));
  };

  const AddForm = ({ onClose })=> {
    const [form, setForm] = useState({ libelle: '', ordre: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('/api/niveaux', form)
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
            <label style={labelStyle}>Ordre *</label>
            <input required type="number" min="1" style={inputStyle} value={form.ordre} onChange={e => setForm(p => ({ ...p, ordre: e.target.value }))} />
          </div>
        </div>
        <button type="submit" style={btnStyle}>Enregistrer</button>
      </form>
    );
  };

  return (
    <ResourceTable title="Niveaux" icon="📶" description="Gestion des niveaux d'études."
      columns={columns} data={data} loading={loading} error={error}
      onDelete={handleDelete} addForm={AddForm} />
  );
}
