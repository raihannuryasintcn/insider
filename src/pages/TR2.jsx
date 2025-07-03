import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR2
const TR2_REPORT_URL = "https://app.powerbi.com/reportEmbed?reportId=ebdc0433-5caa-42bb-8fe6-a0af65ec0da4&autoAuth=true&ctid=48deb303-1702-4292-bf20-187c4e25d11f&pageName=22949f0e13629c39df7b";

/**
 * Halaman untuk menampilkan Laporan TR2 dari Power BI.
 */

export default function TR2Page() {
  return (
    <PowerBiReportViewer reportUrl={TR2_REPORT_URL} />
  );
}
