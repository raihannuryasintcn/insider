import React from "react";
import { Transition } from "@headlessui/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./ui/button/Button";

const FilterPanel = ({
  showFilterPanel,
  setShowFilterPanel,
  filters,
  setFilters,
  resetFilters,
  getUniqueValues,
}) => {
  return (
    <Transition
      show={showFilterPanel}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* JARTUP Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              JARTUP
            </label>
            <select
              value={filters.is_jartup}
              onChange={(e) =>
                setFilters({ ...filters, is_jartup: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* JARTAPLOK Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              JARTAPLOK
            </label>
            <select
              value={filters.is_jartaplok}
              onChange={(e) =>
                setFilters({ ...filters, is_jartaplok: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Risk Profile Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Profile
            </label>
            <select
              value={filters.internal_risk_profile}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  internal_risk_profile: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {getUniqueValues("internal_risk_profile").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Collection Rate Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Rate
            </label>
            <select
              value={filters.collection_rate}
              onChange={(e) =>
                setFilters({ ...filters, collection_rate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {getUniqueValues("collection_rate").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Covergae Customer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coverage Customer
            </label>
            <select
              value={filters.coverage_customer}
              onChange={(e) =>
                setFilters({ ...filters, coverage_customer: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {getUniqueValues("coverage_customer").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Headquarters Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Territory
            </label>
            <select
              value={filters.headquarters}
              onChange={(e) =>
                setFilters({ ...filters, headquarters: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {getUniqueValues("headquarters")
                .sort((a, b) => {
                  const numA = parseInt(a.replace("TR", ""));
                  const numB = parseInt(b.replace("TR", ""));
                  return numA - numB;
                })
                .map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-5">
          <Button variant="outline"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
          <Button variant="primary"
            onClick={() => setShowFilterPanel(false)}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Transition>
  );
};

export default FilterPanel;