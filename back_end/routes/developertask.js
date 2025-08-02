const express = require('express');
const router = express.Router();
const { gettasks, gettask, createtask, updatetask, deletetask } = require('../controllers/developertask');

router.get('/gettasks', gettasks);
router.get('/gettask/:id', gettask);
router.post('/createtask', createtask);
router.put('/updatetask/:id', updatetask);
router.delete('/deletetask/:id', deletetask);


module.exports = router;