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
} from "@/services/userService";
import UserModal from '@/UserModal';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


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

            <Table className={"mb-2"}>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.user_id}>
                            <TableCell className="font-medium">{user.user_id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="flex justify-end">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => openEditModal(user)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"

                                        onClick={() => handleDelete(user.username)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                                No users found
                            </td>
                        </tr>
                    )}
                </TableBody>
            </Table>
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
    )
}




export default UserManagement;