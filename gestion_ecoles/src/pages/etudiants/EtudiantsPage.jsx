// src/pages/etudiants/AjouterEtudiant.jsx
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, User, Mail, Phone, Calendar, Globe, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function AjouterEtudiant({ onSuccess }) {
  const [pays, setPays]         = useState([]);
  const [civilites, setCivilites] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [form, setForm] = useState({
    nom: '', prenoms: '', email: '', telephone: '',
    dateNaissance: '', pays_id: '', civilites_id: '',
  });

  useEffect(() => {
    Promise.all([axios.get('/api/pays'), axios.get('/api/civilites')])
      .then(([p, c]) => { setPays(p.data.data); setCivilites(c.data.data); })
      .catch(() => toast.error('Erreur lors du chargement des données.'));
  }, []);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenoms || !form.pays_id || !form.civilites_id) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/etudiants', form);
      toast.success('Étudiant ajouté avec succès !');
      setForm({ nom: '', prenoms: '', email: '', telephone: '', dateNaissance: '', pays_id: '', civilites_id: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const selectCls = "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserPlus className="w-7 h-7 text-blue-600" />
          Ajouter un étudiant
        </h1>
        <p className="mt-1 text-sm text-gray-600">Remplissez le formulaire pour enregistrer un nouvel étudiant.</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Civilité */}
          <div>
            <label className={labelCls}>Civilité *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select required value={form.civilites_id} onChange={set('civilites_id')} className={selectCls}>
                <option value="">-- Choisir --</option>
                {civilites.map(c => (
                  <option key={c.id} value={c.id}>{c.abreviation} — {c.libelle}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Nom + Prénoms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nom *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type="text" placeholder="Nom de famille" value={form.nom} onChange={set('nom')} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Prénoms *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type="text" placeholder="Prénom(s)" value={form.prenoms} onChange={set('prenoms')} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Email + Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="exemple@email.com" value={form.email} onChange={set('email')} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="+226 XX XX XX XX" value={form.telephone} onChange={set('telephone')} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Date de naissance + Pays */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date de naissance</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" value={form.dateNaissance} onChange={set('dateNaissance')} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Pays *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select required value={form.pays_id} onChange={set('pays_id')} className={selectCls}>
                  <option value="">-- Choisir --</option>
                  {pays.map(p => <option key={p.id} value={p.id}>{p.libelle}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Ajouter l\'étudiant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}