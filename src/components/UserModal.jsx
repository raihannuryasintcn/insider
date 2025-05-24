import React from 'react';
import {
  UserPlusIcon,
  PencilSquareIcon,
  XMarkIcon,
  UserIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

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
  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-blue-600 flex items-center">
            {selectedUser ? (
              <>
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Edit User
              </>
            ) : (
              <>
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Register New User
              </>
            )}
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-xs sm:text-sm font-bold mb-2 flex items-center"
              htmlFor="username"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
              required
              disabled={!!selectedUser}
            />
            {formErrors.username && (
              <p className="mt-1 text-xs text-red-500 flex items-center">
                <XMarkIcon className="h-4 w-4 mr-1" />
                {formErrors.username}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-xs sm:text-sm font-bold mb-2 flex items-center"
              htmlFor="password"
            >
              <KeyIcon className="h-4 w-4 mr-2" />
              {selectedUser ? "New Password (Leave blank to keep current)" : "Password"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
              required={!selectedUser}
            />
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-500 flex items-center">
                <XMarkIcon className="h-4 w-4 mr-1" />
                {formErrors.password}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-xs sm:text-sm font-bold mb-2 flex items-center"
              htmlFor="role"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${formErrors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
              required
            >
              <option value="user">User</option>
              <option value="administrator">Administrator</option>
            </select>
            {formErrors.role && (
              <p className="mt-1 text-xs text-red-500 flex items-center">
                <XMarkIcon className="h-4 w-4 mr-1" />
                {formErrors.role}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm flex items-center"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-1" />
                  {selectedUser ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;