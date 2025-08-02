const express = require('express')
const authorization = require('../middlewares/authorization')
const { createMenu, getAllMenus } = require('../controllers/menu')
const route = express.Router()

route.post('/create_menu', authorization(['Admin']), createMenu)
route.get('/getallmenus', authorization(['Admin']), getAllMenus)

module.exports = route