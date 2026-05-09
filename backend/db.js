const mysql = require("mysql2/promise");

// ── Connexion à la base de données MySQL ──────────────────────────────────────
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestion_ecoles",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Pool MySQL créé avec succès");

module.exports = db;

