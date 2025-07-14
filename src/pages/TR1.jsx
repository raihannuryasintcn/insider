import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR1
const TR1_REPORT_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzMxYzNlNjItNWQxMy00MTMxLWIyNTYtODQ4YTk3NmEyMmM3IiwidCI6IjQ4ZGViMzAzLTE3MDItNDI5Mi1iZjIwLTE4N2M0ZTI1ZDExZiIsImMiOjEwfQ%3D%3D&pageName=d69f614993642eb31b6d";

/**
 * Halaman untuk menampilkan Laporan TR1 dari Power BI.
 */

export default function TR1Page() {
  return (
    <PowerBiReportViewer reportUrl={TR1_REPORT_URL} />
  );
}
