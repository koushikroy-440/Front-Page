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
    if(companyRes.body.isCompanyExist)
    {
        //get user password 
        const query = {
            body: {
                uid : companyRes.body.data._id 
            },
            endpoint: req.get('origin'),
            api: "/api/private/user",
            iss: req.get('origin')+req.originalUrl
        }
        const uidToken = await tokenService.createCustomToken(query,expiresIn);
        const passwordRes = await httpService.getRequest({
            endpoint: req.get('origin'),
            api: '/api/private/user',
            data: uidToken
        });
        console.log(passwordRes);
        
    }else{
        res.json(companyRes);
    }
});

module.exports = router;