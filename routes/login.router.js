const express = require('express');
const tokenService = require('../services/token.service');
const httpService = require('../services/http.service');
const bcryptService = require('../services/bcrypt.service');
const router = express.Router();

router.post('/', async (req, res) => {

    const loginAs = req.body.loginAs;
    if (loginAs === 'admin') {
        adminLogger(req, res);
    }
    if (loginAs === 'client') {
        clientLogger(req, res);
    }
    if (loginAs === 'team') {
        teamLogger(req, res);
    }
});

const adminLogger = async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.create(req, expiresIn);

    //getting user id
    const companyRes = await httpService.getRequest({
        endpoint: req.get('origin'),
        api: '/api/private/company',
        data: token
    });

    if (companyRes.body.isCompanyExist) {
        const query = {
            body: {
                uid: companyRes.body.data[0]._id,
                companyInfo: companyRes.body.data[0]
            },
            endpoint: req.get('origin'),
            api: "/api/private/user",
            iss: req.get('origin') + req.originalUrl
        }
        const uidToken = await tokenService.createCustomToken(query, expiresIn);
        const passwordRes = await httpService.getRequest({
            endpoint: req.get('origin'),
            api: '/api/private/user',
            data: uidToken
        });
        //update role in authToken
        const role = passwordRes.body.data[0].role;
        query.body['role'] = role;
        //get user password 

        if (passwordRes.body.isCompanyExist) {
            //allow single device login
            // if(passwordRes.body.data[0].isLogged)
            // {
            //     res.status(406);
            //     res.send({
            //         message: "please logout from another device"
            //     });
            //     return false;
            // }

            const userRealPassword = passwordRes.body.data[0].password;
            const isLogged = await bcryptService.decrypt(userRealPassword, req.body.password);
            if (isLogged) {
                const secondsInSevenDays = 64800; //7 days
                const authToken = await tokenService.createCustomToken(query, secondsInSevenDays);
                //update token in database
                const dbToken = await httpService.putRequest({
                    endpoint: req.get('origin'),
                    api: '/api/private/user',
                    data: authToken
                });

                res.cookie("authToken", authToken, { maxAge: (secondsInSevenDays * 1000) });
                res.status(200);
                res.json({
                    role: 'admin',
                    isLogged: true,
                    message: 'success'
                });
            } else {
                res.status(401),
                    res.json({

                        isLogged: false,
                        message: 'wrong password'
                    });
            }
        } else {
            res.status(passwordRes.status);
            res.json(passwordRes.body);
        }

    } else {
        res.status(companyRes.status);
        res.json(companyRes.body);
    }
}

const clientLogger = async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.create(req, expiresIn);

    //getting user id
    const companyRes = await httpService.getRequest({
        endpoint: req.get('origin'),
        api: '/clients/login',
        data: token
    });

    if (companyRes.body.isCompanyExist) {
        const query = {
            body: {
                uid: companyRes.body.data[0]._id,
                clientInfo: companyRes.body.data[0]
            },
            endpoint: req.get('origin'),
            api: "/api/private/user",
            iss: req.get('origin') + req.originalUrl
        }
        const uidToken = await tokenService.createCustomToken(query, expiresIn);
        const passwordRes = await httpService.getRequest({
            endpoint: req.get('origin'),
            api: '/api/private/user',
            data: uidToken
        });
        //update role in authToken
        const role = passwordRes.body.data[0].role;
        query.body['role'] = role;

        //get user password 

        if (passwordRes.body.isCompanyExist) {
            //allow single device login
            // if(passwordRes.body.data[0].isLogged)
            // {
            //     res.status(406);
            //     res.send({
            //         message: "please logout from another device"
            //     });
            //     return false;
            // }

            const userRealPassword = passwordRes.body.data[0].password;
            const isLogged = await bcryptService.decrypt(userRealPassword, req.body.password);
            if (isLogged) {
                const secondsInSevenDays = 64800; //7 days
                const authToken = await tokenService.createCustomToken(query, secondsInSevenDays);
                //update token in database
                const dbToken = await httpService.putRequest({
                    endpoint: req.get('origin'),
                    api: '/api/private/user',
                    data: authToken
                });

                res.cookie("authToken", authToken, { maxAge: (secondsInSevenDays * 1000) });
                res.status(200);
                res.json({
                    role: 'client',
                    isLogged: true,
                    message: 'success'
                });
            } else {
                res.status(401),
                    res.json({
                        isLogged: false,
                        message: 'wrong password'
                    });
            }
        } else {
            res.status(passwordRes.status);
            res.json(passwordRes.body);
        }

    } else {
        res.status(companyRes.status);
        res.json(companyRes.body);
    }
}

const teamLogger = async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.create(req, expiresIn);

    //getting user id
    const companyRes = await httpService.getRequest({
        endpoint: req.get('origin'),
        api: '/clients/login',
        data: token
    });

    if (companyRes.body.isCompanyExist) {
        const query = {
            body: {
                uid: companyRes.body.data[0]._id,
                companyInfo: companyRes.body.data[0]
            },
            endpoint: req.get('origin'),
            api: "/api/private/user",
            iss: req.get('origin') + req.originalUrl
        }
        const uidToken = await tokenService.createCustomToken(query, expiresIn);
        const passwordRes = await httpService.getRequest({
            endpoint: req.get('origin'),
            api: '/api/private/user',
            data: uidToken
        });
        //update role in authToken
        const role = passwordRes.body.data[0].role;
        query.body['role'] = role;
        //get user password 

        if (passwordRes.body.isCompanyExist) {
            //allow single device login
            // if(passwordRes.body.data[0].isLogged)
            // {
            //     res.status(406);
            //     res.send({
            //         message: "please logout from another device"
            //     });
            //     return false;
            // }

            const userRealPassword = passwordRes.body.data[0].password;
            const isLogged = await bcryptService.decrypt(userRealPassword, req.body.password);
            if (isLogged) {
                const secondsInSevenDays = 64800; //7 days
                const authToken = await tokenService.createCustomToken(query, secondsInSevenDays);
                //update token in database
                const dbToken = await httpService.putRequest({
                    endpoint: req.get('origin'),
                    api: '/api/private/user',
                    data: authToken
                });

                res.cookie("authToken", authToken, { maxAge: (secondsInSevenDays * 1000) });
                res.status(200);
                res.json({
                    role: 'team',
                    isLogged: true,
                    message: 'success'
                });
            } else {
                res.status(401),
                    res.json({
                        isLogged: false,
                        message: 'wrong password'
                    });
            }
        } else {
            res.status(passwordRes.status);
            res.json(passwordRes.body);
        }

    } else {
        res.status(companyRes.status);
        res.json(companyRes.body);
    }
}

module.exports = router;