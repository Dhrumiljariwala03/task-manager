const Project = require("../models/project");

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        return res.status(200).json({ status: true, data: projects, message: "get Projects Successfully!" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const getProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id });
        if (!project) {
            return res.status(404).json({ status: true, message: "Project Not Found!" });
        }
        return res.status(200).json({ status: true, data: project, message: "Get Project Successfully!" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const createProject = async (req, res) => {
    try {
        const { projectName } = req.body;
        const project = await Project.create({ projectName });
        return res.status(200).json({ status: true, data: project, message: "Create Project Successfully!" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const updateProject = async (req, res) => {
    try {
        const { projectName } = req.body;
        const project = await Project.findOneAndUpdate({ _id: req.params.id }, { $set: { projectName } }, { new: true });
        return res.status(200).json({ status: true, data: project, message: "Update Project Successfully!" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id });
        if (!project) {
            return res.status(404).json({ status: true, message: "Project Not Found!" });
        }
        return res.status(200).json({ status: true, message: "Update Project Successfully!" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
}