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


import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getActivityLogs } from "@/services/userService";

const useActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchLogs();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  return { logs, loading, error, fetchLogs };
};

const ActivityLogsPage = () => {
    const { logs, loading, error } = useActivityLogs();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
                <div className="text-blue-600 ml-2">Memuat log aktivitas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <Card className="p-6 bg-red-100 border-red-400 text-red-700">
                    <CardContent>
                        <h2 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h2>
                        <p>Gagal memuat log aktivitas: {error}</p>
                        <p className="text-sm mt-2">Mohon coba lagi nanti atau hubungi administrator.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Log Aktivitas Pengguna</h1>
            <Table className="mb-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Pengguna</TableHead>
                        <TableHead>Aksi</TableHead>
                        <TableHead>Alamat IP</TableHead>
                        <TableHead className="text-right">Waktu</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <TableRow key={log.user_logs_id}>
                                <TableCell className="font-medium">{log.user_logs_id}</TableCell>
                                <TableCell>{log.username}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.ip_address}</TableCell>
                                <TableCell className="text-right">{new Date(log.created_at).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                Tidak ada log aktivitas ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default ActivityLogsPage;