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
import UserModal from '@/components/custom/UserModal'; // Perbaiki import path
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Loading from '../components/custom/Loading'; // Asumsi ada komponen loading
import { Card, CardContent } from '../components/ui/card'; // Asumsi ada komponen Card dari shadcn/ui

/**
 * Custom hook untuk mengelola data pengguna dan operasi CRUD.
 *
 * @returns {object} Objek yang berisi:
 *   - users: Array data pengguna.
 *   - loading: Boolean yang menunjukkan apakah data sedang dimuat.
 *   - error: String pesan error jika terjadi kesalahan.
 *   - fetchUsers: Fungsi untuk mengambil ulang data pengguna.
 *   - handleCreateUser: Fungsi untuk membuat pengguna baru.
 *   - handleUpdateUser: Fungsi untuk memperbarui pengguna.
 *   - handleDeleteUser: Fungsi untuk menghapus pengguna.
 */
const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleCreateUser = async (userData) => {
        try {
            await createUser(userData);
            toast.success(`Pengguna "${userData.username}" berhasil dibuat.`);
            fetchUsers();
        } catch (err) {
            toast.error(`Error membuat pengguna: ${err.message}`);
            throw err; // Re-throw untuk ditangani di komponen
        }
    };

    const handleUpdateUser = async (username, userData) => {
        try {
            await updateUser(username, userData);
            toast.success(`Pengguna "${username}" berhasil diperbarui.`);
            fetchUsers();
        } catch (err) {
            toast.error(`Error memperbarui pengguna: ${err.message}`);
            throw err; // Re-throw untuk ditangani di komponen
        }
    };

    const handleDeleteUser = async (username) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${username}"?`)) {
            try {
                await deleteUser(username);
                toast.success(`Pengguna "${username}" berhasil dihapus.`);
                fetchUsers();
            } catch (err) {
                toast.error(`Error menghapus pengguna: ${err.message}`);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, fetchUsers, handleCreateUser, handleUpdateUser, handleDeleteUser };
};

/**
 * Komponen halaman untuk manajemen pengguna.
 * Memungkinkan administrator untuk melihat, membuat, mengedit, dan menghapus pengguna.
 */

const UserManagementPage = () => {
    const { users, loading, error, handleCreateUser, handleUpdateUser, handleDeleteUser } = useUserManagement();

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "user",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Nama pengguna wajib diisi.';
        } else if (formData.username.length < 3) {
            errors.username = 'Nama pengguna minimal 3 karakter.';
        }

        if (!selectedUser && !formData.password) {
            errors.password = 'Kata sandi wajib diisi untuk pengguna baru.';
        } else if (formData.password && formData.password.length < 6) {
            errors.password = 'Kata sandi minimal 6 karakter.';
        }

        if (!formData.role) {
            errors.role = 'Peran wajib diisi.';
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
            toast.error('Mohon perbaiki kesalahan pada formulir.');
            return;
        }

        try {
            setIsSubmitting(true);
            if (selectedUser) {
                const updateData = {
                    role: formData.role
                };
                if (formData.password.trim()) {
                    updateData.password = formData.password;
                }
                await handleUpdateUser(selectedUser.username, updateData);
            } else {
                await handleCreateUser(formData);
            }
            setShowModal(false);
            resetForm();
        } catch (err) {
            // Error sudah ditangani di hook, tidak perlu toast lagi di sini
        } finally {
            setIsSubmitting(false);
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
            password: "", // Kosongkan password saat edit
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
                <Loading />
                <div className="text-blue-600 ml-2">Memuat pengguna...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <Card className="p-6 bg-red-100 border-red-400 text-red-700">
                    <CardContent>
                        <h2 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h2>
                        <p>Gagal memuat pengguna: {error}</p>
                        <p className="text-sm mt-2">Mohon coba lagi nanti atau hubungi administrator.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
                <Button onClick={openCreateModal}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Pengguna Baru
                </Button>
            </div>

            <Table className="mb-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nama Pengguna</TableHead>
                        <TableHead>Peran</TableHead>
                        <TableHead>Dibuat Pada</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.user_id}>
                                <TableCell className="font-medium">{user.user_id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button
                                        onClick={() => openEditModal(user)}
                                        size="sm"
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDeleteUser(user.username)}
                                        size="sm"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Hapus
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                Tidak ada pengguna ditemukan.
                            </TableCell>
                        </TableRow>
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
    );
};

export default UserManagementPage;