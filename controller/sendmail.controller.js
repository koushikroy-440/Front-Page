const pug = require("pug");
const AWS = require("aws-sdk");
const config = {
    accessKeyId: "AKIA2QE56KF5HU6JVWXU",
    secretAccessKey: "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",
    region: "ap-south-1"
}
const mailer = new AWS.SES(config);

const tokenService = require("../services/token.service");
const sendEmail = async (req, res) => {
    const token = await tokenService.verify(req);
    if (token.isVerified) {
        var data = JSON.parse(req.body.receipt);
        const emailInfo = {
            Destination: {
                ToAddresses: [
                    data.to
                ]
            },
            Message: {
                Subject: {
                    Charset: "UTF-8",
                    Data: data.subject
                },
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: pug.renderFile("C:/Users/DELL/OneDrive/Desktop/node/frontPage/views/email-template.pug", data)
                    }
                }
            },
            Source: "koushikand440@gmail.com",
        }
        try {
            await mailer.sendEmail(emailInfo).promise();
            res.status(200);
            res.json({
                message: "Sending success"
            });
        }
        catch (error) {
            res.status(424);
            res.json({
                message: "Sending failed"
            });
        }

    } else {
        res.status(401);
        res.json({
            message: "permission denied !",
        });
    }
}

module.exports = {
    sendEmail: sendEmail,
}

