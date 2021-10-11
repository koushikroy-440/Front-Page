const tokenService = require('../services/token.service');
const getToken = async (req, res) => {
    const expiresIn = req.params.expires;
    const data = JSON.parse(req.body.data);
    const endpoint = req.get('origin') || "http://" + req.get('host');
    const option = {
        body: data,
        endpoint: endpoint,
        originalUrl: req.originalUrl,
        iss: endpoint + "/get-token",
    }

    const newToken = await tokenService.createCustomToken(option, expiresIn);
    res.status(200);
    res.json({
        token: newToken,
    });
}
module.exports = {
    getToken: getToken,
}