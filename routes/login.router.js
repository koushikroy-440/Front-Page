const express = require('express');
const tokenService = require('../services/token.service');
const httpService = require('../services/http.service');
const router = express.Router();

router.post('/', async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.create(req,expiresIn); 

    //getting user id
    const companyRes = await httpService.getRequest({
        endpoint: req.get('origin'),
        api: '/api/private/company',
        data: token
    });
    console.log(companyRes);
});

module.exports = router;