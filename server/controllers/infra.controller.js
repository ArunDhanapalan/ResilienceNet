const Infra = require('../models/infra.model');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Infra.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const newProject = new Infra(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
