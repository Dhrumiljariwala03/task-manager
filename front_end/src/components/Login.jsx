import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import Cookies from "js-cookie";
import bgImage from '../assets/images/hero_img.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({ user: "", password: "" });
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(values))
      .unwrap()
      .then(() => {
        navigate(`/dashboard`, { replace: true });
      })
      .catch((error) => {
        setErrorMessage(error.message || "Login failed. Please try again.");
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const paperStyle = { padding: 20, height: "auto", width: "100%", maxWidth: 450, alignSelf: 'center', margin: "0 50px" };
  const avatarStyle = { backgroundColor: "#2a9ac2" };
  const gridContainerStyle = { height: '100vh', display: 'flex', flexWrap: 'wrap' };
  const leftSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', '@media (max-width: 768px)': { display: 'none' } };
  const rightSectionStyle = { flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "20px 0", width: '100%' };

  return (
    <Grid container style={gridContainerStyle}>
      <Grid item style={leftSectionStyle}>
        <motion.div style={{ width: '80%', height: '80%', background: `url(${bgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', }} animate={{ y: [0, -10, 0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      </Grid>
      <Grid item style={rightSectionStyle}>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockIcon />
            </Avatar>
            <h1>Login</h1>
          </Grid>
          <form onSubmit={handleLogin}>
            <TextField id="outlined-username-input" label="Username or Email" type="text" autoComplete="current-username" fullWidth style={{ margin: "15px 0px" }} required onChange={(e) => setValues({ ...values, user: e.target.value })} />
            <TextField id="outlined-password-input" label="Password" type="password" autoComplete="current-password" fullWidth style={{ margin: "15px 0px" }} required onChange={(e) => setValues({ ...values, password: e.target.value })} />
            <Typography style={{ textAlign: "end" }}>
              <NavLink to="verify-email">
                <Link href="#">Forgot Password?</Link>
              </NavLink>
            </Typography>
            <FormControlLabel control={<Checkbox color="primary" />} label="Remember Me" />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ margin: "15px 0px" }}> Login </Button>
          </form>
        </Paper>
      </Grid>

      {/* Error Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Login;
