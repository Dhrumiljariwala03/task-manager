import React, { useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Modal, Result } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changePassword } from "../redux/slices/authSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import bgImage from '../assets/images/video.png';

const ChangePassword = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const paperStyle = { padding: 20, height: "auto", width: "100%", maxWidth: 450, alignSelf: 'center', margin: "0 50px" };
  const avatarStyle = { backgroundColor: "#2a9ac2" };
  const gridContainerStyle = { height: '100vh', display: 'flex', flexWrap: 'wrap' };
  const leftSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', '@media (max-width: 768px)': { display: 'none' } };
  const rightSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "20px 0", width: '100%' };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/dashboard");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const token = Cookies.get("token");
    let userId;
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken._id;
    }

    setLoading(true);
    try {
      await dispatch(
        changePassword({ userId, currentPassword, newPassword, confirmNewPassword })
      ).unwrap();
      setLoading(false);
      showModal();
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.message || "Password reset failed. Please try again."
      );
    }
  };

  return (
    <Grid container style={gridContainerStyle}>
      <Grid item style={leftSectionStyle}>
        <motion.div style={{ width: '80%', height: '80%', background: `url(${bgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', }} animate={{ y: [0, -10, 0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      </Grid>
      <Grid item style={rightSectionStyle}>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOpenIcon />
            </Avatar>
            <Typography variant="h5" style={{ margin: "10px 0px" }}> Change Password</Typography>
          </Grid>
          <form onSubmit={handleChangePassword}>
            <TextField label="Enter Current Password" type="password" fullWidth style={{ margin: "15px 0px" }} required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <TextField label="Enter New Password" type="password" fullWidth style={{ margin: "15px 0px" }} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <TextField label="Confirm New Password" type="password" fullWidth style={{ margin: "15px 0px" }} required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            {errorMessage && (
              <Typography
                color="error"
                variant="body2"
                style={{ margin: "20px 0" }}
              >
                {errorMessage}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ margin: "15px 0px" }} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Change Password'}</Button>
          </form>
          <Modal title="Success" open={isModalOpen} footer={null} onCancel={handleClose}>
            <Result status="success" title="Password changed successfully" />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <NavLink to="/">
                <Button type="primary" style={{ backgroundColor: "#1976D2", color: "white" }}> OK </Button>
              </NavLink>
            </div>
          </Modal>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
