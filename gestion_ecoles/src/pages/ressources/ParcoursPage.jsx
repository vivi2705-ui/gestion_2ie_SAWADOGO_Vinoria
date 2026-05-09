// src/pages/ressources/ParcoursPage.jsx
import { useState, useEffect } from 'react';
import ResourceTable from '../../components/ResourceTable';
import axios from 'axios';

const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '7px', outline: 'none' };
const btnStyle   = { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' };

export default function ParcoursPage() {
  const [data, setData]           = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [niveaux, setNiveaux]     = useState([]);
  const [cycles, setCycles]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get('/api/parcours'),
      axios.get('/api/specialites'),
      axios.get('/api/niveaux'),
      axios.get('/api/cycles'),
    ])
      .then(([pa, sp, ni, cy]) => {
        setData(pa.data.data); setSpecialites(sp.data.data);
        setNiveaux(ni.data.data); setCycles(cy.data.data);
        setLoading(false);
      })
      .catch(() => { setError('Erreur chargement.'); setLoading(false); });
  }, []);

  const columns = [
    { key: 'id',            label: 'ID' },
    { key: 'libelle',       label: 'Libellé' },
    { key: 'specialites_id', label: 'Spécialité', render: (v) => specialites.find(s => s.id === v)?.libelle ?? v },
    { key: 'niveaux_id',    label: 'Niveau',     render: (v) => niveaux.find(n => n.id === v)?.libelle ?? v },
    { key: 'cycles_id',     label: 'Cycle',      render: (v) => cycles.find(c => c.id === v)?.libelle ?? '—' },
  ];

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce parcours ?')) return;
    axios.delete(`/api/parcours/${id}`)
      .then(() => setData(p => p.filter(r => r.id !== id)))
      .catch(() => alert('Erreur suppression.'));
  };

  const AddForm = ({ onClose })=> {
    const [form, setForm] = useState({ libelle: '', specialites_id: '', niveaux_id: '', cycles_id: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('/api/parcours', form)
        .then(r => { setData(p => [...p, r.data.data]); onClose(); })
        .catch(() => alert('Erreur ajout.'));
    };
    const sel = (k, opts, label) => (
      <div key={k}>
        <label style={labelStyle}>{label}</label>
        <select style={inputStyle} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}>
          <option value="">-- Choisir --</option>
          {opts.map(o => <option key={o.id} value={o.id}>{o.libelle}</option>)}
        </select>
      </div>
    );
    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Libellé *</label>
            <input required style={inputStyle} value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} />
          </div>
          {sel('specialites_id', specialites, 'Spécialité *')}
          {sel('niveaux_id', niveaux, 'Niveau *')}
          {sel('cycles_id', cycles, 'Cycle')}
        </div>
        <button type="submit" style={btnStyle}>Enregistrer</button>
      </form>
    );
  };

  return (
    <ResourceTable title="Parcours" icon="🗺️" description="Gestion des parcours de formation."
      columns={columns} data={data} loading={loading} error={error}
      onDelete={handleDelete} addForm={AddForm} />
  );
}
