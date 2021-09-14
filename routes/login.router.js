const express = require('express');
const tokenService = require('../services/token.service');
const httpService = require('../services/http.service');
const bcryptService = require('../services/bcrypt.service');
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
                uid : companyRes.body.data[0]._id 
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
        if(passwordRes.body.isCompanyExist){
            const userRealPassword = passwordRes.body.data[0].password;
            const isLogged = await bcryptService.decrypt(userRealPassword,req.body.password);
            if(isLogged){
                const secondsInSevenDays = 64800;
                const authToken = await tokenService.createCustomToken(query,secondsInSevenDays);
                res.cookie("authToken",authToken);
                res.status(200);
                res.json({
                    isLogged : true,
                    message: 'success'
                });
            }else{
                res.status(401),
                res.json({
                    isLogged: false,
                    message: 'something went wrong'
                });
            }
        }else{
            res.status(passwordRes.status);
            res.json(passwordRes.body);
        }
        
    }else{
        res.status(companyRes.status);
        res.json(companyRes.body);
    }
});

module.exports = router;