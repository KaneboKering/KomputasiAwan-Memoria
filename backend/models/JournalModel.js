// models/JournalModel.js
const db = require('../config/database');

const JournalModel = {
    // 1. Ambil semua jurnal milik user tertentu
    getAllByUserId: async (userId, keyword, limit, offset) => {
        // Query dasar
        let query = 'SELECT * FROM journals WHERE user_id = ?';
        let params = [userId];

        // Jika ada keyword pencarian, tambahkan filter LIKE
        if (keyword) {
            query += ' AND (title LIKE ? OR content LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        // Urutkan dari yang terbaru
        query += ' ORDER BY created_at DESC';

        // Tambahkan batasan halaman (Pagination)
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await db.execute(query, params);
        
        // Kita juga butuh hitung total data (untuk info halaman)
        // Note: Di aplikasi besar, query count dipisah biar cepat, tapi ini ok untuk belajar.
        return rows;
    },

    // Tambahan: Fungsi hitung total data (supaya Frontend tahu ada berapa halaman)
    countByUserId: async (userId, keyword) => {
        let query = 'SELECT COUNT(*) as total FROM journals WHERE user_id = ?';
        let params = [userId];

        if (keyword) {
            query += ' AND (title LIKE ? OR content LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        const [rows] = await db.execute(query, params);
        return rows[0].total;
    },

    findById: async (id, userId) => {
        const query = 'SELECT * FROM journals WHERE id = ? AND user_id = ?';
        // rows[0] karena kita cuma butuh 1 data, bukan array
        const [rows] = await db.execute(query, [id, userId]);
        return rows[0];
    },

    // 2. Buat jurnal baru
    create: async (userId, title, content, mood, image) => { // Tambah parameter image
        const query = 'INSERT INTO journals (user_id, title, content, mood, image) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [userId, title, content, mood, image]);
        return result;
    },

    update: async (id, userId, title, content, mood, newImage) => {
        let query;
        let params;

        if (newImage) {
            // Kalau ada gambar baru, update kolom image juga
            query = `
                UPDATE journals 
                SET title = ?, content = ?, mood = ?, image = ? 
                WHERE id = ? AND user_id = ?
            `;
            params = [title, content, mood, newImage, id, userId];
        } else {
            // Kalau TIDAK ada gambar baru, kolom image jangan disentuh
            query = `
                UPDATE journals 
                SET title = ?, content = ?, mood = ?
                WHERE id = ? AND user_id = ?
            `;
            params = [title, content, mood, id, userId];
        }

        const [result] = await db.execute(query, params);
        return result;
    },

    // 4. Hapus jurnal
    delete: async (id, userId) => {
        const query = 'DELETE FROM journals WHERE id = ? AND user_id = ?';
        const [result] = await db.execute(query, [id, userId]);
        return result;
    }
};

module.exports = JournalModel;