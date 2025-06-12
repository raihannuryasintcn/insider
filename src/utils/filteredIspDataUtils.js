import { useMemo } from "react";

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

export default useFilteredISPData;