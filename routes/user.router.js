const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
router.post('/',(req, res)=>{
    userController.createUser(req, res);
});

router.get('/:query',(req, res)=>{
    userController.getUserPassword(req, res);
  
});

module.exports = router;