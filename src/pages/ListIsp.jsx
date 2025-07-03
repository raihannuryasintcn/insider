import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Funnel } from 'lucide-react';
import { Input } from "@/components/ui/input";
import Loading from "../components/custom/Loading"; // Asumsi ada komponen loading
import { Card, CardContent } from '../components/ui/card'; // Asumsi ada komponen Card dari shadcn/ui

// Import komponen yang benar dari @/components
import FilterPanel from "@/components/custom/FilterPanel";
import ISPTable from "@/components/custom/IspTable";
import { toast } from 'react-toastify';



export const useIspData = () => {
  const [ispData, setIspData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const primaryApiUrl = import.meta.env.VITE_ISP_API_URL;
    const fallbackApiUrl = "http://localhost:3000/api/isp";

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let response;
        if (primaryApiUrl) {
          try {
            response = await fetch(primaryApiUrl);
            if (!response.ok) {
              throw new Error(`Server utama gagal: ${response.status}`);
            }
          } catch (primaryError) {
            console.warn("Server utama gagal, mencoba localhost...", primaryError.message);
            response = await fetch(fallbackApiUrl);
            if (!response.ok) {
              throw new Error(`Server fallback gagal: ${response.status}`);
            }
          }
        } else {
          response = await fetch(fallbackApiUrl);
          if (!response.ok) {
            throw new Error(`Server localhost gagal: ${response.status}`);
          }
        }

        const data = await response.json();
        setIspData(data);
      } catch (err) {
        console.error("Error fetching ISP data:", err);
        setError(err);
        toast.error(`Gagal memuat data ISP: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  return { ispData, isLoading, error };
};


const useFilteredISPData = (ispData, search, filters) => {
  const filteredISP = useMemo(() => {
    return ispData.filter((isp) => {
      // Handle null values safely
      const legalName = isp.legal_name || "";
      const ispName = isp.registered_kominfo_isp || "";

      const searchTerm = search.toLowerCase();

      return (
        (legalName.toLowerCase().includes(searchTerm) || ispName.toLowerCase().includes(searchTerm)) &&
        (!filters.is_jartup || filters.is_jartup === "" || String(isp.is_jartup) === filters.is_jartup) &&
        (!filters.is_jartaplok ||
          filters.is_jartaplok === "" ||
          String(isp.is_jartaplok) === filters.is_jartaplok) &&
        (!filters.internal_risk_profile ||
          filters.internal_risk_profile === "" ||
          isp.internal_risk_profile === filters.internal_risk_profile) &&
        (!filters.collection_rate ||
          filters.collection_rate === "" ||
          isp.collection_rate === filters.collection_rate) &&
        (!filters.coverage_customer ||
          filters.coverage_customer === "" ||
          isp.coverage_customer === filters.coverage_customer) &&
        (!filters.headquarters || filters.headquarters === "" || isp.headquarters === filters.headquarters)
      );
    });
  }, [ispData, search, filters]);

  const getUniqueValues = (field) => {
    return [...new Set(ispData.map((isp) => isp[field]))].filter((val) => val);
  };

  return { filteredISP, getUniqueValues };
};

/**
 * Komponen halaman untuk menampilkan daftar ISP dengan fitur pencarian dan filter.
 * Menggunakan custom hook `useIspData` untuk mengambil data ISP
 * dan `useFilteredISPData` untuk mengelola logic filtering.
 */
const ListIspPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Mengganti 'search' menjadi 'searchQuery'
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  // Menggunakan useIspData yang baru
  const { ispData, isLoading, error } = useIspData();
  
  // useFilteredISPData tetap digunakan untuk logic filtering
  const { filteredISP, getUniqueValues } = useFilteredISPData(
    ispData,
    searchQuery, // Menggunakan searchQuery
    filters
  );

  /**
   * Mereset semua filter dan query pencarian.
   */
  const resetFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
        <div className="text-blue-600 ml-2">Memuat daftar ISP...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="p-6 bg-red-100 border-red-400 text-red-700">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h2>
            <p>Gagal memuat daftar ISP: {error.message}</p>
            <p className="text-sm mt-2">Mohon coba lagi nanti atau hubungi administrator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-4">
          <Button 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Funnel className="h-4 w-4 mr-2" /> {/* Menambahkan margin kanan */}
            Filter
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Cari ISP..." // Mengubah placeholder
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <FilterPanel
          showFilterPanel={showFilterPanel}
          setShowFilterPanel={setShowFilterPanel}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          getUniqueValues={getUniqueValues}
        />
      )}

      {/* Results Table */}
      <ISPTable filteredISP={filteredISP} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* No Results Message */}
      {filteredISP.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada hasil ditemukan.</p> {/* Mengubah pesan */}
        </div>
      )}
    </div>
  );
};

export default ListIspPage;
