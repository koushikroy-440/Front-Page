const express = require('express');
const router = express.Router();
const clientController = require('../controller/clients.controller');
router.get('/',(req,res) => {
    res.render('clients');
});

router.get('/count-all',(req, res)=>{
    clientController.countClients(req,res);
});

router.get('/:from/:to',(req, res)=>{
    clientController.paginate(req,res);
});

router.post('/',(req,res) => {
    clientController.create(req,res);
});

router.delete('/:id',(req,res) => {
    clientController.deleteClients(req,res);
});

module.exports = router;