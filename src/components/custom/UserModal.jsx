import React from 'react';
import { X, User, Lock, Shield } from 'lucide-react';
import Loading from './Loading'; // Perbaiki import path

/**
 * Komponen modal untuk membuat atau mengedit pengguna.
 *
 * @param {object} props - Properti komponen.
 * @param {boolean} props.showModal - Menentukan apakah modal ditampilkan.
 * @param {object|null} props.selectedUser - Objek pengguna yang sedang diedit, atau null jika membuat baru.
 * @param {object} props.formData - Data formulir saat ini.
 * @param {object} props.formErrors - Objek kesalahan validasi formulir.
 * @param {boolean} props.isSubmitting - Menunjukkan apakah formulir sedang dalam proses submit.
 * @param {function} props.handleInputChange - Fungsi handler untuk perubahan input.
 * @param {function} props.handleSubmit - Fungsi handler untuk submit formulir.
 * @param {function} props.closeModal - Fungsi untuk menutup modal.
 */

const UserModal = ({
  showModal,
  selectedUser,
  formData,
  formErrors,
  isSubmitting,
  handleInputChange,
  handleSubmit,
  closeModal,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-600 flex items-center">
            <User className="h-5 w-5 mr-2" />
            {selectedUser ? 'Edit Pengguna' : 'Daftarkan Pengguna Baru'} {/* Terjemahkan */}
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Pengguna {/* Terjemahkan */}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={!!selectedUser}
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedUser ? 'Kata Sandi Baru (Biarkan kosong untuk tetap)' : 'Kata Sandi'} {/* Terjemahkan */}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required={!selectedUser}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peran {/* Terjemahkan */}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="user">Pengguna</option> {/* Terjemahkan */}
              <option value="administrator">Administrator</option>
            </select>
            {formErrors.role && (
              <p className="mt-1 text-sm text-red-500">{formErrors.role}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Batal {/* Terjemahkan */}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loading className="mr-2" /> {/* Tambahkan margin kanan */}
                  Memproses... {/* Terjemahkan */}
                </>
              ) : (
                selectedUser ? 'Perbarui Pengguna' : 'Buat Pengguna' /* Terjemahkan */
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;