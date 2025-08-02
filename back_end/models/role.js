const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        trim: true,
        default: 'Devs'
    },
    menuName: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }
    ]
}, { timestamps: true })

const Role = mongoose.model('Role', roleSchema)

module.exports = Role