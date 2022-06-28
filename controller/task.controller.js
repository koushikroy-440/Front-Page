const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');
const create = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {
        const data = req.body;
        console.log(data);
        try {
            const dataRes = await dbService.createRecord(data, 'task');
            res.status(200);
            res.json({
                message: "task created",
                data: dataRes
            })
        } catch (err) {
            res.status(409);
            res.json({
                message: "task not created",
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

const getTask = async (req, res) => {
    const token = tokenService.verify(req);
    if (token.isVerified) {
        const query = {
            assignTo: token.data.uid,
        }

        const companyRes = await dbService.getRecordByQuery(query, 'task');
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

const updateTask = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    if (tokenData.isVerified) {

        const id = req.body.id;
        const data = {
            status: "completed"
        }
        const updateRes = await dbService.updateClients(id, data, 'task');
        const query = {
            assignTo: tokenData.data.uid,
        }

        const companyRes = await dbService.getRecordByQuery(query, 'task');
        res.status(201);
        res.json({
            data: companyRes
        });
    } else {
        res.status(401);
        res.json({
            message: 'permission denied !'
        });
    }
}
module.exports = {
    create: create,
    getTask: getTask,
    updateTask: updateTask
};