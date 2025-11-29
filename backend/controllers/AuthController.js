const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <--- PENTING: Kita butuh library ini

// --- Fungsi Register (Yang sudah ada) ---
const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Semua field harus diisi!' });
    }
    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar!' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await UserModel.createNewUser(username, email, hashedPassword);
        res.status(201).json({ message: 'Registrasi berhasil!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- Fungsi Login (YANG BARU) ---
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 2. Cari user di database berdasarkan email
        const user = await UserModel.findByEmail(email);
        
        // Kalau user tidak ditemukan
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // 3. Cek Password (bandingkan password input vs database)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // 4. Kalau cocok, Buat Token (JWT)
        // Token ini berisi ID user, dan rahasianya diambil dari .env
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token berlaku 1 hari
        );

        // 5. Kirim Token ke frontend/user
        res.json({
            message: 'Login berhasil!',
            token: token, // <--- INI TIKETNYA
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Jangan lupa export keduanya!
module.exports = { register, login };