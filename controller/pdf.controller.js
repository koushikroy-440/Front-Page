const Pdf = require("pdfkit-table");
const fs = require("fs");

const pdf = (req, res) => {
    const doc = new Pdf({
        margin: 30,
        page: 'A4'
    });

    doc.pipe(fs.createWriteStream("public/exports/new.pdf"));

    doc.text("Testing");

    doc.end();

    response.status(200);
    response.json({
        message: "Success"
    });
}

const deletePdf = (request, response) => {
    response.status(200);
    response.json({ message: "dddd" });
}

module.exports = {
    pdf: pdf,
    deletePdf: deletePdf
}
