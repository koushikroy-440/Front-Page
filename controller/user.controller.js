const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const create = async (req, res) => {
    const token = tokenService.verify(req);
    if (token.isVerified) {
        try {
            /**
             * auto login after signup
             */
            const uidJson = {
                uid: token.data.uid
            }
            const endpoint = req.get('origin') || "http://" + req.get('host');
            const option = {
                body: uidJson,
                endpoint: endpoint,
                originalUrl: req.originalUrl,
                iss: endpoint + req.originalUrl,
            }
            const expiresIn = 86400;
            const newToken = await tokenService.createCustomToken(option, expiresIn);
            token.data['token'] = newToken;
            token.data['expiresIn'] = 86400;
            token.data['isLogged'] = true;
            //end auto login
            const userRes = await databaseService.createRecord(token.data, 'user');
            res.status(200);
            res.json({
                isUserCreated: true,
                token: newToken,
                message: 'user created !',
            });
        } catch (e) {
            res.status(500);
            res.json({
                isUserCreated: false,
                message: 'Internal server error',
            })
        }
    }
    else {
        res.status(401);
        res.send({
            message: "permission denied !"
        });
    }
}

const getUserPassword = async (req, res) => {
    const token = await tokenService.verify(req);
    if (token.isVerified) {
        const userData = token.data;
        const query = {
            uid: userData.uid
        }
        const dataRes = await databaseService.getRecordByQuery(query, 'user');
        if (dataRes.length > 0) {
            res.status(200);
            res.json({
                isCompanyExist: true,
                message: 'success',
                data: dataRes
            });
        } else {
            res.status(401);
            res.json({
                isCompanyExist: false,
                message: 'company not found',
            });
        }
    } else {
        res.status(401);
        res.json("message: permission denied !");
    }
}

const createLog = async (req, res) => {
    const token = await tokenService.verify(req);
    if (token.isVerified) {
        const query = {
            uid: token.data.uid,
        };
        const data = {
            token: req.body.token,
            expiresIn: 64800, // 7 days
            isLogged: true,
            updatedAt: Date.now()
        };
        const userRes = await databaseService.updateByQuery(query, 'user', data);
        res.status(201);
        res.json({
            message: "update success",
        });
    } else {
        res.status(401);
        res.json({
            message: "permission denied !"
        });
    }
}
module.exports = {
    createUser: create,
    getUserPassword: getUserPassword,
    createLog: createLog
}