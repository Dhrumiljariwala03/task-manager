const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    menu: {
        type: String,
        required: true,
        default: ''
    }
}, { timestamps: true })

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu 