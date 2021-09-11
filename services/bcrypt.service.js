const bcrypt = require('bcrypt');

const encrypt = async (data)=>{
   const encrypted = await bcrypt.hash(data,12);
   return encrypted;
}

module.exports = {
    encrypt: encrypt,
}