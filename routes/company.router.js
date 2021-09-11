const express = require('express');
const router = express.Router();
const companyController = require('../controller/company.controller');

router.post('/',(req, res) => {
    companyController.createCompany(req, res);
});

module.exports = router;