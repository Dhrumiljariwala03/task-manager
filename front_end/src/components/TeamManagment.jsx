import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, Table, Space } from "antd";
import { Select as AntSelect } from "antd";
import { getAllTeams, getAllteamDataSuccess } from "../redux/slices/teamSlice";
const { Option } = AntSelect;

const TeamManagement = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.team.team);
  const [openModal, setOpenModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [tl, setTl] = useState("");
  const [devs, setDevs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editTeam, setEditTeam] = useState(null);

  useEffect(() => {
    dispatch(getAllTeams()).then((response) => {
      dispatch(getAllteamDataSuccess(response.payload));
    });
  }, [dispatch]);

  const handleCreateTeam = () => {
    setOpenModal(true);
    setEditMode(false);
    setTeamName("");
    setTl("");
    setDevs([]);
  };

  const handleEdit = (team) => {
    setOpenModal(true);
    setEditMode(true);
    setEditTeam(team.key);
    setTeamName(team.teamName);
    setTl(team.TL);
    setDevs(team.Devs);
  };

  const handleModalOk = () => {
    const newTeam = {
      key: editMode ? editTeam : teams.length + 1,
      teamName,
      TL: tl,
      Devs: devs,
    };

    if (editMode) {
      const updatedTeams = teams.map((team) => (team.key === editTeam ? newTeam : team));
      dispatch(getAllteamDataSuccess(updatedTeams));
    } else {
      dispatch(getAllteamDataSuccess([...teams, newTeam]));
    }
    setOpenModal(false);
  };

  const handleModalCancel = () => {
    setOpenModal(false);
  };

  const handleDelete = (key) => {
    const updatedTeams = teams.filter((team) => team.key !== key);
    dispatch(getAllteamDataSuccess(updatedTeams));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "teamName") {
      setTeamName(value);
    } else if (name === "tl") {
      setTl(value);
    } else if (name === "devs") {
      setDevs(value);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Team Name",
      dataIndex: "teamName",
      key: "teamName",
    },
    {
      title: "TL",
      dataIndex: "TL",
      key: "TL",
    },
    {
      title: "Devs",
      dataIndex: "Devs",
      key: "Devs",
      render: (devs) => (devs.length > 1 ? `${devs[0]}, ...` : devs[0]),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditIcon style={{ cursor: 'pointer', color: 'orange' }} onClick={() => handleEdit(record)} />
          <DeleteIcon style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDelete(record.key)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
        <h1>Team Management</h1>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleCreateTeam}>Create Team</Button>
      </Box>
      <Modal title={editMode ? "Edit Team" : "Create Team"} visible={openModal} onOk={handleModalOk} onCancel={handleModalCancel} okText={editMode ? "Save" : "Create"} cancelText="Cancel">
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Team Name" name="teamName" value={teamName} onChange={handleChange} fullWidth required />
          <FormControl fullWidth required>
            <InputLabel>Team Lead</InputLabel>
            <Select name="tl" value={tl} onChange={handleChange} label="Team Lead">
              <MenuItem value="TL1">TeamLeader 1</MenuItem>
              <MenuItem value="TL2">TeamLeader 2</MenuItem>
              <MenuItem value="TL3">TeamLeader 3</MenuItem>
              <MenuItem value="TL4">TeamLeader 4</MenuItem>
              <MenuItem value="TL5">TeamLeader 5</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel sx={{ height: "50px" }}>Developers</InputLabel>
            <AntSelect mode="multiple" value={devs} onChange={(value) => setDevs(value)}>
              <Option value="Dev1">developer 1</Option>
              <Option value="Dev2">developer 2</Option>
              <Option value="Dev3">developer 3</Option>
              <Option value="Dev4">developer 4</Option>
              <Option value="Dev5">developer 5</Option>
            </AntSelect>
          </FormControl>
        </Box>
      </Modal>
      <Table columns={columns} dataSource={teams} pagination={{ pageSize: 5 }} style={{ marginTop: "1px" }} />
    </>
  );
};

export default TeamManagement;
