const express = require('express');
const router = express.Router();
const pdfController = require('../controller/pdf.controller');

router.post('/', (req, res) => {
    pdfController.pdf(req, res);
});

router.delete('/:pdfName', (req, res) => {
    pdfController.deletePdf(req, res);
});

module.exports = router;