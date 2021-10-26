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
mongo.connect(url, options);

const schemaList = {
    company: companySchema,
    user: userSchema,
    client: clientSchema
}

const createRecord = async (data, schema) => {
    const currentSchema = schemaList[schema];
    const collection = new currentSchema(data);
    const dataRes = await collection.save();
    return dataRes;
}

const getRecordByQuery = async (query, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.find(query);
    return dataRes;
}

const updateByQuery = async (query, schema, data) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.update(query, data);
    return dataRes;
}

const countData = async (schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.countDocuments();
    return dataRes;
}

const paginate = async (query, from, to, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.find(query).skip(from).limit(to);
    return dataRes;
}

const deleteClients = async (id, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.findByIdAndDelete(id);
    return dataRes;
}

const updateClients = async (id, data, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.findByIdAndUpdate(id, data, { new: true });
    return dataRes;
}

module.exports = {
    createRecord: createRecord,
    getRecordByQuery: getRecordByQuery,
    updateByQuery: updateByQuery,
    countData: countData,
    paginate: paginate,
    deleteClients: deleteClients,
    updateClients: updateClients
}