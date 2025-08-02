const mongoose = require('mongoose');

const admintaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    priority: {
        type: String,
        required: true,
        enum: ["High", "Medium", "Low"]
    },
    status: {
        type: String,
        required: true,
        enum: ["Inprogres", "Completed", "Hold", "Cancelled"],
        default: "Inprogres"
    },
    teamname: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        }
    ],
    project: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        }
    ],
}, { timestamps: true, versionKey: false })

const Admintask = mongoose.model('Admintask', admintaskSchema);

module.exports = Admintask;