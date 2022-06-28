const express = require('express');
const router = express.Router();
const taskController = require('../controller/task.controller');

router.post('/', (req, res) => {

    taskController.create(req, res);

});

router.get('/', (req, res) => {
    taskController.getTask(req, res);
});


router.put('/', (req, res) => {
    taskController.updateTask(req, res);
})

module.exports = router; 