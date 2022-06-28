const tokenService = require('../services/token.service');
const accessRoles = {
    admin: [
        "/clients"
    ],
    client: [
        "/business"
    ],
    team: []
};

const permission = async (request, response, next) => {
    const tokenData = await tokenService.verify(request);
    const role = tokenData.data.role;
    const accessUrl = request.originalUrl;
    if (accessRoles[role].indexOf(accessUrl) != -1) {
        next();
    }
    else {
        response.redirect("/page-not-found");
    }
}

module.exports = permission;
