import React, { useState, useEffect } from 'react';
import { Avatar, Button, Grid, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPassword } from '../redux/slices/authSlice';
import bgImage from '../assets/images/commerce.png';

const SetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPasswordInput] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (status === 'succeeded') {
      setSnackbarMessage('Password set successfully!');
      setSnackbarOpen(true);
      setOpenModal(true);
    } else if (status === 'failed') {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [status, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');
    dispatch(setPassword({ token, password, confirmPassword }));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/');
  };

  return (
    <Grid container style={{ height: '100vh', display: 'flex', flexWrap: 'wrap' }}>
      <Grid item style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', '@media (max-width: 768px)': { display: 'none' } }}>
        <motion.div
          style={{ width: '80%', height: '80%', background: `url(${bgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
          animate={{ y: [0, -10, 0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </Grid>
      <Grid item style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', width: '100%' }}>
        <Paper elevation={10} style={{ padding: 20, height: 'auto', width: '100%', maxWidth: 450, alignSelf: 'center', margin: '0 50px' }}>
          <Grid align="center">
            <Avatar style={{ backgroundColor: '#2a9ac2', padding: '10px' }}>
              <PasswordIcon style={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h4" style={{ margin: '20px 0' }}>
              Set Password
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField label="New Password" type="password" fullWidth value={password} onChange={(e) => setPasswordInput(e.target.value)} margin="normal" required />
            <TextField label="Confirm Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPasswordInput(e.target.value)} margin="normal" required />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ margin: '15px 0px' }}>Set Passwor</Button>
          </form>
        </Paper>
      </Grid>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Password Set Successfully</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your password has been set successfully! You can now log in with your new password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">OK</Button>
          <Button onClick={() => navigate('/login')} color="primary">Go to Login</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </Grid>
  );
};

export default SetPassword;
