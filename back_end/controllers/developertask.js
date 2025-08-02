const Developertask = require("../models/developertask");

const gettasks = async (req, res) => {
    try {
        const developertasks = await Developertask.find();
        return res.status(200).json({ status: true, data: developertasks, message: 'Get Developertask Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const gettask = async (req, res) => {
    try {
        const gettask = await Developertask.findOne({ _id: req.params.id });
        return res.status(200).json({ status: true, data: gettask, message: 'Get Developertask Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const createtask = async (req, res) => {
    try {
        const createtask = await Developertask.create(req.body);
        return res.status(200).json({ status: true, data: createtask, message: 'Create Developertask Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const updatetask = async (req, res) => {
    try {
        const gettask = await Developertask.updateOne({ _id: req.params.id }, { $set: req.body });
        return res.status(200).json({ status: true, data: req.body, message: 'Update Developertask Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const deletetask = async (req, res) => {
    try {
        const deltask = await Developertask.deleteOne({ _id: req.params.id });
        return res.status(200).json({ status: true, data: deltask, message: 'Delete Developertask Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

module.exports = {
    gettasks,
    createtask,
    gettask,
    updatetask,
    deletetask
}
