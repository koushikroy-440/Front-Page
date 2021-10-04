const express = require('express');
const router = express.Router();

const sendEmailController = require("../controller/sendmail.controller");

router.post('/', (req, res) => {
    sendEmailController.sendEmail(req, res);
});

module.exports = router;
