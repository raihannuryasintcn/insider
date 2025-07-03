import React from 'react';

/**
 * Komponen reusable untuk menampilkan laporan Power BI dalam iframe.
 *
 * @param {object} props - Properti komponen.
 * @param {string} props.reportUrl - URL embed laporan Power BI.
 */

const PowerBiReportViewer = ({ reportUrl }) => {
  return (
    <div className="w-full aspect-[16/10.7] pb-4">
      <iframe
        src={reportUrl}
        className="w-full h-full border-0 rounded-lg"
        allowFullScreen="true"
        style={{ touchAction: "none" }}
        title="Power BI Report" // Menambahkan title untuk aksesibilitas
      ></iframe>
    </div>
  );
};

export default PowerBiReportViewer;