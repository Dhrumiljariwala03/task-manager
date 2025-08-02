const User = require("../models/user")
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const fs = require('fs')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

const passWordMail = fs.readFileSync('setapassword.html', 'utf-8')

const createUser = async (req, res) => {
  try {
    const { username, email, gender, role } = req.body
    const exstUser = await User.findOne({ $or: [{ username }, { email }] })
    if (exstUser) {
      return res.status(400).json({ status: false, message: 'User already exists' })
    }
    const token = crypto.randomBytes(15).toString('hex')
    const tokenExprAt = Date.now() + 24 * 60 * 60 * 1000
    console.log(req.file);
    await User.create({
      username,
      email,
      gender,
      role,
      profilePicture: req.file.filename,
      token,
      tokenExprAt
    })

    var mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: 'dhrumiljariwala5546@gmail.com',
      subject: 'Sending Email using Node.js',
      html: passWordMail.replace('{{LINK}}', `http://localhost:5173/setpassword/?token=${token}`)
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.status(200).json({ status: true, message: 'Create User successfully' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}
const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find().populate('role')
    const formateData = allUser.map((getAllData) => {
      return {
        username: getAllData.username,
        email: getAllData.email,
        gender: getAllData.gender,
        role: getAllData.role.role,
        isActive: getAllData.isVerify,
        _id: getAllData._id
      }
    })
    return res.status(200).json({ status: true, data: formateData, message: 'Get alluser successfully!' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const { _id } = req.params
    const getUser = await User.findById({ _id }).populate('role')
    if (!getUser) {
      return res.status(404).json({ status: false, message: 'User not found!' })
    }

    const userData = {
      _id: getUser._id,
      username: getUser.username,
      email: getUser.email,
      gender: getUser.gender,
      image: getUser.image,
      role: getUser.role.role,
    };

    return res.status(200).json({ status: true, data: userData, message: 'Get user successfully!' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.query;
    const getUser = await User.findByIdAndDelete(_id);
    if (!getUser) {
      return res.status(404).json({ status: false, message: 'User not found!' });
    }
    return res.status(200).json({ status: true, message: 'Delete user successfully!' });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id } = req.query;
    await User.findByIdAndUpdate({ _id }, { $set: req.body })
    return res.status(200).json({ status: true, message: 'Update user successfully!' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  deleteUser,
  updateUser
}