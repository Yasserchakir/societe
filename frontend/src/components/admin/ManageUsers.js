// ManageUsers.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Select, message, notification, Avatar } from "antd";
import 'boxicons/css/boxicons.min.css';
import './ManageUsers.css';
import { motion } from "framer-motion";

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let tempUsers = [...users];
    
    if (searchTerm) {
      tempUsers = tempUsers.filter(user => 
        `${user.name} ${user.prenom || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "All") {
      tempUsers = tempUsers.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({
        message: <span style={{ fontWeight: 600 }}>✅ User Deleted</span>,
        description: "The user has been successfully removed",
        placement: 'bottomRight',
        duration: 3,
        style: {
          borderRadius: '8px',
          background: '#ecfdf5',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #6ee7b7',
        },
      });
      fetchUsers();
    } catch (error) {
      notification.error({
        message: <span style={{ fontWeight: 600 }}>❌ Deletion Failed</span>,
        description: "An error occurred while deleting the user",
        placement: 'bottomRight',
        duration: 4,
        style: {
          borderRadius: '8px',
          background: '#fef2f2',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #f87171',
        },
      });
    }
  };

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    setEditingKey(record._id);
  };

  const save = async (record) => {
    try {
      const updatedUser = users.find(user => user._id === record._id);
      await axios.put(`http://localhost:5000/admin/users/${record._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success({
        content: "User updated successfully!",
        style: { marginTop: '20px' },
      });
      setEditingKey(null);
      fetchUsers();
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const handleInputChange = (id, field, value) => {
    setUsers(users.map(user => 
      user._id === id ? { ...user, [field]: value } : user
    ));
  };

  const columns = [
    {
      title: <span className="table-header-title"><i className='bx bx-user-circle'/> Avatar</span>,
      dataIndex: "avatar",
      width: 80,
      render: (avatar, record) => (
        isEditing(record) ? (
          <Input
            value={record.avatar || ""}
            onChange={(e) => handleInputChange(record._id, "avatar", e.target.value)}
            className="modern-input"
            placeholder="Avatar URL"
          />
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Avatar
              src={avatar}
              size={40}
              style={{
                backgroundColor: avatar ? null : "#4f46e5",
                border: "2px solid #e5e7eb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              {!avatar && record.name?.charAt(0).toUpperCase()}
            </Avatar>
          </motion.div>
        )
      ),
    },
    {
      title: <span className="table-header-title"><i className='bx bx-shield-alt-2'/> Role</span>,
      dataIndex: "role",
      width: 120,
      render: (role, record) => (
        isEditing(record) ? (
          <Select
            value={record.role}
            onChange={(value) => handleInputChange(record._id, "role", value)}
            className="modern-select"
            dropdownStyle={{ borderRadius: "8px" }}
          >
            <Option value="Admin">Admin</Option>
            <Option value="Client">Client</Option>
            <Option value="Vendeur">Vendeur</Option>
          </Select>
        ) : (
          <span className="modern-text">{role}</span>
        )
      ),
    },
    {
      title: <span className="table-header-title"><i className='bx bx-id-card'/> Full Name</span>,
      dataIndex: "name",
      render: (name, record) => (
        isEditing(record) ? (
          <Input
            value={`${record.name} ${record.prenom || ""}`}
            onChange={(e) => {
              const [name, prenom = ""] = e.target.value.split(" ", 2);
              handleInputChange(record._id, "name", name);
              handleInputChange(record._id, "prenom", prenom);
            }}
            className="modern-input"
            placeholder="Full Name"
          />
        ) : (
          <span className="modern-text">{`${name} ${record.prenom || ""}`}</span>
        )
      ),
    },
    {
      title: <span className="table-header-title"><i className='bx bx-mail-send'/> Email</span>,
      dataIndex: "email",
      render: (email, record) => (
        isEditing(record) ? (
          <Input
            value={record.email}
            onChange={(e) => handleInputChange(record._id, "email", e.target.value)}
            className="modern-input"
            placeholder="Email"
          />
        ) : (
          <span className="modern-text">{email}</span>
        )
      ),
    },
    {
      title: <span className="table-header-title"><i className='bx bx-map-pin'/> City</span>,
      dataIndex: "city",
      width: 120,
      render: (city, record) => (
        isEditing(record) ? (
          <Input
            value={record.city || ""}
            onChange={(e) => handleInputChange(record._id, "city", e.target.value)}
            className="modern-input"
            placeholder="City"
          />
        ) : (
          <span className="modern-text">{city || "N/A"}</span>
        )
      ),
    },
    {
      title: <span className="table-header-title"><i className='bx bx-phone-call'/> Phone</span>,
      dataIndex: "telephone",
      render: (telephone, record) => (
        isEditing(record) ? (
          <Input
            value={record.telephone || ""}
            onChange={(e) => handleInputChange(record._id, "telephone", e.target.value)}
            className="modern-input"
            placeholder="Phone"
          />
        ) : (
          <span className="modern-text">{telephone || "N/A"}</span>
        )
      ),
    },
    {
      title: <span className="table-header-title"><i className='bx bx-cog'/> Actions</span>,
      width: 120,
      render: (_, record) => (
        <div className="modern-actions">
          {isEditing(record) ? (
            <>
              <Button
                type="link"
                onClick={() => save(record)}
                className="action-button save-btn"
                icon={<i className='bx bx-check' />}
              />
              <Button
                type="link"
                onClick={cancel}
                className="action-button cancel-btn"
                icon={<i className='bx bx-x' />}
              />
            </>
          ) : (
            <>
              <Button
                type="link"
                onClick={() => edit(record)}
                className="action-button edit-btn"
                icon={<i className='bx bx-pencil' />}
              />
              <Button
                type="link"
                onClick={() => handleDelete(record._id)}
                className="action-button delete-btn"
                icon={<i className='bx bx-trash-alt' />}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <motion.button
          key={i}
          className={`modern-pagination-item ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {i}
        </motion.button>
      );
    }
    return <div className="modern-pagination">{paginationItems}</div>;
  };

  return (
    <motion.div
      className="modern-users-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="modern-header">
        <h2><i className='bx bx-users'/> Manage Users</h2>
      </div>
      
      <motion.div 
        className="filter-search-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="search-container">
          <i className='bx bx-search search-icon'/>
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-search-input"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          className="modern-filter-select"
          dropdownStyle={{ borderRadius: "8px" }}
        >
          <Option value="All">All Roles</Option>
          <Option value="Admin">Admin</Option>
          <Option value="Client">Client</Option>
          <Option value="Vendeur">Vendeur</Option>
        </Select>
      </motion.div>

      <Table
        dataSource={paginatedUsers}
        loading={loading}
        rowKey="_id"
        columns={columns}
        pagination={false}
        className="modern-table"
        bordered={false}
        scroll={{ x: 'max-content' }}
        style={{ borderRadius: "12px", overflow: "hidden" }}
      />
      {totalPages > 1 && renderPagination()}
    </motion.div>
  );
};

export default ManageUsers;