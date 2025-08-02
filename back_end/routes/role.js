const express = require('express')
const { createRole, getRoles, getRoleById, deleteRole } = require('../controllers/role')
const route = express.Router()

route.post('/create_role', createRole)
route.get('/get_roles', getRoles)
route.get('/get_roles_byId', getRoleById)
route.delete('/delete_role', deleteRole)

module.exports = route