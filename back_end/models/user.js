const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    image: {
        type: String,
        default: ''
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    otp: {
        type: Number,
        default: null
    },
    otpExprAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: ''
    },
    tokenExprAt: {
        type: Date,
        default: Date.now
    },
    isVerify: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User