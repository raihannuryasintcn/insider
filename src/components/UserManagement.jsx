import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  //@ts-ignore
} from "../services/userService";
//@ts-ignore
import UserModal from './UserModal';
import Button from "./ui/button/Button";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!selectedUser && !formData.password) {
      errors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      setIsSubmitting(true);

      if (selectedUser) {
        // For updates, only include password if it's not empty
        const updateData = {
          role: formData.role
        };
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }
        await updateUser(selectedUser.username, updateData);
        toast.success(`User "${selectedUser.username}" updated successfully`);
      } else {
        await createUser(formData);
        toast.success(`User "${formData.username}" created successfully`);
      }
      setShowModal(false);
      resetForm();
      fetchUsers(); // Refresh user list
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await deleteUser(username);
        toast.success(`User "${username}" deleted successfully`);
        fetchUsers(); // Refresh user list
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      role: "user",
    });
    setSelectedUser(null);
    setFormErrors({});
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "",
      role: user.role,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1></h1>
        <div className="flex gap-4">
          <Button variant="primary"
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                  {user.user_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500 capitalize">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => openEditModal(user)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(user.username)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        showModal={showModal}
        selectedUser={selectedUser}
        formData={formData}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
      />
    </>
  );
};

export default UserManagement;