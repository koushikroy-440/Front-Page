const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('notFound');
});

module.exports = router;