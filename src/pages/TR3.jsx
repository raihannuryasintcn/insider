import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR3
const TR3_REPORT_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzMxYzNlNjItNWQxMy00MTMxLWIyNTYtODQ4YTk3NmEyMmM3IiwidCI6IjQ4ZGViMzAzLTE3MDItNDI5Mi1iZjIwLTE4N2M0ZTI1ZDExZiIsImMiOjEwfQ%3D%3D&pageName=418346787d7d21134f08";

/**
 * Halaman untuk menampilkan Laporan TR3 dari Power BI.
 */

export default function TR3Page() {
  return (
    <PowerBiReportViewer reportUrl={TR3_REPORT_URL} />
  );
}