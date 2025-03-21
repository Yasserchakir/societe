import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
    form.setFieldsValue(user);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editUser) {
        await axios.put(`http://localhost:5000/admin/users/${editUser._id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User updated successfully");
      } else {
        await axios.post("http://localhost:5000/admin/users", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User added successfully");
      }
      fetchUsers();
      setIsModalOpen(false);
      form.resetFields();
      setEditUser(null);
    } catch (error) {
      message.error("Operation failed");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Dashboard</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: "20px" }}>
        Add User
      </Button>

      <Table
        dataSource={users}
        loading={loading}
        rowKey="_id"
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Prenom", dataIndex: "prenom" },
          { title: "Email", dataIndex: "email" },
          { title: "City", dataIndex: "city" },
          { title: "Telephone", dataIndex: "telephone" },
          { title: "Role", dataIndex: "role" },
          {
            title: "Actions",
            render: (text, record) => (
              <>
                <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                <Button danger type="link" onClick={() => handleDelete(record._id)}>Delete</Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="prenom" label="Prenom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="telephone" label="Telephone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Client">Client</Select.Option>
              <Select.Option value="Vendeur">Vendeur</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
