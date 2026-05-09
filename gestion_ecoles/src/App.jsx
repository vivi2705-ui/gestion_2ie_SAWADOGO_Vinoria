// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate,Outlet } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import ProtectedRoute    from './components/ProtectedRoute';
import LoginPage         from './pages/LoginPage';
import Dashboard         from './pages/ressources/Dashboard';
import Sidebar from './components/Sidebar';
import Ecoles from './pages/ressources/Ecoles';
import AnneeAcademiquePage from './pages/ressources/AnneeAcademiquePage';
import CyclesPage from './pages/ressources/CyclesPage';
import FilieresPage from './pages/ressources/FilieresPage';
import SpecialitesPage from './pages/ressources/SpecialitesPage';
import NiveauxPage from './pages/ressources/NiveauxPage';
import ParcoursPage from './pages/ressources/ParcoursPage';
import PaysPage from './pages/ressources/PaysPage';
import AjouterEtudiant from './pages/etudiants/EtudiantsPage';
import InscrireEtudiant from './pages/etudiants/InscriptionsPage';
import ListeEtudiants from './pages/etudiants/ListeEtudiantsPage';
import CertificatInscription from './pages/etudiants/CertificationPage';
import Trombinoscope from './pages/etudiants/Trombinoscope';

  
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
       
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<LoginPage />} />

          
          {/* Routes protégées */}
          
          <Route element={<ProtectedRoute />}>
             <Route element={<Sidebar />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ecoles" element={<Ecoles />} />
            <Route path='/annees' element={<AnneeAcademiquePage />} />
            <Route path='/cycles' element={<CyclesPage/>} />
            <Route path='/filieres' element={<FilieresPage/>} />
            <Route path='/specialites' element={<SpecialitesPage/>} />
            <Route path='/niveaux' element={<NiveauxPage/>} />
            <Route path='/parcours' element={<ParcoursPage/>} />
            <Route path='/pays' element={<PaysPage/>} />
            <Route path="/trombinoscope" element={<Trombinoscope />} />
            <Route path='/ajouter' element={<AjouterEtudiant/>} />
            <Route path='/inscriptions' element={<InscrireEtudiant/>} />
            <Route path='/liste' element={<ListeEtudiants/>} />
            <Route path='/certificats' element={<CertificatInscription/>} />
            
    
          </Route>
  

        
        </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
     
      </AuthProvider>
    </BrowserRouter>
  );
}
