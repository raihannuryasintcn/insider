import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Perbaiki import path


const ISPTable = ({ filteredISP = [], currentPage, setCurrentPage }) => {
    const [expandedId, setExpandedId] = useState(null);
    const pageSize = 50; // Jumlah item per halaman

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = filteredISP.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredISP.length / pageSize);


    const toggleExpanded = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Reset halaman ke 0 setiap kali data ISP yang difilter berubah
    useEffect(() => {
        setCurrentPage(0);
    }, [filteredISP, setCurrentPage]);

    return (
        <React.Fragment>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>ISP Terdaftar</TableHead> {/* Terjemahkan */}
                        <TableHead>Nama Legal</TableHead> {/* Terjemahkan */}
                        <TableHead>Cakupan</TableHead> {/* Terjemahkan */}
                        <TableHead>Wilayah</TableHead> {/* Terjemahkan */}
                        <TableHead className="text-right">Aksi</TableHead> {/* Terjemahkan */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentData.length > 0 ? (
                        currentData.map((row, index) => (
                            <React.Fragment key={row.id || index}>
                                <TableRow>
                                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                    <TableCell>{row.registered_kominfo_isp || "N/A"}</TableCell>
                                    <TableCell>{row.legal_name || "N/A"}</TableCell>
                                    <TableCell>{row.coverage_customer || "N/A"}</TableCell>
                                    <TableCell>{row.headquarters || "N/A"}</TableCell>
                                    <TableCell className="text-right">
                                        <button
                                            onClick={() => toggleExpanded(row.id || index)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                                        >
                                            {expandedId === (row.id || index) ? "Sembunyikan Detail" : "Tampilkan Detail"} {/* Terjemahkan */}
                                        </button>
                                    </TableCell>
                                </TableRow>
                                {expandedId === (row.id || index) && (
                                    <TableRow>
                                        <TableCell colSpan={6}> {/* Ubah colSpan menjadi 6 */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Kolom Kiri */}
                                                <div className="space-y-4">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Informasi Perusahaan {/* Terjemahkan */}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Legal</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.legal_name || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wilayah</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.headquarters || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alamat</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.address || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Detail Registrasi {/* Terjemahkan */}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor ASN</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.asn_number || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor BP</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.bp_number || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Telepon</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.phone || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Kolom Kanan */}
                                                <div className="space-y-4">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Status Layanan {/* Terjemahkan */}
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">JARTUP</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_jartup ? "Ya" : "Tidak"}</p> {/* Terjemahkan */}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">JARTAPLOK</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_jartaplok ? "Ya" : "Tidak"}</p> {/* Terjemahkan */}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Kominfo ISP</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_kominfo_isp ? "Ya" : "Tidak"}</p> {/* Terjemahkan */}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pelanggan</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_customer ? "Ya" : "Tidak"}</p> {/* Terjemahkan */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Informasi Tambahan {/* Terjemahkan */}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profil Risiko</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.internal_risk_profile || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tingkat Koleksi</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.collection_rate || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Provinsi</p> {/* Terjemahkan */}
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.province || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center"> {/* Ubah colSpan menjadi 6 */}
                                Tidak ada data ISP tersedia. {/* Terjemahkan */}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-end">
                <div className="flex justify-between items-center my-4 gap-2">
                    <Button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        size="icon"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>
                        Halaman {currentPage + 1} dari {totalPages} {/* Terjemahkan */}
                    </span>
                    <Button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                        size="icon"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ISPTable;