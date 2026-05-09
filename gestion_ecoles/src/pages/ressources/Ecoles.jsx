import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, School, MapPin, Phone, Mail, Search } from 'lucide-react';
import ecoleService from '../../services/ecoleService';

const Ecoles = () => {
    const [ecoles, setEcoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEcole, setCurrentEcole] = useState({
        id: null,
        libelle: '',
        adresse: '',
        telephone: '',
        email: ''
    });

    useEffect(() => {
        fetchEcoles();
    }, []);

    const fetchEcoles = async () => {
        setLoading(true);
        try {
            const response = await ecoleService.getAllEcoles();
            if (response.success) {
                setEcoles(response.data);
            }
        } catch (error) {
            toast.error(error.message || 'Erreur lors du chargement des écoles');
        } finally {
            setLoading(false);
        }
    };

    const filteredEcoles = ecoles.filter(ecole =>
        ecole.libelle?.toLowerCase().includes(search.toLowerCase()) ||
        ecole.adresse?.toLowerCase().includes(search.toLowerCase()) ||
        ecole.email?.toLowerCase().includes(search.toLowerCase()) ||
        ecole.telephone?.includes(search)
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEcole(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditMode(false);
        setCurrentEcole({ id: null, libelle: '', adresse: '', telephone: '', email: '' });
        setShowModal(true);
    };

    const openEditModal = (ecole) => {
        setEditMode(true);
        setCurrentEcole({
            id: ecole.id,
            libelle: ecole.libelle,
            adresse: ecole.adresse,
            telephone: ecole.telephone,
            email: ecole.email
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentEcole({ id: null, libelle: '', adresse: '', telephone: '', email: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentEcole.libelle || !currentEcole.adresse ||
            !currentEcole.telephone || !currentEcole.email) {
            toast.error('Tous les champs sont obligatoires');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(currentEcole.email)) {
            toast.error('Email invalide');
            return;
        }

        try {
            if (editMode) {
                const response = await ecoleService.updateEcole(currentEcole.id, currentEcole);
                if (response.success) {
                    toast.success('École modifiée avec succès');
                    fetchEcoles();
                    closeModal();
                }
            } else {
                const response = await ecoleService.createEcole(currentEcole);
                if (response.success) {
                    toast.success('École ajoutée avec succès');
                    fetchEcoles();
                    closeModal();
                }
            }
        } catch (error) {
            toast.error(error.message || 'Une erreur est survenue');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette école ?')) {
            try {
                const response = await ecoleService.deleteEcole(id);
                if (response.success) {
                    toast.success('École supprimée avec succès');
                    fetchEcoles();
                }
            } catch (error) {
                toast.error(error.message || 'Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="w-full">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <School className="w-7 h-7 text-blue-600" />
                        Gestion des Écoles
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Gérez vos écoles : ajoutez, modifiez ou supprimez des établissements
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                             rounded-lg hover:bg-blue-700 transition-colors duration-200 
                             shadow-md hover:shadow-lg text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter une école
                </button>
            </div>

            {/* Search bar */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher par nom, adresse, email ou téléphone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full max-w-sm pl-9 pr-3 py-2 border border-gray-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:border-transparent text-sm"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute left-72 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Results count */}
            {search && (
                <p className="text-sm text-gray-500 mb-3">
                    {filteredEcoles.length} résultat{filteredEcoles.length !== 1 ? 's' : ''} pour "{search}"
                </p>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">Chargement...</p>
                                    </td>
                                </tr>
                            ) : filteredEcoles.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center">
                                        <School className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500">
                                            {search
                                                ? 'Aucune école ne correspond à la recherche.'
                                                : 'Aucune école trouvée'}
                                        </p>
                                        {!search && (
                                            <button
                                                onClick={openAddModal}
                                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Ajouter votre première école
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredEcoles.map((ecole) => (
                                    <tr key={ecole.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <School className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                <span className="font-medium text-gray-900 text-sm">{ecole.libelle}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span className="truncate max-w-[200px]">{ecole.adresse}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                                {ecole.telephone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span className="truncate max-w-[200px]">{ecole.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openEditModal(ecole)}
                                                className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200"
                                                title="Modifier"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ecole.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
                            onClick={closeModal}
                        />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editMode ? "Modifier l'école" : 'Ajouter une école'}
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
                                    <input
                                        type="text" name="libelle" value={currentEcole.libelle}
                                        onChange={handleInputChange} required
                                        placeholder="Nom de l'école"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                                    <textarea
                                        name="adresse" value={currentEcole.adresse}
                                        onChange={handleInputChange} rows="2" required
                                        placeholder="Adresse de l'école"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                                    <input
                                        type="text" name="telephone" value={currentEcole.telephone}
                                        onChange={handleInputChange} required
                                        placeholder="Numéro de téléphone"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email" name="email" value={currentEcole.email}
                                        onChange={handleInputChange} required
                                        placeholder="adresse@email.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button" onClick={closeModal}
                                        className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {editMode ? 'Modifier' : 'Ajouter'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ecoles;