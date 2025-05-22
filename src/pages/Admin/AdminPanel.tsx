import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface User {
  user_id: number;
  username: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]); // Specify the type here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!user || user.role !== 'administrator') {
      navigate('/404'); // Redirect to 404 or unauthorized page
    } else {
      // Fetch users if admin
      const fetchUsers = async () => {
        try {
          // Replace with your actual API call to get users
          // const response = await fetch('/api/admin/users', {
          //   headers: {
          //     'Authorization': `Bearer ${localStorage.getItem('token')}` // Or get token from AuthContext
          //   }
          // });
          // if (!response.ok) {
          //   throw new Error('Failed to fetch users');
          // }
          // const data = await response.json();
          // setUsers(data);
          // setLoading(false);
          // Placeholder for now
          setUsers([{ user_id: 1, username: 'admin', role: 'administrator' }, { user_id: 2, username: 'user', role: 'user' }]);
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || user.role !== 'administrator') {
    return null; // Should be redirected by useEffect
  }

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => ( // Type is now User
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                {/* Add action buttons here (e.g., change role, delete) */}
                <button>Change Role</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;