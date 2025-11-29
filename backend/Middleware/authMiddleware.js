// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    // 1. Ambil token dari Header (Format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    // Jika header ada, split spasi dan ambil tokennya (index 1)
    const token = authHeader && authHeader.split(' ')[1]; 

    // 2. Kalau tidak ada token, tolak!
    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak! Token tidak ditemukan.' });
    }

    // 3. Verifikasi Token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
        }

        // 4. Jika valid, simpan data user ke dalam request (req.user)
        // Ini penting! Supaya nanti controller tahu siapa yang sedang login.
        req.user = user; 
        next(); // Lanjut ke controller berikutnya
    });
};

module.exports = authenticateToken;