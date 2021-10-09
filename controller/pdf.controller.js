const Pdf = require("pdfkit-table");
const fs = require("fs");
const crypto = require("crypto");
let random = crypto.randomBytes(4).toString('hex');
const tokenService = require("../services/token.service");

const pdf = async (req, res) => {
    let pdfFile = "public/exports/" + random + ".pdf";
    let commingData = req.body;
    let pdfData = JSON.parse(commingData.data);
    const tokenData = await tokenService.verify(req);
    const company = tokenData.data.companyInfo;

    const doc = new Pdf({
        margin: 30,
        page: 'A4'
    });

    doc.pipe(fs.createWriteStream(pdfFile));

    doc.fontSize(18);

    doc.text(company.company_name, {
        align: "center"
    });

    doc.moveDown();

    const table = {
        title: "Clients Report",
        headers: [
            {
                label: "Client name",
                property: "clientName",
                width: 100
            },
            {
                label: "Country",
                property: "country",
                width: 100
            },
            {
                label: "Email",
                property: "email",
                width: 150
            },
            {
                label: "Mobile",
                property: "mobile",
                width: 100
            },
            {
                label: "Joined at",
                property: "joinedAt",
                width: 100
            }
        ],
        datas: []
    }

    for (let data of pdfData) {
        table.datas.push({
            clientName: data.clientName,
            country: data.clientCountry,
            email: data.clientEmail,
            mobile: data.clientMobile,
            joinedAt: data.createdAt
        });
    }

    doc.table(table, { width: 300 });

    doc.end();

    res.status(200);
    res.json({
        message: "Success",
        filename: random + ".pdf"
    });
}

const deletePdf = (req, res) => {
    let filename = "public/exports/" + req.params.filename;
    fs.unlinkSync(filename);
    res.status(200);
    res.json({
        message: "success"
    })
}

module.exports = {
    pdf: pdf,
    deletePdf: deletePdf
}
