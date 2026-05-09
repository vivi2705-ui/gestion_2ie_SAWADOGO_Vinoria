// src/pages/ressources/FilieresPage.jsx
import { useState, useEffect } from 'react';
import ResourceTable from '../../components/ResourceTable';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { filieresApi } from '../../services/Services';

const labelStyle = { display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', fontSize: '13px', background: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '7px', outline: 'none', color: '#e5e5e5' };
const btnStyle = { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer' };

export default function FilieresPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentPage, totalPages, totalItems, itemsPerPage, updatePagination } = usePagination(1, 10);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await filieresApi.getAll(page, itemsPerPage);
      setData(response.data.data);
      updatePagination(response.data.pagination.totalItems, page, itemsPerPage);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des filières.');
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
    { key: 'code', label: 'Code' },
    { key: 'libelle', label: 'Libellé' },
    { key: 'description', label: 'Description' },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette filière ?')) return;
    try {
      await filieresApi.delete(id);
      await loadData(currentPage);
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleEdit = (item) => {
    // You can implement edit via modal or inline editing
    const newCode = prompt('Modifier le code:', item.code);
    if (newCode && newCode !== item.code) {
      const newLibelle = prompt('Modifier le libellé:', item.libelle);
      if (newLibelle) {
        const newDescription = prompt('Modifier la description:', item.description);
        filieresApi.update(item.id, { 
          code: newCode, 
          libelle: newLibelle, 
          description: newDescription || '' 
        })
          .then(() => {
            loadData(currentPage);
            alert('Filière modifiée avec succès!');
          })
          .catch(() => alert('Erreur modification.'));
      }
    }
  };

  const AddForm = ({ onClose, editItem = null }) => {
    const [form, setForm] = useState({ 
      code: editItem?.code || '', 
      libelle: editItem?.libelle || '', 
      description: editItem?.description || '' 
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        if (editItem) {
          await filieresApi.update(editItem.id, form);
          await loadData(currentPage);
        } else {
          await filieresApi.create(form);
          await loadData(1);
        }
        onClose();
      } catch (err) {
        alert(editItem ? 'Erreur lors de la modification.' : 'Erreur lors de l\'ajout.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Code *</label>
            <input required style={inputStyle} value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Libellé *</label>
            <input required style={inputStyle} value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows="2" />
          </div>
        </div>
        <button type="submit" style={btnStyle} disabled={submitting}>
          {submitting ? 'Traitement...' : (editItem ? 'Modifier' : 'Enregistrer')}
        </button>
      </form>
    );
  };

  return (
    <div>
      <ResourceTable
        title="Filières" 
        icon="📚"
        description="Gestion des filières d'enseignement."
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
    </div>
  );
}


