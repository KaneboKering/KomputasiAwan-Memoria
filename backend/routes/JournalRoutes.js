const express = require('express');
const router = express.Router();
const journalController = require('../controllers/JournalController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const { validate, journalRules } = require('../middleware/validators');
// Create & Read (Sudah ada)
router.post('/', 
    authenticateToken, 
    upload.single('image'), // 'image' adalah nama field di form nanti
    journalRules, 
    validate, 
    journalController.createJournal
);

router.get('/', authenticateToken, journalController.getMyJournals);

// UPDATE (Edit) - Perhatikan ada /:id
router.put('/:id', 
    authenticateToken, 
    upload.single('image'), // <--- Tambahkan ini
    journalRules, 
    validate, 
    journalController.updateJournal
);

// DELETE (Hapus) - Perhatikan ada /:id
router.delete('/:id', authenticateToken, journalController.deleteJournal);

router.get('/:id', authenticateToken, journalController.getJournalById);
module.exports = router;