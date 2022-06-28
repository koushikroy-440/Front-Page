const express = require('express');
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");

router.post('/', async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.create(req, expiresIn);

    //request company api  
    const companyRes = await httpService.postRequest({
        endpoint: req.get('origin'),
        api: "/api/private/company",
        data: token
    });
    // console.log(companyRes);
    //requesting user api
    if (companyRes.body.isCompanyCreated) {
        const newUser = {
            body: {
                uid: companyRes.body.data._id,
                password: req.body.password,
                companyInfo: companyRes.body.data
            },
            endpoint: req.get('origin'),
            originalUrl: req.originalUrl,
            iss: req.get('origin') + req.originalUrl,
        };
        const userToken = await tokenService.createCustomToken(newUser, expiresIn);
        const userRes = await httpService.postRequest({
            endpoint: req.get('origin'),
            api: "/api/private/user",
            data: userToken
        });
        //return user res
        res.cookie("authToken", userRes.body.token, { maxAge: (86400 * 1000) });
        res.status(userRes.status);
        res.send(userRes.body);
    }
    else {
        res.status(companyRes.status);
        res.json(companyRes)
    }
});
module.exports = router;