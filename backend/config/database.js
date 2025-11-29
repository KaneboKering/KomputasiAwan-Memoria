const mysql = require('mysql2');
require('dotenv').config();

// Cek apakah kita sedang di production (Cloud) atau development (Laptop)
// Jika variabel DB_URL ada, berarti kita pakai settingan Cloud
const dbConfig = process.env.DB_URL 
    ? {
        uri: process.env.DB_URL,
        ssl: { rejectUnauthorized: false } // Penting untuk Aiven!
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      };

// Buat koneksi (Jika ada URI pakai uri, jika tidak pakai parameter biasa)
const db = process.env.DB_URL 
    ? mysql.createPool(dbConfig.uri) 
    : mysql.createPool(dbConfig);

db.getConnection((err) => {
    if (err) {
        console.error('Gagal konek ke database:', err);
    } else {
        console.log('Berhasil konek ke database MySQL!');
    }
});

module.exports = db.promise();