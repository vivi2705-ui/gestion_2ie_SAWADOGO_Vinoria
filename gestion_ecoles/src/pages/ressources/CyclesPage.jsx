// src/pages/ressources/CyclesPage.jsx
import { useState, useEffect } from 'react';
import ResourceTable from '../../components/ResourceTable';
import { cyclesApi } from '../../services/Services';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '7px', outline: 'none' };
const btnStyle   = { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' };

export default function CyclesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentPage, totalPages, totalItems, itemsPerPage, updatePagination } = usePagination(1, 10);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await cyclesApi.getAll(page, itemsPerPage);
      setData(response.data.data);
      updatePagination(response.data.pagination.totalItems, page, itemsPerPage);
      setError(null);
    } catch (err) {
      setError('Erreur chargement.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, []);

  const handlePageChange = (page) => {
    loadData(page);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'libelle', label: 'Libellé' },
    { key: 'duree_annees', label: 'Durée (ans)' },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce cycle ?')) return;
    try {
      await cyclesApi.delete(id);
      await loadData(currentPage);
    } catch (err) {
      alert('Erreur suppression.');
    }
  };

  const handleEdit = (item) => {
    const newLibelle = prompt('Modifier le libellé:', item.libelle);
    if (newLibelle && newLibelle !== item.libelle) {
      const newDuree = prompt('Modifier la durée (années):', item.duree_annees);
      if (newDuree) {
        cyclesApi.update(item.id, { libelle: newLibelle, duree_annees: parseInt(newDuree) })
          .then(() => {
            loadData(currentPage);
            alert('Cycle modifié avec succès!');
          })
          .catch(() => alert('Erreur modification.'));
      }
    }
  };

  const AddForm = ({ onClose, editItem = null }) => {
    const [form, setForm] = useState({ 
      libelle: editItem?.libelle || '', 
      duree_annees: editItem?.duree_annees || 3 
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        if (editItem) {
          await cyclesApi.update(editItem.id, form);
          await loadData(currentPage);
        } else {
          await cyclesApi.create(form);
          await loadData(1);
        }
        onClose();
      } catch (err) {
        alert(editItem ? 'Erreur modification.' : 'Erreur ajout.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Libellé *</label>
            <input required style={inputStyle} value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Durée (années) *</label>
            <input required type="number" min="1" max="10" style={inputStyle} value={form.duree_annees} onChange={e => setForm(p => ({ ...p, duree_annees: parseInt(e.target.value) }))} />
          </div>
        </div>
        <button type="submit" style={btnStyle} disabled={submitting}>
          {submitting ? 'Traitement...' : (editItem ? 'Modifier' : 'Enregistrer')}
        </button>
      </form>
    );
  };

  return (
    <>
      <ResourceTable 
        title="Cycles" 
        icon="🔄" 
        description="Gestion des cycles académiques."
        columns={columns} 
        data={data} 
        loading={loading} 
        error={error}
        onDelete={handleDelete}
        onEdit={handleEdit}
        addForm={AddForm}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        variant="light"
        showInfo={true}
        maxVisible={5}
      />
    </>
  );
}