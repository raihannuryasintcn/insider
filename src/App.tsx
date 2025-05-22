import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import from react-router-dom
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
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
import AdminPanel from "./pages/Admin/AdminPanel"; // Import AdminPanel component
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute
import Download from "./pages/Dashboard/Download";

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
            <Route path="/blank" element={<Blank />} />
            
            {/* Admin Routes */}
            <Route path="/adminpanel" element={<AdminPanel />} /> {/* Add User Management route */}
          </Route>
        </Route>

        {/* Auth Layout */}
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
