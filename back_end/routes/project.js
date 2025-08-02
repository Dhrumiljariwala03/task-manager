const express = require('express');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/project');
const router = express.Router();

router.get("/Projects", getProjects);
router.get("/getProject/:id", getProject);
router.post("/CreateProject", createProject);
router.put("/updateProject/:id", updateProject);
router.delete("/deleteProject/:id", deleteProject);

module.exports = router;