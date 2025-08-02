const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        trim: true
    },
    TeamLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Devs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema)

module.exports = Team;