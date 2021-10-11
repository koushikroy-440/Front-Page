const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');
const create = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        const data = req.body;
        data['companyId'] = tokenData.data.uid;
        try {
            const dataRes = await dbService.createRecord(data, 'client');
            res.status(200);
            res.json({
                message: "data created",
                data: dataRes
            })
        } catch (err) {
            res.status(409);
            res.json({
                message: "data not created",
                error: err
            });
        }
    } else {
        res.status(401);
        res.json({
            message: 'permission denied !'
        });
    }
}

const countClients = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        const dataRes = await dbService.countData('client');
        res.status(200);
        res.json({ data: dataRes });
    } else {
        res.status(401);
        res.json({ message: 'permission denied !' });
    }
}

const allClients = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {

        const query = {
            companyId: req.params.companyId
        }
        const dbRes = await dbService.getRecordByQuery(query, 'client');
        res.status(200);
        res.json({
            data: dbRes,
        });

    } else {
        res.status(401);
        res.json({ message: 'permission denied !' });
    }
}

const paginate = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        let from = Number(req.params.from);
        let to = Number(req.params.to);
        const query = {
            companyId: tokenData.data.uid,
        };
        const dataRes = await dbService.paginate(query, from, to, 'client');
        res.status(200);
        res.json({
            data: dataRes
        });
    } else {
        res.status(401);
        res.json({
            message: 'permission denied !'
        });
    }
}

const deleteClients = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        const id = req.params.id;
        const dataRes = await dbService.deleteClients(id, 'client');
        res.status(200);
        res.json({
            data: dataRes
        });
    } else {
        res.status(401);
        res.json({
            message: 'permission denied !'
        });
    }
}

const updateClients = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        const id = req.params.id;
        const data = req.body;
        const updateRes = await dbService.updateClients(id, data, 'client');
        res.status(201);
        res.json({
            data: updateRes
        });
    } else {
        res.status(401);
        res.json({
            message: 'permission denied !'
        });
    }
}

const invitation = async (req, res) => {
    const token = req.params.clientToken;
    const tokenData = await tokenService.customTokenVerification(token);
    if (tokenData.isVerified) {
        const clientId = tokenData.data.clientId;
        const client = await getClientInfo(clientId);
        if (!client.isUser) {
            res.render("invitation");
        } else {
            res.redirect("/");
        }
    } else {
        res.status(401);
        res.redirect("/");
    }
}

const getClientInfo = async (id) => {
    const query = {
        _id: id
    }
    const dataRes = await dbService.getRecordByQuery(query, 'client');
    return dataRes[0];
}
module.exports = {
    create: create,
    countClients: countClients,
    allClients: allClients,
    paginate: paginate,
    deleteClients: deleteClients,
    updateClients: updateClients,
    invitation: invitation
}