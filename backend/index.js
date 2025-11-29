const express = require('express');
const cors = require('cors');
require('dotenv').config();

// IMPORT DATABASE (Supaya koneksi jalan)
const db = require('./config/database'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors());
const authRoutes = require('./routes/AuthRoutes');
const journalRoutes = require('./routes/JournalRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes);
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
    res.send('API Diary PaaS is Running...');
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
module.exports = app;