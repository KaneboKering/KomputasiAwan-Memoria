// middleware/validators.js
const { body, validationResult } = require('express-validator');

// 1. Fungsi pembantu untuk menampilkan error (Reusable)
// Fungsi ini akan mengecek apakah ada error dari aturan yang kita buat di bawah
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Jika ada error, stop request dan kirim daftar errornya
        return res.status(400).json({ 
            message: 'Data tidak valid',
            errors: errors.array() 
        });
    }
    next(); // Jika aman, lanjut ke controller
};

// 2. Aturan untuk Register
const registerRules = [
    body('username')
        .notEmpty().withMessage('Username tidak boleh kosong')
        .isLength({ min: 3 }).withMessage('Username minimal 3 karakter'),
    body('email')
        .isEmail().withMessage('Format email tidak valid'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

// 3. Aturan untuk Login
const loginRules = [
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').notEmpty().withMessage('Password harus diisi'),
];

// 4. Aturan untuk Membuat/Edit Diary
const journalRules = [
    body('title').notEmpty().withMessage('Judul tidak boleh kosong'),
    body('content').notEmpty().withMessage('Isi diary tidak boleh kosong'),
];

module.exports = { 
    validate, 
    registerRules, 
    loginRules, 
    journalRules 
};