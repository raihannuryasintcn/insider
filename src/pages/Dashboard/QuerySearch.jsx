import React, { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { exportISPDataToExcel } from "../../utils/exportUtils";
import useFetchISPData from "../../components/useFetchISPData";
import useFilteredISPData from "../../components/useFilteredISPData";
import FilterPanel from "../../components/FilterPanel";
import ISPTable from "../../components/ISPTable";
import Button from "../../components/ui/button/Button";
import {Funnel} from 'lucide-react'

const QuerySearch = () => {
  const [search, setSearch] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    is_jartup: "",
    is_jartaplok: "",
    internal_risk_profile: "",
    collection_rate: "",
    coverage_customer: "",
    headquarters: "",
  });

  const { ispData, loading, error } = useFetchISPData();
  const { filteredISP, getUniqueValues } = useFilteredISPData(
    ispData,
    search,
    filters
  );

  const resetFilters = () => {
    setFilters({
      is_jartup: "",
      is_jartaplok: "",
      internal_risk_profile: "",
      collection_rate: "",
      coverage_customer: "",
      headquarters: "",
    });
    setSearch("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
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
      <div className="flex justify-between items-center mb-4">
        <h1></h1>
        <div className="flex gap-4">
          {/* <Button
            onClick={() =>
              exportISPDataToExcel(filteredISP, "Filtered_ISP_Data")
            }
            className="flex items-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download
          </Button> */}
          <Button variant="primary"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
           <Funnel className="h-4 w-4 mr-2" />

            Filters
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search ISP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        showFilterPanel={showFilterPanel}
        setShowFilterPanel={setShowFilterPanel}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        getUniqueValues={getUniqueValues}
      />

      {/* Results Table */}
      <ISPTable filteredISP={filteredISP} />

      {/* No Results Message */}
      {filteredISP.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found</p>
        </div>
      )}
    </div>
  );
};

export default QuerySearch;
