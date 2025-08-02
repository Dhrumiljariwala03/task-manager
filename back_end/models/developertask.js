const mongoose = require('mongoose');

const developertaskSchema = new mongoose.Schema({
    task: {
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
    }
}, { timestamps: true, versionKey: false })

const developertask = mongoose.model('developertask', developertaskSchema);

module.exports = developertask;