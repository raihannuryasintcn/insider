import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR4
const TR4_REPORT_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzMxYzNlNjItNWQxMy00MTMxLWIyNTYtODQ4YTk3NmEyMmM3IiwidCI6IjQ4ZGViMzAzLTE3MDItNDI5Mi1iZjIwLTE4N2M0ZTI1ZDExZiIsImMiOjEwfQ%3D%3D&pageName=3ab94434b1b5b9122b4b";

/**
 * Halaman untuk menampilkan Laporan TR4 dari Power BI.
 */

export default function TR4Page() {
  return (
    <PowerBiReportViewer reportUrl={TR4_REPORT_URL} />
  );
}