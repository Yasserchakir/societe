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
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
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
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
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
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Avatar
              src={avatar}
              size={40}
              style={{
                background: avatar ? null : 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                border: "2px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
            dropdownStyle={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            <Option value="Admin">Admin</Option>
            <Option value="Client">Client</Option>
            <Option value="Vendeur">Vendeur</Option>
          </Select>
        ) : (
          <motion.span
            className="modern-text"
            whileHover={{ color: "#4f46e5" }}
            transition={{ duration: 0.2 }}
          >
            {role}
          </motion.span>
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
          <motion.span
            className="modern-text"
            whileHover={{ color: "#4f46e5" }}
            transition={{ duration: 0.2 }}
          >
            {`${name} ${record.prenom || ""}`}
          </motion.span>
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
          <motion.span
            className="modern-text"
            whileHover={{ color: "#4f46e5" }}
            transition={{ duration: 0.2 }}
          >
            {email}
          </motion.span>
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
          <motion.span
            className="modern-text"
            whileHover={{ color: "#4f46e5" }}
            transition={{ duration: 0.2 }}
          >
            {city || "N/A"}
          </motion.span>
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
          <motion.span
            className="modern-text"
            whileHover={{ color: "#4f46e5" }}
            transition={{ duration: 0.2 }}
          >
            {telephone || "N/A"}
          </motion.span>
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
              <motion.button
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="action-button save-btn"
                onClick={() => save(record)}
              >
                <i className='bx bx-check' />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                className="action-button cancel-btn"
                onClick={cancel}
              >
                <i className='bx bx-x' />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="action-button edit-btn"
                onClick={() => edit(record)}
              >
                <i className='bx bx-pencil' />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                className="action-button delete-btn"
                onClick={() => handleDelete(record._id)}
              >
                <i className='bx bx-trash-alt' />
              </motion.button>
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
          whileHover={{ scale: 1.15, backgroundColor: "#7c3aed" }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="modern-header">
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <i className='bx bx-users'/> Manage Users
        </motion.h2>
      </div>
      
      <motion.div 
        className="filter-search-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="search-container">
          <motion.i
            className='bx bx-search search-icon'
            whileHover={{ scale: 1.2, color: "#4f46e5" }}
          />
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
          dropdownStyle={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <Option value="All">All Roles</Option>
          <Option value="Admin">Admin</Option>
          <Option value="Client">Client</Option>
          <Option value="Vendeur">Vendeur</Option>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Table
          dataSource={paginatedUsers}
          loading={loading}
          rowKey="_id"
          columns={columns}
          pagination={false}
          className="modern-table"
          bordered={false}
          scroll={{ x: 'max-content' }}
          style={{ borderRadius: "16px", overflow: "hidden" }}
        />
      </motion.div>
      {totalPages > 1 && renderPagination()}
    </motion.div>
  );
};

export default ManageUsers;