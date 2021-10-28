const tokenService = require('../services/token.service');

const accessList = {
    admin: {
        toolbar: [
            { label: "Notifications", icon: "fa fa-bell", link: "/notifications", design: "icon-btn-dark" },
            { label: "Clients", icon: "fas fa-user-secret", link: "/clients", design: "icon-btn-primary" },
            { label: "Teams", icon: "fas fa-users", link: "/teams", design: "icon-btn-warning" },
            { label: "Setting", icon: "fa fa-cog", link: "/setting", design: "icon-btn-info" },
            { label: "Logout", icon: "fa fa-sign-out-alt", link: "/logout", design: "icon-btn-danger" }
        ]

    },
    client: {
        toolbar: [
            { label: "Logout", icon: "fa fa-sign-out-alt", link: "/logout", design: "icon-btn-danger" }
        ]
    },
    team: {}
}
const getAccess = async (req, res) => {
    const tokenData = await tokenService.verify(req);
    const role = tokenData.data.role;
    res.status(200);
    res.json({
        message: 'Access granted',
        data: accessList[role]
    });
}

module.exports = {
    getAccess: getAccess,
}