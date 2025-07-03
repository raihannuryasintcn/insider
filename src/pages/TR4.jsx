import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR4
const TR4_REPORT_URL = "https://app.powerbi.com/reportEmbed?reportId=ebdc0433-5caa-42bb-8fe6-a0af65ec0da4&autoAuth=true&ctid=48deb303-1702-4292-bf20-187c4e25d11f&pageName=3ab94434b1b5b9122b4b";

/**
 * Halaman untuk menampilkan Laporan TR4 dari Power BI.
 */

export default function TR4Page() {
  return (
    <PowerBiReportViewer reportUrl={TR4_REPORT_URL} />
  );
}