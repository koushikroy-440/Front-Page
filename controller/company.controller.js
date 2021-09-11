const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');

const createCompany = async (req,res) => {
   const token = tokenService.verify(req);
   if(token.isVerified)
   {
        const data = token.data;
        // now you can store data
        try{
        const dataRes = await dbService.createRecord(data,'company');
        res.status(200);
            res.json({
                isCompanyCreated: true,
                message: "company created !",
                data: dataRes
            }); 
        }catch(err){
            res.status(409);
            res.json({
                isCompanyCreated: false,
                message: err
            });
        } 
   }
   else{
       res.status(401);
       res.json({message:"permission denied"});
   }
}

const getCompanyId = async (req, res) => {
    const token = tokenService.verify(req);
    if(token.isVerified)
    {
        const query = {
            email: token.data.email,
        }
        const companyRes = await dbService.getRecordByQuery(query,'company');
        if(companyRes.length > 0)
        {
            res.status(200);
            res.json({
                isCompanyExist: true,
                message: "company available",
                data: companyRes
            });
        }else{
            res.status(404);
            res.json({
                isCompanyExist: false,
                message: "company not exists",
            });
        }
    }
    else{
        res.status(401);
        res.json({
            message: "Permission denied",
        });
    }
   
}

module.exports = {
     createCompany:  createCompany,
     getCompanyId: getCompanyId
    };