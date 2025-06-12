import React, { useState } from "react";
import useFetchISPData from "../utils/fetchIspDataUtils";
import useFilteredISPData from "../utils/filteredIspDataUtils";
import FilterPanel from "../FilterPanel";
import ISPTable from "../IspTable";
import {Button} from "../components/ui/button";
import {Funnel} from 'lucide-react'
import { Input } from "@/components/ui/input";
import { Loading } from "../components/custom/loading";

const ListISP = () => {
  const [search, setSearch] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const { ispData, loading, error } = useFetchISPData();
  const { filteredISP, getUniqueValues } = useFilteredISPData(
    ispData,
    search,
    filters
  );

  const resetFilters = () => {
    setFilters({});
    setSearch("");
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
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
           <Funnel className="h-4 w-4" />

            Filters
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search ISP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          <p className="text-gray-500">No results found</p>
        </div>
      )}
    </div>
  );
};

export default ListISP;
