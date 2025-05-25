import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import from react-router-dom
import LogIn from "./pages/AuthPages/LogIn";
import NotFound from "./pages/OtherPage/NotFound";
// @ts-ignore
import UserManagement from "./components/UserManagement"
// @ts-ignore
import ActivityLogs from "./components/ActivityLogs"

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
// @ts-ignore
import Maps from "./pages/Dashboard/Maps";
// @ts-ignore
import TR1 from "./pages/Dashboard/TR1";
// @ts-ignore
import TR2 from "./pages/Dashboard/TR2";
// @ts-ignore
import TR3 from "./pages/Dashboard/TR3";
// @ts-ignore
import TR4 from "./pages/Dashboard/TR4";
// @ts-ignore
import QuerySearch from "./pages/Dashboard/QuerySearch";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthProvider and useAuth
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute
import Download from "./pages/Dashboard/Download";
// Biasanya di src/index.js atau App.js
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <AppRoutes /> {/* Render AppRoutes component */}
      </AuthProvider> {/* Close AuthProvider */}
    </>
  );
}

function AppRoutes() {
  const { isLoading } = useAuth(); // Get isLoading state

  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Maps />} />
            <Route index path="/tr1" element={<TR1 />} />
            <Route index path="/tr2" element={<TR2 />} />
            <Route index path="/tr3" element={<TR3 />} />
            <Route index path="/tr4" element={<TR4 />} />

            {/* Others Page */}
            <Route path="/querysearch" element={<QuerySearch />} />
            <Route path="/download" element={<Download />} />

            {/* Admin Routes */}
            <Route path="/usermanagement" element={<UserManagement />} /> {/* Add User Management route */}
            <Route path="/activitylogs" element={<ActivityLogs />} /> {/* Add User Management route */}
            

          </Route>
        </Route>

        {/* Auth Layout */}
        <Route path="/login" element={<LogIn />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
