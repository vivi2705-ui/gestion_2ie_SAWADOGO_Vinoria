// src/pages/etudiants/InscrireEtudiant.jsx
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { ClipboardList, User, BookOpen, Calendar, Award, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';

export default function InscrireEtudiant({ onSuccess }) {
  const [etudiants, setEtudiants]   = useState([]);
  const [parcours, setParcours]     = useState([]);
  const [annees, setAnnees]         = useState([]);
  const [decisions, setDecisions]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [searchEtudiant, setSearchEtudiant] = useState('');
  const [showDropdown, setShowDropdown]     = useState(false);

  const [form, setForm] = useState({
    etudiants_id: '', parcours_id: '',
    annee_academique_id: '', decisions_id: '',
    dateInscription: new Date().toISOString().split('T')[0],
  });
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get('/api/etudiants'),
      axios.get('/api/parcours'),
      axios.get('/api/anneeacademiques'),
      axios.get('/api/decisions'),
    ])
      .then(([e, pa, an, d]) => {
        setEtudiants(e.data.data);
        setParcours(pa.data.data);
        setAnnees(an.data.data);
        setDecisions(d.data.data);
      })
      .catch(() => toast.error('Erreur lors du chargement des données.'));
  }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const filteredEtudiants = etudiants.filter(e =>
    `${e.nom} ${e.prenoms}`.toLowerCase().includes(searchEtudiant.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchEtudiant.toLowerCase())
  );

  const selectEtudiant = (etudiant) => {
    setSelectedEtudiant(etudiant);
    setForm(p => ({ ...p, etudiants_id: etudiant.id }));
    setSearchEtudiant(`${etudiant.nom} ${etudiant.prenoms}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.etudiants_id || !form.parcours_id || !form.annee_academique_id || !form.decisions_id || !form.dateInscription) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/inscriptions', form);
      toast.success('Étudiant inscrit avec succès !');
      setForm({ etudiants_id: '', parcours_id: '', annee_academique_id: '', decisions_id: '', dateInscription: new Date().toISOString().split('T')[0] });
      setSelectedEtudiant(null);
      setSearchEtudiant('');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  const selectCls = "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none";
  const inputCls  = "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const labelCls  = "block text-sm font-medium text-gray-700 mb-1";

  const DECISION_COLORS = {
    'Admis':               'bg-green-100 text-green-700',
    'Inscrit':             'bg-blue-100 text-blue-700',
    'Diplômé':             'bg-purple-100 text-purple-700',
    'Redoublant':          'bg-yellow-100 text-yellow-700',
    'Admis sous condition':'bg-orange-100 text-orange-700',
    'Refusé':              'bg-red-100 text-red-700',
    'Exclu':               'bg-red-100 text-red-700',
  };

  return (
    <div className="w-full">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-blue-600" />
          Inscrire un étudiant
        </h1>
        <p className="mt-1 text-sm text-gray-600">Enregistrez une inscription pour un étudiant existant.</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Recherche étudiant */}
          <div>
            <label className={labelCls}>Étudiant *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchEtudiant}
                onChange={e => { setSearchEtudiant(e.target.value); setShowDropdown(true); setSelectedEtudiant(null); setForm(p => ({ ...p, etudiants_id: '' })); }}
                onFocus={() => setShowDropdown(true)}
                className={inputCls}
                autoComplete="off"
              />
              {showDropdown && searchEtudiant && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredEtudiants.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">Aucun étudiant trouvé.</div>
                  ) : (
                    filteredEtudiants.slice(0, 8).map(et => (
                      <button
                        key={et.id} type="button"
                        onClick={() => selectEtudiant(et)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-900">{et.nom} {et.prenoms}</div>
                        {et.email && <div className="text-xs text-gray-500">{et.email}</div>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {selectedEtudiant && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                <User className="w-3 h-3" />
                Sélectionné : <strong>{selectedEtudiant.nom} {selectedEtudiant.prenoms}</strong>
              </div>
            )}
          </div>

          {/* Parcours */}
          <div>
            <label className={labelCls}>Parcours *</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select required value={form.parcours_id} onChange={set('parcours_id')} className={selectCls}>
                <option value="">-- Choisir un parcours --</option>
                {parcours.map(p => <option key={p.id} value={p.id}>{p.libelle}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Année académique + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Année académique *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select required value={form.annee_academique_id} onChange={set('annee_academique_id')} className={selectCls}>
                  <option value="">-- Choisir --</option>
                  {annees.map(a => <option key={a.id} value={a.id}>{a.libelle}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Date d'inscription *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type="date" value={form.dateInscription} onChange={set('dateInscription')} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Décision */}
          <div>
            <label className={labelCls}>Décision *</label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select required value={form.decisions_id} onChange={set('decisions_id')} className={selectCls}>
                <option value="">-- Choisir une décision --</option>
                {decisions.map(d => <option key={d.id} value={d.id}>{d.libelle}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {form.decisions_id && (() => {
              const d = decisions.find(d => d.id === parseInt(form.decisions_id));
              if (!d) return null;
              const cls = DECISION_COLORS[d.libelle] || 'bg-gray-100 text-gray-700';
              return <span className={`mt-2 inline-block text-xs px-2 py-1 rounded-full font-medium ${cls}`}>{d.libelle}</span>;
            })()}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60"
            >
              <ClipboardList className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Inscrire l\'étudiant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}