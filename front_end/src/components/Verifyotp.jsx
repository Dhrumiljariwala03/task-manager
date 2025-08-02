import React, { useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import WarningIcon from "@mui/icons-material/Warning";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { message, Input } from "antd";
import { motion } from "framer-motion";
import { verifyOtp } from "../redux/slices/authSlice";
import bgImage from '../assets/images/innovation.png';

const { OTP } = Input;

const Verifyotp = () => {
  const { _id, token } = useParams();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { error } = useSelector((state) => state.auth);

  const paperStyle = { padding: 30, height: "auto", width: "100%", maxWidth: 500, alignSelf: 'center', margin: "0 50px", borderRadius: 10 };
  const avatarStyle = { backgroundColor: "#2a9ac2" };

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const success = () => {
    messageApi.open({ type: "success", content: "OTP verified successfully" });
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOtp({ userId: _id, otp: parseInt(otp, 10), token })).unwrap();
      success();
      navigate(`/reset-password/${_id}`);
    } catch (error) {
      setErrorMessage(error.message || "OTP verification failed. Please try again.");
      messageApi.open({
        type: "error",
        content: error.message || "OTP verification failed. Please try again.",
      });
    }
  };

  const gridContainerStyle = { height: '100vh', display: 'flex', flexWrap: 'wrap' };
  const leftSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', '@media (max-width: 768px)': { display: 'none' } };
  const rightSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "20px 0", width: '100%' };

  return (
    <Grid container style={gridContainerStyle}>
      {contextHolder}
      <Grid item style={leftSectionStyle}>
        <motion.div style={{ width: '80%', height: '65%', background: `url(${bgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', }} animate={{ y: [0, -10, 0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      </Grid>
      <Grid item style={rightSectionStyle}>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center" style={{ marginBottom: "20px" }}>
            <Avatar style={avatarStyle}>
              <KeyIcon />
            </Avatar>
            <h1>Verify OTP</h1>
          </Grid>
          <form onSubmit={handleOtp}>
            <Typography variant="h6" style={{ marginBottom: "20px" }}>Enter your OTP</Typography>
            <Grid container justifyContent="center" alignItems="center" spacing={1}>
              <OTP length={6} value={otp} onChange={handleOtpChange} inputStyle={{ width: "3rem", margin: "0 0.5rem", fontSize: "1.5rem", borderRadius: 4, border: "1px solid rgba(0,0,0,0.3)" }} autoFocus />
            </Grid>
            {errorMessage && (
              <Typography color="error" variant="body2" style={{ margin: "20px 0" }}>
                {errorMessage}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ margin: "20px 0" }}>Submit</Button>
          </form>
          <Typography style={{ textAlign: "end", marginBottom: "20px" }}>
            <Link href="#">Resend OTP</Link>
          </Typography>
          <Grid container display="flex" alignItems="center" style={{ padding: "10px", marginBottom: "20px" }}>
            <Avatar style={{ backgroundColor: "orange", marginRight: "10px" }}>
              <WarningIcon />
            </Avatar>
            <Typography variant="body1" style={{ color: "red", fontSize: "15px" }}>Never Share Your Otp</Typography>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Verifyotp;
