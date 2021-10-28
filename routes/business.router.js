const router = require('express').Router();
const routePermission = require('../middleware/route-permission.middleware');

router.get('/', routePermission, (req, res) => {
    res.render("business");
});

module.exports = router;