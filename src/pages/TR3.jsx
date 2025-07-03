import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR3
const TR3_REPORT_URL = "https://app.powerbi.com/reportEmbed?reportId=ebdc0433-5caa-42bb-8fe6-a0af65ec0da4&autoAuth=true&ctid=48deb303-1702-4292-bf20-187c4e25d11f&pageName=418346787d7d21134f08";

/**
 * Halaman untuk menampilkan Laporan TR3 dari Power BI.
 */

export default function TR3Page() {
  return (
    <PowerBiReportViewer reportUrl={TR3_REPORT_URL} />
  );
}