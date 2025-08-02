const Admintask = require("../models/admintask");

const gettasks = async (req, res) => {
    try {
        const admintasks = await Admintask.find();
        return res.status(200).json({ status: true, data: admintasks, message: 'Get Admintasks Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const gettask = async (req, res) => {
    try {
        const gettask = await Admintask.findOne({ _id: req.params.id });
        return res.status(200).json({ status: true, data: gettask, message: 'Get Admintask Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const createtask = async (req, res) => {
    try {
        const createtask = await Admintask.create(req.body);
        return res.status(200).json({ status: true, data: createtask, message: 'Create Admintask Successfully!' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const updatetask = async (req, res) => {
    try {
        const gettask = await Admintask.updateOne({ _id: req.params.id }, { $set: req.body });
        return res.status(200).json({ status: true, data: req.body, message: 'Update Admintask Successfully' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const deletetask = async (req, res) => {
    try {
        const deltask = await Admintask.deleteOne({ _id: req.params.id });
        return res.status(200).json({ status: true, data: deltask, message: 'delete Admintask Successfully' });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

module.exports = {
    gettasks,
    gettask,
    createtask,
    updatetask,
    deletetask
}