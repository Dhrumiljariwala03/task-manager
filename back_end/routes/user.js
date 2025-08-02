const express = require('express')
const { createUser, getAllUser, getUserById, deleteUser, updateUser } = require('../controllers/user')
const route = express.Router()
const multer = require('multer')
const path = require('path')
const authorization = require('../middlewares/authorization')
const User = require('../models/user')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/userimage')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage })

route.post('/create_user', upload.single('image'), createUser)
route.get('/getalluser', getAllUser)
route.get('/getuserbyid/:_id', getUserById)
route.delete('/delete_user', deleteUser)
route.patch('/update_user', updateUser)

module.exports = route