import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR1
const TR1_REPORT_URL = "https://app.powerbi.com/reportEmbed?reportId=ebdc0433-5caa-42bb-8fe6-a0af65ec0da4&autoAuth=true&ctid=48deb303-1702-4292-bf20-187c4e25d11f&pageName=d69f614993642eb31b6d";

/**
 * Halaman untuk menampilkan Laporan TR1 dari Power BI.
 */

export default function TR1Page() {
  return (
    <PowerBiReportViewer reportUrl={TR1_REPORT_URL} />
  );
}
