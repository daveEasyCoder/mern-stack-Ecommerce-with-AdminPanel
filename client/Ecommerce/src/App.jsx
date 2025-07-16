import './App.css'
import {BrowserRouter,Routes,Route, useLocation} from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Navbar from '../components/Navbar'
import ProductView from '../pages/ProductView'
import AddProduct from '../adminPages/addProduct'
import Admin from '../adminPages/Admin'
import AdminProduct from '../adminPages/AdminProduct'
import EditProduct from '../adminPages/EditProduct'
import CategoryView from '../pages/CategoryView'
import Cart from '../pages/Cart'
import Order from '../pages/Order'
import MyOrder from '../pages/MyOrder'
import Collections from '../pages/Collections'
import RegisterPage from '../pages/RegisterPage'
import Login from '../pages/Login'
function AppContent() {

   const location = useLocation();
    const hideNavbarPath = ['/admin','/register','/login'];
    const shouldHideNavbar =
    hideNavbarPath.includes(location.pathname) ||
    location.pathname.startsWith('/admin');


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
         <Route path='/admin' element={<Admin />}>
            <Route path = "add-product" element = { <AddProduct />} />
            <Route path = "product" element = { <AdminProduct />} />
            <Route path = "edit-product/:id" element = { <EditProduct />} />
         </Route>
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App
