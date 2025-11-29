const JournalModel = require('../models/JournalModel');

const journalController = {
    // 1. Buat Diary Baru
    createJournal: async (req, res) => {
        try {
            const { title, content, mood } = req.body;
            const userId = req.user.id;

            const image = req.file ? req.file.filename : null;

            if (!title || !content) {
                return res.status(400).json({ message: 'Judul dan isi tidak boleh kosong!' });
            }

            await JournalModel.create(userId, title, content, mood, image);

            res.status(201).json({
                message: 'Diary berhasil disimpan!',
                data: { title, mood, image }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal menyimpan diary', error: error.message });
        }
    },

    // 2. Ambil Semua Diary Milik User Login
    getMyJournals: async (req, res) => {
        try {
            const userId = req.user.id;

            const page = parseInt(req.query.page) || 1;    // Halaman ke berapa
            const limit = parseInt(req.query.limit) || 10; // Berapa data per halaman
            const search = req.query.search || '';         // Kata kunci pencarian


            const offset = (page - 1) * limit;

            const journals = await JournalModel.getAllByUserId(userId, search, limit, offset);
            const journalsWithUrl = journals.map(journal => {
                return {
                    ...journal,
                    imageUrl: journal.image ? `${req.protocol}://${req.get('host')}/uploads/${journal.image}` : null
                };
            });
            const totalData = await JournalModel.countByUserId(userId, search);
            const totalPage = Math.ceil(totalData / limit);

            res.json({
                message: 'Berhasil mengambil data diary',
                data: journalsWithUrl,
                meta: {
                    totalData: totalData,
                    totalPage: totalPage,
                    currentPage: page,
                    limit: limit
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal mengambil data' });
        }
    },

    getJournalById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const journal = await JournalModel.findById(id, userId);

            if (!journal) {
                return res.status(404).json({ message: 'Diary tidak ditemukan' });
            }
            const journalWithUrl = {
                ...journal,
                imageUrl: journal.image ? `${req.protocol}://${req.get('host')}/uploads/${journal.image}` : null
            };

            res.json({
                message: 'Detail diary berhasil diambil',
                data: journalWithUrl
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal mengambil detail diary' });
        }
    },

    updateJournal: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, mood } = req.body;
            const userId = req.user.id;

            // Cek apakah user mengupload file baru?
            let newImage = null;
            if (req.file) {
                newImage = req.file.filename;
            }

            // Panggil Model (Kita perlu update model sebentar lagi)
            const result = await JournalModel.update(id, userId, title, content, mood, newImage);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Diary tidak ditemukan atau bukan milik Anda' });
            }

            res.json({ message: 'Diary berhasil diupdate!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal update data' });
        }
    },

    // 4. Hapus Diary
    deleteJournal: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await JournalModel.delete(id, userId);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Diary tidak ditemukan atau bukan milik Anda' });
            }

            res.json({ message: 'Diary berhasil dihapus!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal menghapus data' });
        }
    }
};

module.exports = journalController;