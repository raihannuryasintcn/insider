import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getActivityLogs,
    //@ts-ignore
} from "@/services/userService";

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
        <>


            <Table className={"mb-2"}>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (

                        <TableRow>
                            <TableCell className="font-medium">{log.user_logs_id}</TableCell>
                            <TableCell>{log.username}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.ip_address}</TableCell>
                            <TableCell className="text-right">{new Date(log.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    {logs.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                                No activity logs found
                            </td>
                        </tr>
                    )}

                </TableBody>
            </Table>

        </>
    );
};

export default ActivityLogs;