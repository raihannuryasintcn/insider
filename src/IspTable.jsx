import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./components/ui/button";

const ISPTable = ({ filteredISP = [], currentPage, setCurrentPage }) => {
    const [expandedId, setExpandedId] = useState(null);
    // const [currentPage, setCurrentPage] = useState(0); // Dihapus
    const pageSize = 50;

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = filteredISP.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredISP.length / pageSize);

    const toggleExpanded = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        setCurrentPage(0); // Reset halaman ke 0 setiap kali filteredISP berubah
    }, [filteredISP, setCurrentPage]);

    return (
        <React.Fragment>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Registered ISP</TableHead>
                        <TableHead>Legal Name</TableHead>
                        <TableHead>Coverage</TableHead>
                        <TableHead>Territory</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentData.length ? (
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
                                            {expandedId === (row.id || index) ? "Hide Details" : "Show Details"}
                                        </button>
                                    </TableCell>
                                </TableRow>
                                {expandedId === (row.id || index) && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            {/* Add your expanded content here */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Left Column */}
                                                <div className="space-y-4">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Company Information
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Legal Name</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.legal_name || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Territory</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.headquarters || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.address || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Registration Details
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ASN Number</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.asn_number || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">BP Number</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.bp_number || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.phone || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column */}
                                                <div className="space-y-4">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Service Status
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">JARTUP</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_jartup ? "Yes" : "No"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">JARTAPLOK</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_jartaplok ? "Yes" : "No"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Kominfo ISP</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_kominfo_isp ? "Yes" : "No"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.is_customer ? "Yes" : "No"}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white/90">
                                                            Additional Info
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Profile</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.internal_risk_profile || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Collection Rate</p>
                                                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">{row.collection_rate || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Province</p>
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
                            <TableCell colSpan={5} className="text-center">
                                No ISP data available
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
                        Page {currentPage + 1} of {totalPages}
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
}

export default ISPTable;