const express = require('express');
const { gettasks, gettask, createtask, updatetask, deletetask } = require('../controllers/admintask');
const router = express.Router();

router.get('/getadmintasks', gettasks);
router.get('/getadmintask/:id', gettask);
router.post('/createadmintask', createtask);
router.put('/updateadmintask/:id', updatetask);
router.delete('/deleteadmintask/:id', deletetask);

module.exports = router;