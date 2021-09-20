const tokenService = require("../services/token.service");
const databaseService = require("../services/database.service");

const create = async (req,res)=>{
    const token = tokenService.verify(req);
    if(token.isVerified)
    {
        try{
            const userRes = await databaseService.createRecord(token.data,'user');
            res.status(200);
            res.json({
                isUserCreated: true,
                message: 'user created !',
            });
        }catch(e){
            res.status(500);
            res.json({
                isUserCreated : false,
                message: 'Internal server error',
            })
        }
    }
    else{
        res.status(401);
        res.send({
            message: "permission denied !"
        });
    }
}

const getUserPassword = async (req, res) => {
    const token = await tokenService.verify(req);
    if(token.isVerified){
        const query = token.data;
        const dataRes = await databaseService.getRecordByQuery(query,'user');
        if(dataRes.length > 0){
            res.status(200);
            res.json({
                isCompanyExist: true,
                message: 'success',
                data: dataRes
            });
        }else{
            res.status(401);
            res.json({
                isCompanyExist: false,
                message: 'company not found',
            });
        }
    }else{
        res.status(401);
        res.json("message: permission denied !");
    }
}

const createLog = async (req, res) => {
    const token = await tokenService.verify(req);
    if(token.isVerified){
        console.log("Accepted");
    }else{
        res.status(401);
        res.json("message: permission denied !");
    }
}
module.exports = {
    createUser: create,
    getUserPassword: getUserPassword
}