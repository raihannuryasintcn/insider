import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import {
  getActivityLogs,
  //@ts-ignore
} from "../services/userService";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const logsData = await getActivityLogs();
      setLogs(logsData);
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-600">Loading activity logs...</div>
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
              User
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              IP Address
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.user_logs_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                {log.user_logs_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                {log.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                {log.action}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                {log.ip_address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                {new Date(log.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No activity logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogs;