import './App.css'
import {BrowserRouter,Routes,Route, useLocation} from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Navbar from '../components/Navbar'
import ProductView from '../pages/ProductView'
import AddProduct from '../adminPages/AddProduct'
import Admin from '../adminPages/Admin'
import Users from '../adminPages/Users'
import AdminProduct from '../adminPages/AdminProduct'
import EditProduct from '../adminPages/EditProduct'
import CategoryView from '../pages/CategoryView'
import Cart from '../pages/Cart'
import Order from '../pages/Order'
import UserOrder from '../adminPages/UserOrder'
import MyOrder from '../pages/MyOrder'
import TrackingOrder from '../pages/TrackingOrder'
import AdminLogin from '../adminPages/AdminLogin'
import RegisterAdmin from '../adminPages/RegisterAdmin'
import VerifyAdminEmail from '../adminPages/VerifyAdmin'
import AdminOrder from '../adminPages/AdminOrder'
import Collections from '../pages/Collections'
import RegisterPage from '../pages/RegisterPage'
import Login from '../pages/Login'
import VerifyEmail from '../pages/VerifyEmail'
import ChangePassword from '../pages/ChangePassword'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'

import { ToastContainer } from 'react-toastify'
import { AdminDashboard } from '../adminPages/AdminDashboard'
function AppContent() {

   const location = useLocation();
    const hideNavbarPath = ['/admin','/register','/login','/verify-email','/forgot-password','/reset-password','/verify-admin-email'];
    const shouldHideNavbar = hideNavbarPath.some(path => location.pathname.startsWith(path))


  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
         <Route path = "/" element = { <HomePage />} />
         <Route path = "/register" element = { <RegisterPage />} />
         <Route path = "/login" element = { <Login />} />
         <Route path = "/product-detail/:id" element = { <ProductView />} />
         <Route path = "/category-view/:category" element = { <CategoryView />} />
         <Route path = "/cart" element = { <Cart />} />
         <Route path = "/order" element = { <Order />} />
         <Route path = "/collections" element = { <Collections />} />
         <Route path = "/myorder" element = { <MyOrder />} />
         <Route path = "/track-order/:orderId/item/:itemId" element = { <TrackingOrder />} />
         <Route path = "/verify-email/:token" element = { <VerifyEmail />} />
         <Route path = "/change-password" element = { <ChangePassword />} />
         <Route path = "/forgot-password" element = { <ForgotPassword />} />
         <Route path = "/reset-password/:token" element = { <ResetPassword />} />
         <Route path = "/admin-login" element = { <AdminLogin />} />
         <Route path = "/admin-register" element = { <RegisterAdmin />} />
         <Route path = "/verify-admin-email/:token" element = { <VerifyAdminEmail />} />
         <Route path='/admin' element={<Admin />}>
            <Route path = "" element = { <AdminDashboard />} />
            <Route path = "add-product" element = { <AddProduct />} />
            <Route path = "product" element = { <AdminProduct />} />
            <Route path = "admin-order" element = { <AdminOrder />} />
            <Route path = "users" element = { <Users />} />
            <Route path = "user-order/:id" element = { <UserOrder />} />
            <Route path = "edit-product/:id" element = { <EditProduct />} />
         </Route>
      </Routes>
   
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AppContent />
    </BrowserRouter>
  );
}

export default App
