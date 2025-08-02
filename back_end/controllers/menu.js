const Menu = require('../models/menu')

const createMenu = async (req, res) => {
    try {
        const { menuName } = req.body
        const exstMenu = await Menu.findOne({ menuName })
        if (exstMenu) {
            return res.status(400).json({ status: false, message: 'Menu already exists' })
        }
        await Menu.create({ menu: menuName })
        return res.status(200).json({ status: true, message: 'Create Menu successfully!' })
    } catch (error) {
        return res.status(400).json({ status: false, message: error.meesage })
    }
}

const getAllMenus = async (req, res) => {
    try {
        const getMenus = await Menu.find()
        return res.status(200).json({ status: true, data: getMenus, message: 'get Menus successfully!' })
    } catch (error) {
        return res.status(400).json({ status: false, message: error.meesage })
    }
}

module.exports = {
    createMenu,
    getAllMenus
}