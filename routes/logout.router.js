const express = require('express');
const router = express.Router();
const authController = require("../controller/auth.controller");
router.get('/',(req, res)=>{
    authController.logout(req,res);
})

module.exports = router;