const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');
const checkUserLog = async (req)=>{
    const tokenData = await tokenService.verify(req);
    if(tokenData.isVerified){
        const query = {
            token: req.cookies.authToken,
            isLogged: true,
        }
        const userData = await dbService.getRecordByQuery(query,'user');
        if(userData.length > 0){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }

    
}

module.exports = {
    checkUserLog: checkUserLog,
}