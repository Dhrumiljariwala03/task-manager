const User = require("../models/user")
const bcrypt = require('bcrypt')
const fs = require('fs')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

const mailTamp = fs.readFileSync('index.html', 'utf-8')
const mailTampVerifyOtp = fs.readFileSync('emailTemp.html', 'utf-8')

const loginUser = async (req, res) => {
  try {
    const { user, password } = req.body;
    const checkUser = await User.findOne({ $or: [{ username: user }, { email: user }] });
    if (!checkUser) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(400).json({ status: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      {
        _id: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role,
        image: checkUser.image
      },
      process.env.JWT_SECURE_KEY, { expiresIn: '1d' }
    );

    const userData = await User.findOneAndUpdate({ _id: checkUser._id }, { $set: { isVerify: true } }, { new: true });
    return res.status(200).cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, secure: true, httpOnly: true }).json({ status: true, data: userData, token, message: 'User login successfully!' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { _id, otp } = req.query
    const user = await User.findOne({ _id, otp: otp, otpExprAt: { $gt: Date.now() } })
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found!' })
    }
    await user.updateOne({ isVerify: true, otp: null, otpExprAt: Date.now() })
    return res.status(200).json({ status: true, message: 'User verified successfully!' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body

    const findUser = await User.findOne({ email })
    if (!email) {
      return res.status(404).json({ status: false, message: 'Email not found' })
    }
    const otp = Math.round(100000 + Math.random() * 900000)
    const tokenExprAt = Date.now() + 24 * 60 * 60 * 1000
    const token = crypto.randomBytes(15).toString('hex')

    var mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: 'dhrumiljariwala5546@gmail.com',
      subject: 'Sending Email using Node.js',
      html: mailTampVerifyOtp.replace('[OTP]', otp).replace("[Recipient's Name]", findUser.username).replace(' [Validity Period]', '10').replace('{{LINK}}', `http://localhost:5173/verify_otp/:${findUser._id}/:${token}`)
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    await findUser.updateOne({ $set: { otp, token, tokenExprAt } })
    return res.status(200).json({ status: true, token, message: 'Email verified successfully!' })
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message })
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { token } = req.query;
    const user = await User.findOne({ otp, tokenExprAt: { $gt: Date.now() } });

    if (!user) {
      return res.status(404).json({ status: false, message: 'Invalid OTP or OTP expired!' });
    }

    await user.updateOne({ $set: { otp: null, token: '', tokenExprAt: Date.now() } });
    return res.status(200).json({ status: true, user, message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const { _id } = req.params;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ status: false, message: 'Passwords not match' });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const securePassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);
    user.password = securePassword;
    await user.save();

    return res.status(200).json({ status: true, message: 'Password reset successfully!' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};



const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const { _id } = req.params;

    const findUser = await User.findOne({ _id });
    if (!findUser) {
      return res.status(404).json({ status: false, message: 'User not found!' });
    }

    const comparePassword = await bcrypt.compare(currentPassword, findUser.password);
    if (!comparePassword) {
      return res.status(400).json({ status: false, message: 'Password is incorrect' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ status: false, message: 'New password and confirm new password not match' });
    }

    const securePassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);
    await User.findByIdAndUpdate(_id, { $set: { password: securePassword } });

    return res.status(200).json({ status: true, message: 'Password changed successfully!' });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};


const newUserPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body
    const { token } = req.query

    const userFind = await User.findOne({ token })

    if (!userFind) {
      return res.status(404).json({ status: false, message: 'User not found' })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ status: false, message: 'Password not matched' })
    }

    const securePassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS)

    await userFind.updateOne({ $set: { password: securePassword, token: '' } })
    return res.status(200).json({ status: true, message: 'Password Created successfully!' })
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message })
  }
}

module.exports = {
  loginUser,
  verifyUser,
  verifyEmail,
  verifyOtp,
  resetPassword,
  changePassword,
  newUserPassword
}