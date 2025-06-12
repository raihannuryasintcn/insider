import React, { useState, memo } from "react";
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  PhoneIcon,
  MapPinIcon,
  ChartBarIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

const ISPTable = memo(({ filteredISP }) => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-white/[0.05]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registered ISP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coverage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Territory
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-white/[0.03] dark:divide-gray-800">
          {filteredISP.map((isp, index) => (
            <React.Fragment key={isp.id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white/90">
                  {isp.registered_kominfo_isp || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {isp.coverage_customer || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {isp.headquarters || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === isp.id ? null : isp.id)
                    }
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                  >
                    {expandedId === isp.id ? "Hide Details" : "Show Details"}
                  </button>
                </td>
              </tr>
              {expandedId === isp.id && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Company Information */}
                          <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center dark:text-white/90">
                              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                              Company Information
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Legal Name
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.legal_name || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Territory
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.headquarters || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Address
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.address || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Registration Details */}
                          <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center dark:text-white/90">
                              <IdentificationIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                              Registration Details
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  ASN Number
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.asn_number || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  BP Number
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.bp_number || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Structured ID
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.structured_id || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center dark:text-white/90">
                              <PhoneIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                              Contact Information
                            </h3>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Phone
                              </p>
                              <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                {isp.phone || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* Service Status */}
                          <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center dark:text-white/90">
                              <DocumentCheckIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                              Service Status
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  JARTUP
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.is_jartup ? "Yes" : "No"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  JARTAPLOK
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.is_jartaplok ? "Yes" : "No"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Kominfo ISP
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.is_kominfo_isp ? "Yes" : "No"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Customer
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.is_customer ? "Yes" : "No"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center dark:text-white/90">
                              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                              Performance Metrics
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Risk Profile
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.internal_risk_profile || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Collection Rate
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.collection_rate || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Customer Coverage
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.coverage_customer || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Location Information */}
                          <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-white/[0.03]">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center dark:text-white/90">
                              <MapPinIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                              Location Information
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Province
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.province || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Coverage Lists
                                </p>
                                <p className="text-sm text-gray-900 mt-1 dark:text-white/90">
                                  {isp.coverage_lists || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ISPTable;