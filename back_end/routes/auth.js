const express = require('express')
const { loginUser, verifyUser, verifyEmail, verifyOtp, resetPassword, changePassword, newUserPassword } = require('../controllers/auth')
const route = express.Router()

route.post('/login_user', loginUser)
route.post('/verify_user', verifyUser)
route.post('/verify_email', verifyEmail)
route.post('/verify_otp/:_id/:token', verifyOtp)
route.post('/reset_password/:_id', resetPassword)
route.post('/changepassword/:_id', changePassword)
route.post('/newuser_password', newUserPassword)

module.exports = route