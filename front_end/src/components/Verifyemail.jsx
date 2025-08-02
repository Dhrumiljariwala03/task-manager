import React, { useState } from "react";
import { Avatar, Button, Grid, Link, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { motion } from "framer-motion";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import AppleIcon from "@mui/icons-material/Apple";
import { message } from "antd";
import "antd/dist/reset.css";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { verifyEmail } from "../redux/slices/authSlice";
import bgImage from '../assets/images/testimonial2.png';

const VerifyEmail = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [values, setValues] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const paperStyle = { padding: 20, height: "auto", width: "100%", maxWidth: 450, alignSelf: 'center', margin: "0 50px" };
  const avatarStyle = { backgroundColor: "#2a9ac2", padding: "10px" };
  const success = () => {
    messageApi.open({
      type: "success",
      content: "OTP sent successfully",
    });
  };

  const handleEmail = (e) => {
    e.preventDefault();
    dispatch(verifyEmail(values))
      .unwrap()
      .then(() => {
        success();
        setOpenModal(true);
      })
      .catch((error) => {
        const errorMessage = error.response && error.response.status === 404
          ? 'Email not found'
          : error.message || 'Verification failed. Please try again.';
        setErrorMessage(errorMessage);
        messageApi.open({
          type: "error",
          content: errorMessage,
        });
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const gridContainerStyle = { height: '100vh', display: 'flex', flexWrap: 'wrap' };

  const leftSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', '@media (max-width: 768px)': { display: 'none' } };

  const rightSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "20px 0", width: '100%' };

  return (
    <Grid container style={gridContainerStyle}>
      {contextHolder}
      <Grid item style={leftSectionStyle}>
        <motion.div style={{ width: '80%', height: '80%', background: `url(${bgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', }} animate={{ y: [0, -10, 0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      </Grid>
      <Grid item style={rightSectionStyle}>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <MarkEmailReadIcon style={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h4" style={{ margin: "20px 0" }}>Verify Email</Typography>
          </Grid>
          <form onSubmit={handleEmail}>
            <TextField id="outlined-email-input" label="Email" type="email" autoComplete="current-password" fullWidth style={{ margin: "15px 0px" }} onChange={(e) => setValues({ ...values, email: e.target.value })} required />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ margin: "15px 0px" }}>Send OTP</Button>
          </form>
          <Typography style={{ textAlign: "end" }}>
            <Link href="#">Forgot Email</Link>
          </Typography>
          <Typography variant="subtitle1" align="center" style={{ margin: "20px 0" }}>sign</Typography>
          <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Avatar style={{ backgroundColor: " #4285F4", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
                <GoogleIcon />
              </Avatar>
            </Grid>
            <Grid item>
              <Avatar style={{ backgroundColor: "black", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
                <GitHubIcon />
              </Avatar>
            </Grid>
            <Grid item>
              <Avatar style={{ backgroundColor: "black", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
                <AppleIcon />
              </Avatar>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>OTP Sent</DialogTitle>
        <DialogContent>
          <DialogContentText>
            OTP sent successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default VerifyEmail;
