const express = require('express');
const router = express.Router();
const teamController = require('../controller/team.controller');

router.get('/', function (req, res) {
    res.render("team");
});

router.get('/getAll', function (req, res) {
    teamController.getAllTask(req, res);
})

module.exports = router;