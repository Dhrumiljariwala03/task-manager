import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Box, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio, Snackbar } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Table, Tag, Space } from "antd";
import { getAllUser, addUser, getAllUserSuccess, getRoles, getRolesSuccess, deleteUser, updateUser } from "../redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, roles, status } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    image: null,
    role: "",
  });
  const [editData, setEditData] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      const userResponse = await dispatch(getAllUser());
      dispatch(getAllUserSuccess(userResponse.payload));

      const roleResponse = await dispatch(getRoles());
      dispatch(getRolesSuccess(roleResponse.payload));
    };

    fetchUsersAndRoles();

    const checkIfAdmin = async () => {
      const token = Cookies.get("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const roleId = decodedToken.role;
        setCurrentUserId(decodedToken._id);
        try {
          const response = await axios.get(
            `http://localhost:4000/api/role/get-roles-byId?_id=${roleId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const userRole = response.data.data.role;
          setIsAdmin(userRole === "Admin");
        } catch (error) {
          console.error("Error fetching role details:", error);
        }
      }
    };

    checkIfAdmin();
  }, [dispatch]);

  const handleEdit = async (user) => {
    setEditData(user);
    setFormData({
      username: user.username,
      email: user.email,
      gender: user.gender,
      image: user.image,
      role: user.role._id,
      _id: user._id

    });
    const userResponse = await dispatch(getAllUser());
    dispatch(getAllUserSuccess(userResponse.payload));
    setEditOpen(true);
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId))
      .unwrap()
      .catch((err) => {
        setSnackbarMessage(err);
        setSnackbarOpen(true);
      });
  };

  const handleEditSubmit = async () => {
    const updatedUser = {
      ...editData,
      ...formData,
    };

    const result = await dispatch(updateUser(updatedUser))
      .unwrap()
      .catch((err) => {
        setSnackbarMessage(err);
        setSnackbarOpen(true);
      });

    if (result) {
      dispatch(getAllUser());
      setEditOpen(false);
      setSnackbarMessage("User updated successfully!");
      setSnackbarOpen(true);
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {record._id === currentUserId ? (
            "-"
          ) : (
            <>
              <EditIcon onClick={() => handleEdit(record)} style={{ cursor: "pointer", color: "orange" }} />
              <DeleteIcon onClick={() => handleDelete(record._id)} style={{ cursor: "pointer", color: "#D22730" }} />
            </>
          )}
        </Space>
      )
    }
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "image") {
      setFormData({ ...formData, image: event.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!isAdmin) {
      setSnackbarMessage("Unauthorized: Only admins can add users.");
      setSnackbarOpen(true);
      dispatch(getAllUser());
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("role", formData.role);

    const result = await dispatch(addUser(formDataToSend))
      .unwrap()
      .catch((err) => {
        setSnackbarMessage(err);
        setSnackbarOpen(true);
      });

    if (result) {
      dispatch(getAllUser());
      setSuccessDialogOpen(true);
    }
    handleClose();
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>User Management</h1>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{ position: "absolute", right: "25px" }} onClick={handleClickOpen} disabled={!isAdmin}>Add User</Button>
      </Box>
      {status === "loading" ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table columns={columns} dataSource={users} pagination={{ pageSize: 5 }} style={{ marginTop: "75px" }} rowKey="_id" />
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Username" type="text" name="username" fullWidth variant="standard" value={formData.username} onChange={handleChange} required />
          <TextField margin="dense" label="Email" type="email" name="email" fullWidth variant="standard" value={formData.email} required onChange={handleChange} />
          <FormControl component="fieldset" sx={{ marginTop: 2, marginBottom: 1 }}>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange} required>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <TextField margin="dense" label="Profile Picture" type="file" name="image" fullWidth variant="standard" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth margin="dense" sx={{ maxWidth: "200px" }}>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange} variant="standard" required>
              {roles &&
                roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.role}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Username" type="text" name="username" fullWidth variant="standard" value={formData.username} onChange={handleChange} required />
          <TextField margin="dense" label="Email" type="email" name="email" fullWidth variant="standard" value={formData.email} required onChange={handleChange} />
          <FormControl component="fieldset" sx={{ marginTop: 2, marginBottom: 1 }}>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange} required>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <TextField margin="dense" label="Profile Picture" type="file" name="image" fullWidth variant="standard" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth margin="dense" sx={{ maxWidth: "200px" }}>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange} variant="standard" required>
              {roles &&
                roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.role}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </Box>
  );
};

export default UserManagement;
