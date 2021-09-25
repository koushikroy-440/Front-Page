const express = require('express');
const router = express.Router();
const clientController = require('../controller/clients.controller');
router.get('/',(req,res) => {
    res.render('clients');
});

router.post('/',(req,res) => {
    clientController.create(req,res);
})

module.exports = router;