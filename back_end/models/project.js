const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project