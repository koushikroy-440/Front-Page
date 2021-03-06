require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const issService = require("./iss.service");


const create = async (req, expiresIn) => {
    const formData = req.body;
    const endpoint = req.get('origin');
    const api = req.originalUrl;
    const iss = endpoint + api;
    const token = await jwt.sign({
        iss: iss,
        data: formData
    }, secretKey, { expiresIn: expiresIn });
    return token;
}

const createCustomToken = async (data, expiresIn) => {
    const formData = data.body;
    const endpoint = data.endpoint;
    const api = data.originalUrl;
    const iss = data.iss;
    const token = await jwt.sign({
        iss: iss,
        data: formData
    }, secretKey, { expiresIn: expiresIn });
    return token;

}

const verify = (req) => {
    let token = "";
    if (req.method == "GET") {
        if (req.headers['x-auth-token']) {
            token = req.headers['x-auth-token'];
        }
        else {
            if (req.originalUrl.indexOf("/clients/invitation") != -1) {
                let temp = req.originalUrl.split("/");
                token = temp[3];
            } else {
                token = req.cookies.authToken;
            }
        }
    }
    else {
        token = req.body.token;
    }
    if (token) {
        try {
            const tmp = jwt.verify(token, secretKey);
            //    console.log(tmp);
            const requestComingForm = tmp.iss;
            if (issService.indexOf(requestComingForm) != -1) {
                return {
                    isVerified: true,
                    data: tmp.data
                };
            }

        } catch (error) {
            return {
                isVerified: false,
            }
        }
    }
    else {
        return {
            isVerified: false,
        }
    }

}

const customTokenVerification = (token) => {
    try {
        const tmp = jwt.verify(token, secretKey);
        const requestComingForm = tmp.iss;
        if (issService.indexOf(requestComingForm) != -1) {
            return {
                isVerified: true,
                data: tmp.data
            };
        }

    } catch (error) {
        return {
            isVerified: false,
        }
    }

}
module.exports = {
    create: create,
    verify: verify,
    createCustomToken: createCustomToken,
    customTokenVerification: customTokenVerification
}