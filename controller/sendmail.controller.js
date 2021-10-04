const nodemailer = require("nodemailer");
const pug = require("pug");
const tokenService = require("../services/token.service");
const sendEmail = async (req, res) => {
    const token = await tokenService.verify(req);
    if (token.isVerified) {
        const data = req.body;
        const transporter = nodemailer.createTransport({
            host: "gmail",
            auth: {
                user: 'koushikand440@gmail.com',
                pass: 'koushik@akash@123',
            },
        });

        const mailOptions = {
            from: 'koushikand440@gmail.com',
            to: data.to,
            subject: 'testing',
            html: 'koshik',
        }
        let info = await transporter.sendMail(mailOptions);
        res.json({
            message: info
        });

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

