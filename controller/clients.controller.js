const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');
const create = async (req, res)=>{
    const tokenData = await tokenService.verify(req);
    if(tokenData.isVerified){
        const data = req.body;
        data['companyId'] = tokenData.data.uid;
        try{
            const dataRes = await dbService.createRecord(data,'client');
            res.status(200);
            res.json({
                message: "data created",
                data: dataRes
            })
        }catch(err){
            res.status(409);
            res.json({
                message: "data not created",
                error: err
            });
        }
    }else{
        res.status(401);
        res.json({
            message: 'permission denied !'
        });
    }
}

module.exports = {
    create: create,
}