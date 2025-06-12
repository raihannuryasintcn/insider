import { useState } from 'react'
import './App.css'
import Layout from './layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TR1 from './pages/TR1'
import TR2 from './pages/TR2'
import TR3 from './pages/TR3'
import TR4 from './pages/TR4'
import ListISP from './pages/ListIsp'
import Download from './pages/Download'
import Login from './pages/Login'
import UserManagement from './UserManagement' 
import ActivityLogs from './ActivityLogs'     
import { AuthProvider, ProtectedRoute, AdminProtectedRoute } from './components/Auth' // Import AdminProtectedRoute


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path='/' element={<Home />} />
                <Route path='/tr-1' element={<TR1 />} />
                <Route path='/tr-2' element={<TR2 />} />
                <Route path='/tr-3' element={<TR3 />} />
                <Route path='/tr-4' element={<TR4 />} />
                <Route path='/list-isp' element={<ListISP />} />
                <Route path='/download' element={<Download />} />
                {/* Admin Protected Routes */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path='/user-management' element={<UserManagement />} />
                  <Route path='/activity-logs' element={<ActivityLogs />} />
                </Route>
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path='*' element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App