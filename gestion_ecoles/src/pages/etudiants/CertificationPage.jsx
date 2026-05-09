// src/pages/etudiants/CertificatInscription.jsx
// requires: npm install jspdf
import { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FileText, Search, Download, Eye, User, X } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

export default function CertificatInscription() {
  const [etudiants, setEtudiants]     = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [parcours, setParcours]       = useState([]);
  const [annees, setAnnees]           = useState([]);
  const [decisions, setDecisions]     = useState([]);
  const [civilites, setCivilites]     = useState([]);
  const [pays, setPays]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [preview, setPreview]         = useState(false);

  // Editable certificate fields
  const [certInfo, setCertInfo] = useState({
    etablissement: '2iE — Institut International d\'Ingénierie de l\'Eau et de l\'Environnement',
    adresseEtablissement: '01 BP 594 Ouagadougou 01, Burkina Faso',
    telephone: '+226 25 49 28 00',
    email: 'contact@2ie-edu.org',
    site: 'www.2ie-edu.org',
    ville: 'Ouagadougou',
    numeroRef: '',
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/etudiants'),
      axios.get('/api/inscriptions'),
      axios.get('/api/parcours'),
      axios.get('/api/anneeacademiques'),
      axios.get('/api/decisions'),
      axios.get('/api/civilites'),
      axios.get('/api/pays'),
    ])
      .then(([e, i, pa, an, d, c, py]) => {
        setEtudiants(e.data.data); setInscriptions(i.data.data);
        setParcours(pa.data.data); setAnnees(an.data.data);
        setDecisions(d.data.data); setCivilites(c.data.data);
        setPays(py.data.data); setLoading(false);
      })
      .catch(() => { toast.error('Erreur lors du chargement.'); setLoading(false); });
  }, []);

  const filtered = etudiants.filter(e =>
    `${e.nom} ${e.prenoms}`.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getCivilite = (id) => civilites.find(c => c.id === id)?.libelle ?? '';
  const getPays     = (id) => pays.find(p => p.id === id)?.libelle ?? '—';
  const getParcours = (id) => parcours.find(p => p.id === id)?.libelle ?? '—';
  const getAnnee    = (id) => annees.find(a => a.id === id)?.libelle ?? '—';
  const getDecision = (id) => decisions.find(d => d.id === id)?.libelle ?? '—';
  const formatDate  = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const selectEtudiant = (etudiant) => {
    setSelectedEtudiant(etudiant);
    setSearch(`${etudiant.nom} ${etudiant.prenoms}`);
    setShowDropdown(false);
    // find latest inscription
    const ins = inscriptions
      .filter(i => i.etudiants_id === etudiant.id)
      .sort((a, b) => new Date(b.dateInscription) - new Date(a.dateInscription));
    setSelectedInscription(ins[0] || null);
    // auto generate ref number
    setCertInfo(p => ({ ...p, numeroRef: `CERT-${etudiant.id}-${new Date().getFullYear()}` }));
    setPreview(false);
  };

  const generatePDF = () => {
    if (!selectedEtudiant) { toast.error('Sélectionnez un étudiant.'); return; }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const margin = 20;

    // ── Background & border ───────────────────────────────────
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, W, 297, 'F');

    // Outer border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1.2);
    doc.rect(10, 10, 190, 277);

    // Inner border
    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(0.4);
    doc.rect(13, 13, 184, 271);

    // ── Header band ───────────────────────────────────────────
    doc.setFillColor(30, 64, 175);
    doc.rect(10, 10, 190, 32, 'F');

    // Établissement name
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(certInfo.etablissement, W / 2, 24, { align: 'center', maxWidth: 170 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`${certInfo.adresseEtablissement}  |  Tél: ${certInfo.telephone}  |  ${certInfo.site}`, W / 2, 34, { align: 'center' });

    // ── Title ─────────────────────────────────────────────────
    doc.setTextColor(30, 64, 175);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('CERTIFICAT D\'INSCRIPTION', W / 2, 60, { align: 'center' });

    // Underline
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.8);
    doc.line(55, 63, 155, 63);

    // Ref + date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Réf: ${certInfo.numeroRef}`, margin, 72);
    doc.text(`Délivré le : ${formatDate(new Date())}`, W - margin, 72, { align: 'right' });

    // ── Body text ─────────────────────────────────────────────
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const intro = `Nous soussignés, représentants de ${certInfo.etablissement}, certifions par la présente que :`;
    doc.text(intro, margin, 85, { maxWidth: W - margin * 2 });

    // ── Student info box ──────────────────────────────────────
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, 95, W - margin * 2, 55, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 64, 175);
    doc.text('INFORMATIONS DE L\'ÉTUDIANT(E)', margin + 5, 104);

    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(0.3);
    doc.line(margin + 5, 106, W - margin - 5, 106);

    const etudiantInfo = [
      ['Nom et prénoms', `${getCivilite(selectedEtudiant.civilites_id)} ${selectedEtudiant.nom} ${selectedEtudiant.prenoms}`],
      ['Date de naissance', formatDate(selectedEtudiant.dateNaissance)],
      ['Nationalité / Pays', getPays(selectedEtudiant.pays_id)],
      ['Email', selectedEtudiant.email || '—'],
    ];

    let y = 114;
    etudiantInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`${label} :`, margin + 5, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(value, margin + 60, y);
      y += 9;
    });

    // ── Inscription info box ──────────────────────────────────
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(134, 239, 172);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, 158, W - margin * 2, selectedInscription ? 55 : 30, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52);
    doc.text('INFORMATIONS D\'INSCRIPTION', margin + 5, 167);

    doc.setDrawColor(134, 239, 172);
    doc.setLineWidth(0.3);
    doc.line(margin + 5, 169, W - margin - 5, 169);

    if (selectedInscription) {
      const inscInfo = [
        ['Parcours', getParcours(selectedInscription.parcours_id)],
        ['Année académique', getAnnee(selectedInscription.annee_academique_id)],
        ['Date d\'inscription', formatDate(selectedInscription.dateInscription)],
        ['Décision', getDecision(selectedInscription.decisions_id)],
      ];

      let y2 = 177;
      inscInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`${label} :`, margin + 5, y2);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(value, margin + 60, y2);
        y2 += 9;
      });
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text('Aucune inscription enregistrée.', margin + 5, 178);
    }

    const bodyY = selectedInscription ? 222 : 197;

    // ── Closing statement ─────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    const closing = `Ce certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.`;
    doc.text(closing, W / 2, bodyY, { align: 'center', maxWidth: W - margin * 2 });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Fait à ${certInfo.ville}, le ${formatDate(new Date())}`, W / 2, bodyY + 10, { align: 'center' });

    // ── Signature area ────────────────────────────────────────
    const sigY = bodyY + 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('Le Directeur des Études', W / 2, sigY, { align: 'center' });

    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.4);
    doc.line(65, sigY + 22, 145, sigY + 22);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Signature et cachet', W / 2, sigY + 27, { align: 'center' });

    // ── Footer ────────────────────────────────────────────────
    doc.setFillColor(30, 64, 175);
    doc.rect(10, 272, 190, 15, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `${certInfo.etablissement}  •  ${certInfo.adresseEtablissement}  •  ${certInfo.email}`,
      W / 2, 281, { align: 'center' }
    );

    doc.save(`Certificat_${selectedEtudiant.nom}_${selectedEtudiant.prenoms}.pdf`);
    toast.success('Certificat téléchargé !');
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          Certificat d'inscription
        </h1>
        <p className="mt-1 text-sm text-gray-600">Sélectionnez un étudiant, modifiez les informations si besoin, puis téléchargez le PDF.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — form */}
        <div className="space-y-5">

          {/* Search étudiant */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Sélectionner un étudiant
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDropdown(true); setSelectedEtudiant(null); }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoComplete="off"
              />
              {showDropdown && search && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">Aucun étudiant trouvé.</div>
                  ) : (
                    filtered.slice(0, 8).map(e => (
                      <button key={e.id} type="button" onClick={() => selectEtudiant(e)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors">
                        <div className="text-sm font-medium text-gray-900">{e.nom} {e.prenoms}</div>
                        {e.email && <div className="text-xs text-gray-500">{e.email}</div>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {selectedEtudiant && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-800">{selectedEtudiant.nom} {selectedEtudiant.prenoms}</p>
                  <p className="text-xs text-blue-600">
                    {getPays(selectedEtudiant.pays_id)}
                    {selectedInscription && ` · ${getAnnee(selectedInscription.annee_academique_id)}`}
                  </p>
                </div>
                <button onClick={() => { setSelectedEtudiant(null); setSearch(''); }} className="text-blue-400 hover:text-blue-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Etablissement info */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Informations de l'établissement</h2>
            <div className="space-y-3">
              {[
                ['etablissement',        "Nom de l'établissement"],
                ['adresseEtablissement', 'Adresse'],
                ['telephone',            'Téléphone'],
                ['email',                'Email'],
                ['site',                 'Site web'],
                ['ville',                'Ville de délivrance'],
                ['numeroRef',            'Numéro de référence'],
              ].map(([k, label]) => (
                <div key={k}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="text" value={certInfo[k]}
                    onChange={e => setCertInfo(p => ({ ...p, [k]: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — preview + actions */}
        <div className="space-y-5">
          {/* Preview card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-800 px-5 py-4">
              <p className="text-white font-bold text-sm text-center">{certInfo.etablissement}</p>
              <p className="text-blue-200 text-xs text-center mt-0.5">{certInfo.adresseEtablissement}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-center font-bold text-blue-800 text-lg tracking-wide border-b border-blue-100 pb-3 mb-4">
                CERTIFICAT D'INSCRIPTION
              </p>
              <p className="text-xs text-gray-500 mb-4 text-center">
                Réf: {certInfo.numeroRef || '—'} &nbsp;|&nbsp; Délivré le : {formatDate(new Date())}
              </p>

              {selectedEtudiant ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-blue-700 mb-2">ÉTUDIANT(E)</p>
                    {[
                      ['Nom', `${getCivilite(selectedEtudiant.civilites_id)} ${selectedEtudiant.nom} ${selectedEtudiant.prenoms}`],
                      ['Naissance', formatDate(selectedEtudiant.dateNaissance)],
                      ['Pays', getPays(selectedEtudiant.pays_id)],
                    ].map(([l, v]) => (
                      <div key={l} className="flex text-xs py-0.5">
                        <span className="text-gray-500 w-24">{l} :</span>
                        <span className="text-gray-800 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>

                  {selectedInscription && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-green-700 mb-2">INSCRIPTION</p>
                      {[
                        ['Parcours', getParcours(selectedInscription.parcours_id)],
                        ['Année', getAnnee(selectedInscription.annee_academique_id)],
                        ['Date', formatDate(selectedInscription.dateInscription)],
                        ['Décision', getDecision(selectedInscription.decisions_id)],
                      ].map(([l, v]) => (
                        <div key={l} className="flex text-xs py-0.5">
                          <span className="text-gray-500 w-24">{l} :</span>
                          <span className="text-gray-800 font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 italic text-center pt-1">
                    Ce certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Fait à {certInfo.ville}, le {formatDate(new Date())}
                  </p>
                  <div className="text-center pt-2">
                    <p className="text-xs font-medium text-gray-600">Le Directeur des Études</p>
                    <div className="border-b border-gray-300 w-32 mx-auto mt-6 mb-1" />
                    <p className="text-xs text-gray-400 italic">Signature et cachet</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sélectionnez un étudiant pour prévisualiser</p>
                </div>
              )}
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={generatePDF}
            disabled={!selectedEtudiant || loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Download className="w-5 h-5" />
            Télécharger le certificat PDF
          </button>
        </div>
      </div>
    </div>
  );
}