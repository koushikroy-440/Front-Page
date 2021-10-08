const express = require('express');
const router = express.Router();
const pdfController = require('../controller/pdf.controller');
router.post('/', (req, res) => {
    pdfController.pdf();
});

module.exports = router;