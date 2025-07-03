import { useState } from 'react'
import './index.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/common/Home'
import Order from './pages/user/Orders'
import LoginPage from './pages/common/Login'
import { AuthProvider } from './context/Authcontext'
import Payments from './pages/user/Payments'
import AddPayment from './pages/Admin/AddPaytemnt'
import Unauthorized from './pages/user/Unauthorized'
import ChangeUserPassword from './pages/Admin/ChangeUserPassword'
import ServiceManager from './pages/Admin/CreateService'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfilePage from './pages/user/UserProfilePage'
import UserDashboardPage from './pages/Admin/UserDashboardPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/" element={<Home/>}/>

          {/* Admin routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/addPayment" element={<AddPayment/>} />
            <Route path="/services" element={<ServiceManager/>}/>
            <Route path="/changeUserPassword" element={<ChangeUserPassword/>}/>
            <Route path="/userDashboard" element={<UserDashboardPage/>}/>
          </Route>

          {/* User routes */}
          <Route element={<ProtectedRoute requiredRole="user" />}>
            <Route path="/payments" element={<Payments/>} />
            <Route path="/orders" element={<Order/>}/>
            <Route path="/profile" element={<UserProfilePage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
