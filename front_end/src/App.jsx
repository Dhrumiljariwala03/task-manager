import './index.css'
import Login from './components/Login'
import Verifyemail from './components/Verifyemail'
import Verifyotp from './components/Verifyotp'
import Resetpassword from './components/Resetpassword'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import ErrorHandlePage from './components/ErrorHandlePage'
import ChangePassword from './components/ChangePassword'
import ProfilePage from './components/Profile'
import UserManagment from './components/UserManagment'
import SetPassword from './components/setPassword'

const RequireAuth = ({ children }) => {
  const token = Cookies.get("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path='/changepassword/_id' element={
            <RequireAuth>
              <ChangePassword />
            </RequireAuth>
          } />
          <Route path='/profile' element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          } />
          <Route path='/verify_email' element={<Verifyemail />} />
          <Route path='/verify_otp/:_id/:token' element={<Verifyotp />} />
          <Route path='/reset_password/:_id' element={<Resetpassword />} />
          <Route path='*' element={<ErrorHandlePage />} />
          <Route path='/setpassword' element={<SetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
