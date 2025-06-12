import ExcelJS from 'exceljs';

export const exportISPDataToExcel = async (dataToExport, filename = 'ISP_Data') => {
  if (!dataToExport || dataToExport.length === 0) {
    alert("No data available to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("ISP Data");

  // Define columns
  worksheet.columns = [
    { header: "No.", key: "no", width: 8 },
    { header: "Registered ISP", key: "registered_kominfo_isp", width: 20 },
    { header: "Legal Name", key: "legal_name", width: 30 },
    // { header: "ASN Number", key: "asn_number", width: 15 },
    { header: "Headquarters", key: "headquarters", width: 20 },
    { header: "JARTUP", key: "is_jartup", width: 10 },
    { header: "JARTAPLOK", key: "is_jartaplok", width: 10 },
    { header: "Risk Profile", key: "internal_risk_profile", width: 15 },
    { header: "Collection Rate", key: "collection_rate", width: 15 },
    { header: "Coverage", key: "coverage_customer", width: 15 },
    { header: "Province", key: "province", width: 15 },
    // { header: "Address", key: "address", width: 30 },
    // { header: "Phone", key: "phone", width: 15 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Add data
  dataToExport.forEach((isp, index) => {
    worksheet.addRow({
      no: index + 1,
      registered_kominfo_isp: isp.registered_kominfo_isp || "N/A",
      legal_name: isp.legal_name || "N/A",
      // asn_number: isp.asn_number || "N/A",
      headquarters: isp.headquarters || "N/A",
      is_jartup: isp.is_jartup ? "Yes" : "No",
      is_jartaplok: isp.is_jartaplok ? "Yes" : "No",
      internal_risk_profile: isp.internal_risk_profile || "N/A",
      collection_rate: isp.collection_rate || "N/A",
      coverage_customer: isp.coverage_customer || "N/A",
      province: isp.province || "N/A",
      // address: isp.address || "N/A",
      // phone: isp.phone || "N/A",
    });
  });

  // Generate and download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};