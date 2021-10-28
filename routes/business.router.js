const router = require('express').Router();
router.get('/', (req, res) => {
    res.render("business");
});

module.exports = router;