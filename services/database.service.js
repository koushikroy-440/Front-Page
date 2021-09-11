const mongo = require('mongoose');
const companySchema = require("../modal/company.modal");
const userSchema = require("../modal/user.modal");
const url = "mongodb://localhost:27017/test";
const options = {
    // useNewUrlParse: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
};
const schemaList = {
    company: companySchema,
    user: userSchema
}
mongo.connect(url, options);

const createRecord = async (data,schema) => {
    const currentSchema = schemaList[schema];
    const collection = new currentSchema(data);
    const dataRes = await collection.save();
    return dataRes;
}

const getRecordByQuery = async (query,schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.find(query);
    return dataRes;
}

module.exports = {
    createRecord: createRecord,
    getRecordByQuery: getRecordByQuery
}