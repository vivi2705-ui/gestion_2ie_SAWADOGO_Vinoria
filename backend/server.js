const express = require("express");
const cors    = require("cors");
const app     = express();

// ── Middlewares ───────────────────────────────────────────────────────────────
// app.use(cors());            // autorise les requêtes depuis React (localhost:5173)
app.use(cors());  
app.use(express.json());    // parse le corps des requêtes en JSON

// ── Routes ────────────────────────────────────────────────────────────────────
const authRouter = require("./routes/auth");
const ecolesRoutes = require("./routes/ecoles");
const anneeRoutes = require("./routes/annee");
const cyclesRoutes = require("./routes/cycles");
const filieresRoutes = require("./routes/filieres");
const specialitesRoutes = require("./routes/specialites");
const niveauxRoutes = require("./routes/niveaux");
const parcoursRoutes = require("./routes/parcours");
const paysRoutes = require("./routes/pays");
const civilitesRoutes = require("./routes/civilites");
const etudiantsRoutes = require("./routes/etudiants");
const inscriptionsRoutes = require("./routes/inscriptions");
const decisionsRoutes = require("./routes/decisions");



app.use("/api/auth", authRouter);
app.use('/api/ecoles', ecolesRoutes);
app.use("/api/anneeacademiques",anneeRoutes);
app.use("/api/cycles",cyclesRoutes);
app.use("/api/filieres",filieresRoutes);
app.use("/api/specialites",specialitesRoutes);
app.use("/api/niveaux",niveauxRoutes);
app.use("/api/parcours",parcoursRoutes);
app.use("/api/pays",paysRoutes);
app.use("/api/civilites",civilitesRoutes);
app.use("/api/etudiants",etudiantsRoutes);
app.use("/api/inscriptions",inscriptionsRoutes);
app.use("/api/decisions",decisionsRoutes);



// ── Démarrage du serveur ──────────────────────────────────────────────────────
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
