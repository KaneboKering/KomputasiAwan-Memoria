const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController'); // Pastikan nama file controller sesuai (besar/kecil)

const { validate, registerRules, loginRules } = require('../middleware/validators');


router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);

module.exports = router;