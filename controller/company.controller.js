const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');

const createCompany = async (req, res) => {
    const token = tokenService.verify(req);
    if (token.isVerified) {
        const data = token.data;
        // now you can store data
        try {
            const dataRes = await dbService.createRecord(data, 'company');
            res.status(200);
            res.json({
                isCompanyCreated: true,
                message: "company created !",
                data: dataRes
            });
        } catch (err) {
            res.status(409);
            res.json({
                isCompanyCreated: false,
                message: err
            });
        }
    }
    else {
        res.status(401);
        res.json({ message: "permission denied" });
    }
}

const getCompanyId = async (req, res) => {
    const token = tokenService.verify(req);
    if (token.isVerified) {
        const query = {
            email: token.data.email,
        }
        const companyRes = await dbService.getRecordByQuery(query, 'company');
        if (companyRes.length > 0) {
            res.status(200);
            res.json({
                isCompanyExist: true,
                message: "company available",
                data: companyRes
            });
        } else {
            res.status(404);
            res.json({
                isCompanyExist: false,
                message: "company not exists",
            });
        }
    }
    else {
        res.status(401);
        res.json({
            message: "Permission denied",
        });
    }

}

const updateCompanyData = async (req, res) => {
    const token = tokenService.verify(req);
    if (token.isVerified) {
        const id = req.params.id;
        const data = req.body;
        console.log(data);
        try {
            const dataRes = await dbService.updateClients(id, data, 'company');
            const newToken = await refreshToken(req, id, dataRes);
            res.cookie("authToken", newToken, { maxAge: (86400 * 1000) });
            res.status(201);
            res.json({
                message: "Update success",
                data: dataRes
            });
        } catch (err) {
            res.status(424);
            res.send({
                message: 'update failed !',
                data: err
            });
        }

    } else {
        res.status(401);
        res.json({
            message: "Permission denied",
        });
    }
}
const refreshToken = async (req, id, dataRes) => {
    data = {
        uid: id,
        companyInfo: dataRes
    }
    const query = {
        uid: id
    }
    const endpoint = req.get('origin') || "http://" + req.get('host');
    const option = {
        body: data,
        endpoint: endpoint,
        originalUrl: req.originalUrl,
        iss: endpoint + "/api/private/company"
    }
    const expiresIn = 86400;
    const newToken = await tokenService.createCustomToken(option, expiresIn);
    //update new token in database
    const updateMe = {
        token: newToken,
        expiresIn: 86400,
        updatedAt: Date.now()
    }
    await dbService.updateByQuery(query, 'user', updateMe);
    return newToken;
}
module.exports = {
    createCompany: createCompany,
    getCompanyId: getCompanyId,
    updateCompanyData: updateCompanyData
};