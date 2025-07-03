import Layout from './Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import TR1Page from './pages/TR1';
import TR2Page from './pages/TR2';
import TR3Page from './pages/TR3';
import TR4Page from './pages/TR4';
import ListIspPage from './pages/ListIsp';
import DownloadPage from './pages/Download';
import LoginPage from './pages/Login';
import UserManagementPage from './pages/UserManagement';
import ActivityLogsPage from './pages/ActivityLogs';   
import FunnelPage from './pages/Funnel'; 
import { AuthProvider, ProtectedRoute, AdminProtectedRoute } from './auth/Auth';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/tr1' element={<TR1Page />} />
                <Route path='/tr2' element={<TR2Page />} />
                <Route path='/tr3' element={<TR3Page />} />
                <Route path='/tr4' element={<TR4Page />} />
                <Route path='/list-isp' element={<ListIspPage />} />
                <Route path='/download' element={<DownloadPage />} />
                <Route path='/funnel' element={<FunnelPage />} />

                {/* Admin Protected Routes */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path='/user-management' element={<UserManagementPage />} />
                  <Route path='/activity-logs' element={<ActivityLogsPage />} />
                </Route>

              </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path='*' element={<LoginPage />} /> {/* Redirect ke login jika rute tidak ditemukan */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;