const express = require('express')
const routes = express.Router();

const user = require('./user');
const role = require('./role');
const auth = require('./auth');
const menu = require('./menu');
const team = require('./team');
const project = require('./project');
const admintask = require('./admintask');
const developertask = require('./developertask');

routes.use('/user', user);
routes.use('/role', role);
routes.use('/auth', auth);
routes.use('/menu', menu);
routes.use('/team', team);
routes.use('/project', project);
routes.use('/admintask', admintask);
routes.use('/developertask', developertask);

module.exports = routes