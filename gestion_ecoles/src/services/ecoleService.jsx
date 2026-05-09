import axios from 'axios';

const API_URL = 'http://localhost:8000/api/ecoles';

const ecoleService = {
    // Récupérer toutes les écoles
    getAllEcoles: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    

    // Récupérer une école par ID
    getEcoleById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Ajouter une école
    createEcole: async (ecoleData) => {
        try {
            const response = await axios.post(API_URL, ecoleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Modifier une école
    updateEcole: async (id, ecoleData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, ecoleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Supprimer une école
    deleteEcole: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    } 
};

export default ecoleService;