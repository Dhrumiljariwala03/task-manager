const Team = require("../models/team");

const getAllteam = async (req, res) => {
    try {
        const alldata = await Team.find().populate('TeamLeader').populate('Devs');
        const formatedData = alldata.map((getAlldata) => {
            return {
                _id: getAlldata._id,
                teamName: getAlldata.teamName,
                TeamLeader: getAlldata.TeamLeader.username,
                Devs: getAlldata.Devs.map(dev => dev.username),
            };
        });
        return res.status(200).json({ status: true, data: formatedData, message: 'Get data successfully!' });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};


const getDataById = async (req, res) => {
    try {
        const { _id } = req.query
        if (!_id) {
            return res.status(404).json({ status: false, message: 'Team not found!' })
        }
        const teamData = await Team.findById(_id).populate('TeamLeader').populate('Devs')
        const formateData = {
            teamName: teamData.teamName,
            _id: teamData._id,
            TeamLeader: teamData.TeamLeader.username,
            Devs: teamData.Devs.map(dev => dev.username),
        }
        return res.status(200).json({ status: true, data: formateData, message: 'Get data successfully!' })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const createTeam = async (req, res) => {
    try {
        const { teamName, TeamLeader, Devs } = req.body;

        if (!teamName || !TeamLeader || !Devs) {
            return res.status(400).json({ status: false, message: 'required fields' });
        }

        const team = await Team.create({ teamName, TeamLeader, Devs });
        return res.status(200).json({ status: true, data: team, message: 'Create Team successfully!' });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const { _id } = req.query
        const findTeam = await Team.findOne({ _id })
        if (!findTeam) {
            return res.status(404).json({ status: false, message: 'Team not found!' })
        }
        await Team.findOneAndDelete({ _id })
        return res.status(200).json({ status: true, message: 'Delete team successfully!' })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const updateTeam = async (req, res) => {
    try {
        const { _id } = req.query
        const findTeam = await Team.findOne({ _id })
        if (!findTeam) {
            return res.status(404).json({ status: false, message: 'Team not found!' })
        }
        await Team.findOneAndUpdate({ _id }, req.body)
        return res.status(200).json({ status: true, message: 'Update team successfully' })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {
    getAllteam,
    getDataById,
    createTeam,
    deleteTeam,
    updateTeam
}