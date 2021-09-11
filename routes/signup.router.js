
const express = require('express');
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");

router.post('/', async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.create(req,expiresIn);

    //request company api 
    const companyRes = await httpService.postRequest({
        endpoint: req.get('origin'),
        api: "/api/private/company",
        data: token
    });
    console.log(companyRes);
    //requesting api user
    if(companyRes.body.isCompanyCreated)
    {
        const newUser = {
            body:{
                uid: companyRes.body.data._id,
                password: req.body.password
            },
            endpoint:req.get('origin'),
            originalUrl: req.originalUrl,
            iss: req.get('origin')+req.originalUrl,
        };
        const userToken = await tokenService.createCustomToken(newUser,expiresIn);
        const userRes = httpService.postRequest({
            endpoint: req.get('origin'),
            api: "/api/private/user",
            data: userToken
        });
        //return res
        res.send(userRes.body);
    }
    else{
        res.json(companyRes)
    }
});
module.exports = router;