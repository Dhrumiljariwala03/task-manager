const Role = require("../models/role")

const createRole = async (req, res) => {
    try {
        const { role } = req.body
        const exstingRole = await Role.findOne({ role })
        if (exstingRole) {
            return res.status(400).json({ status: false, message: 'Role already exist' })
        }
        await Role.create({ role })
        return res.status(200).json({ status: true, message: 'Create role successfully!' })
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }
}

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find()
        return res.status(200).json({ status: true, data: roles, message: 'get role successfully!' })
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }
}

const getRoleById = async (req, res) => {
    try {
        const { _id } = req.query
        if (!_id) {
            return res.status(404).json({ status: false, message: 'Role not found' })
        }
        const role = await Role.findOne({ _id: req.query._id }).populate('menuName')

        const allRole = {
            _id: role._id,
            role: role.role,
            menuName: role.menuName.menu
        }
        return res.status(200).json({ status: true, data: allRole, message: 'get role successfully!' })
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }
}

const deleteRole = async (req, res) => {
    try {
        const { _id } = req.query
        await Role.findOneAndDelete({ _id })
        return res.status(200).json({ status: true, message: 'Delete role successfully!' })
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }
}

module.exports = {
    createRole,
    getRoles,
    getRoleById,
    deleteRole
}
