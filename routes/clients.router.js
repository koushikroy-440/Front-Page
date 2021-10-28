const express = require('express');
const router = express.Router();
const clientController = require('../controller/clients.controller');
const routePermission = require('../middleware/route-permission.middleware');
router.get('/', routePermission, (req, res) => {
    res.render('clients');
});

router.get('/count-all', (req, res) => {
    clientController.countClients(req, res);
});

router.get('/login/:query', (req, res) => {
    clientController.getClientsId(req, res);
});

router.get('/invitation/:clientToken', (req, res) => {
    clientController.invitation(req, res);
});

router.get('/all/:companyId', (req, res) => {
    clientController.allClients(req, res);
});

router.get('/:from/:to', (req, res) => {
    clientController.paginate(req, res);
});

router.post('/', (req, res) => {
    clientController.create(req, res);
});

router.post('/:id', (req, res) => {
    clientController.createUser(req, res);
    // console.log(req.body);
});

router.delete('/:id', (req, res) => {
    clientController.deleteClients(req, res);
});

router.put('/:id', (req, res) => {
    clientController.updateClients(req, res);
});
module.exports = router;