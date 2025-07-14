import PowerBiReportViewer from '../components/custom/PowerBiReportViewer';

// URL laporan Power BI untuk TR2
const TR2_REPORT_URL = "https://app.powerbi.com/view?r=eyJrIjoiYzMxYzNlNjItNWQxMy00MTMxLWIyNTYtODQ4YTk3NmEyMmM3IiwidCI6IjQ4ZGViMzAzLTE3MDItNDI5Mi1iZjIwLTE4N2M0ZTI1ZDExZiIsImMiOjEwfQ%3D%3D&pageName=22949f0e13629c39df7b";


/**
 * Halaman untuk menampilkan Laporan TR2 dari Power BI.
 */

export default function TR2Page() {
  return (
    <PowerBiReportViewer reportUrl={TR2_REPORT_URL} />
  );
}
