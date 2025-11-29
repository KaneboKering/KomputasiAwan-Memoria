// models/UserModel.js
const db = require('../config/database');

const UserModel = {
    // Fungsi untuk membuat user baru
    createNewUser: async (username, email, password) => {
        const query = `
            INSERT INTO users (username, email, password) 
            VALUES (?, ?, ?)
        `;
        // execute mengembalikan array, kita ambil result-nya
        const [result] = await db.execute(query, [username, email, password]);
        return result;
    },

    // Fungsi untuk mencari user berdasarkan email (biar gak ada email kembar)
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0]; // Kembalikan user pertama yang ditemukan
    }
};

module.exports = UserModel;