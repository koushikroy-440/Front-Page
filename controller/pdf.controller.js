const Pdf = require("pdfkit-table");
const fs = require("fs");
const crypto = require("crypto");
const random = crypto.randomBytes(4).toString('hex');

const pdf = (req, res) => {
    let pdfFile = "public/exports/" + random + ".pdf";

    const doc = new Pdf({
        margin: 30,
        page: 'A4'
    });

    doc.pipe(fs.createWriteStream(pdfFile));

    doc.text("Testing");

    doc.end();

    response.status(200);
    response.json({
        message: "Success",
        fileName: random + ".pdf"
    });
}

const deletePdf = (req, res) => {
    const fileName = "public/exports/" + req.params.fileName;
    fs.unlinkSync(fileName);
    res.status(200);
    res.send({
        message: "delete success",
    });
}

module.exports = {
    pdf: pdf,
    deletePdf: deletePdf
}
