const mongo = require('mongoose');
const companySchema = require("../modal/company.modal");
const userSchema = require("../modal/user.modal");
const clientSchema = require("../modal/clients.modal");

// const url = "mongodb://localhost:27017/test";
const url = "mongodb+srv://frontPage:LUdWbzHRTdnrZECU@cluster0.ywh68.mongodb.net/frontPage?retryWrites=true&w=majority";
const options = {
    // useNewUrlParse: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
};
const schemaList = {
    company: companySchema,
    user: userSchema,
    client: clientSchema
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

const updateByQuery = async (query,schema,data) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.update(query,data);
    return dataRes;
}

module.exports = {
    createRecord: createRecord,
    getRecordByQuery: getRecordByQuery,
    updateByQuery: updateByQuery
}