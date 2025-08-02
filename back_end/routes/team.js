const express = require('express')
const { getAllteam, getDataById, createTeam, deleteTeam, updateTeam } = require('../controllers/team')
const route = express.Router()

route.get('/getallteams', getAllteam)
route.get('/get_teamdata_byid', getDataById)
route.post('/create_team', createTeam)
route.put('/update_team', updateTeam)
route.delete('/delete_team', deleteTeam)

module.exports = route