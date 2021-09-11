const mongo = require('mongoose');
const { Schema } = mongo;
const companySchema = new Schema({
    company_name: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    mobile: Number,
    emailVerified:{
        type: Boolean,
        default: false,
    },
    mobileVerified:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

//unique key validation for company name
companySchema.pre('save',async function(next){
    const query = {
        company_name: this.company_name
    }
    const length = await mongo.model("Company").countDocuments(query);
    if(length > 0){
        const companyErr = {
            label: "Company name already exists",
            field: "company_name",
        }
        throw next(companyErr);
    }else{
        next();
    }
});

//unique key validation for email
companySchema.pre('save',async function(next){
    const query = {
        company_name: this.email
    }
    const length = await mongo.model("Company").countDocuments(query);
    if(length > 0){
        const emailErr = {
            label: "Company email already exists",
            filed: "email",
        }
        throw next(emailErr);
    }else{
        next();
    }
});
module.exports = mongo.model('Company',companySchema);