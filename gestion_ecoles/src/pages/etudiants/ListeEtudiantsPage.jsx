// src/pages/etudiants/ListeEtudiants.jsx
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Users, Search, X, Eye, Trash2, User, Mail, Phone, Globe, Calendar } from 'lucide-react';
import axios from 'axios';

export default function ListeEtudiants() {
  const [etudiants, setEtudiants]   = useState([]);
  const [pays, setPays]             = useState([]);
  const [civilites, setCivilites]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState(null); 

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

  const filtered = etudiants.filter(e =>
    `${e.nom} ${e.prenoms}`.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.telephone?.includes(search) ||
    getPays(e.pays_id).toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet étudiant ?')) return;
    try {
      await axios.delete(`/api/etudiants/${id}`);
      setEtudiants(prev => prev.filter(e => e.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Étudiant supprimé.');
    } catch {
      toast.error('Erreur lors de la suppression.');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

  return (
    <div className="w-full">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Liste des étudiants
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {etudiants.length} étudiant{etudiants.length !== 1 ? 's' : ''} enregistré{etudiants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results count when searching */}
      {search && (
        <p className="text-sm text-gray-500 mb-3">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour "{search}"
        </p>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrit le</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                    <p className="text-sm text-gray-500">Chargement...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      {search ? 'Aucun étudiant ne correspond à la recherche.' : 'Aucun étudiant enregistré.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((e, i) => (
                  <tr key={e.id} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-blue-600">
                            {e.nom?.[0]}{e.prenoms?.[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getCivilite(e.civilites_id)} {e.nom} {e.prenoms}
                          </div>
                          {e.dateNaissance && (
                            <div className="text-xs text-gray-500">{formatDate(e.dateNaissance)}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {e.email ? (
                        <a href={`mailto:${e.email}`} className="hover:text-blue-600 transition-colors">{e.email}</a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.telephone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getPays(e.pays_id)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(e.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(e)}
                        className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">{selected.nom?.[0]}{selected.prenoms?.[0]}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {getCivilite(selected.civilites_id)} {selected.nom} {selected.prenoms}
                  </h2>
                  <p className="text-sm text-gray-500">ID: #{selected.id}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { icon: Mail,     label: 'Email',            value: selected.email || '—' },
                { icon: Phone,    label: 'Téléphone',        value: selected.telephone || '—' },
                { icon: Globe,    label: 'Pays',             value: getPays(selected.pays_id) },
                { icon: Calendar, label: 'Date de naissance',value: formatDate(selected.dateNaissance) },
                { icon: Calendar, label: 'Inscrit le',       value: formatDate(selected.created_at) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500 w-36 flex-shrink-0">{label}</span>
                  <span className="text-sm text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}