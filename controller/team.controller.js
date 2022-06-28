const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');

const getAllTask = async (req, res) => {
    const token = tokenService.verify(req);
    if (token.isVerified) {

        const companyRes = await dbService.getAllData('task');
        if (companyRes.length > 0) {
            res.status(200);
            res.json({
                isCompanyExist: true,
                message: "task available",
                data: companyRes
            });
        } else {
            res.status(404);
            res.json({
                isCompanyExist: false,
                message: "task not exists",
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

module.exports = { getAllTask: getAllTask };