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
// const mysql = require("mysql2");

// // ── Connexion à la base de données MySQL ──────────────────────────────────────
// const db = mysql.createConnection({
//     host:     "localhost",
//     user:     "root",        // ton utilisateur MySQL
//     password: "",            // ton mot de passe MySQL
//     database: "gestion_ecoles",
// });

// db.connect((err) => {
//     if (err) {
//         console.error("Erreur de connexion MySQL :", err.message);
//         return;
//     }
//     console.log("Connecté à la base de données MySQL");
// });

// module.exports = db;
