import React, { useEffect, useState } from "react";
import { Card, Avatar, Button, Row, Col, List, Descriptions, Divider, Typography, Spin } from "antd";
import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    userImage: null,
    role: "",
    email: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("No token found in cookies");
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const response = await axios.get(
          `http://localhost:4000/api/user/getuserbyid/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData({
          username: response.data.data.username,
          userImage: response.data.data.userImage || "https://example.com/default-avatar.jpg",
          role: response.data.data.role,
          email: response.data.data.email,
          gender: response.data.data.gender,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff, #d9e4ff)", padding: "10px 20px" }}>
      <Row justify="center" align="middle">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", background: "#ffffff" }}>
            {/* Header Section */}
            <div style={{ textAlign: "center", padding: "32px 20px", background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              <Avatar size={80} icon={<UserOutlined />} src={userData.userImage} style={{ backgroundColor: "#ffffff", border: "3px solid #ffffff", marginBottom: "16px" }} />
              <Title level={3} style={{ color: "#ffffff", marginBottom: "8px", fontWeight: "bold" }}>
                {userData.username}
              </Title>
              <Text style={{ color: "#e0e0e0", fontSize: "16px" }}>
                {userData.email}
              </Text>
            </div>

            {/* User Info Section */}
            <div style={{ padding: "24px" }}>
              <Title level={4} style={{ color: "#667eea", marginBottom: "16px" }}>
                User Information
              </Title>

              <Descriptions column={1} size="middle">
                <Descriptions.Item
                  label={
                    <Text strong style={{ fontSize: "16px", color: "#667eea" }}>
                      Role
                    </Text>
                  }
                >
                  <Text style={{ fontSize: "16px", color: "#333333" }}>
                    {userData.role}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong style={{ fontSize: "16px", color: "#667eea" }}>
                      Gender
                    </Text>
                  }
                >
                  <Text style={{ fontSize: "16px", color: "#333333" }}>
                    {userData.gender}
                  </Text>
                </Descriptions.Item>

              </Descriptions>
            </div>

            {/* Divider */}
            <Divider style={{ margin: "0" }} />

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "center", padding: "16px", gap: "16px" }}>
              <Button type="primary" icon={<EditOutlined />} size="middle" style={{ background: "#667eea", borderColor: "#667eea", padding: "0 24px", fontSize: "14px", height: "40px", borderRadius: "8px" }}> Edit Profile </Button>
              <Button type="default" icon={<LogoutOutlined />} size="middle" style={{ color: "#ff4444", borderColor: "#ff4444", padding: "0 24px", fontSize: "14px", height: "40px", borderRadius: "8px" }}>
                Logout
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;