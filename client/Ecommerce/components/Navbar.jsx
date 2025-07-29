import React, { useState } from 'react'
import { FiHome, FiInfo, FiSearch } from 'react-icons/fi';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { MdStore } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useEcommerce } from '../context/EcommerceContext';
import { FaShoppingCart, FaUser  } from 'react-icons/fa';
import Profile from './Profile';

const Navbar = () => {

  const {carts,user} = useEcommerce()
  const [showProfile,setShowProfile] = useState(false)
  const [showSidebar,setShowSidebar] = useState(false)

  const handleCloseSidebar = () => {
    setShowSidebar(false)
  }

  return (
       <nav className="fixed top-0 z-50 w-full border-b border-b-gray-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex  items-center  gap-2 flex-shrink-0">
              <p onClick={() => setShowSidebar(prev => !prev)} className='md:hidden relative z-20 flex justify-end pr-4 font-bold'>{showSidebar ? 'X' : 'O'}</p>
              <Link to = "/" className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
               <FaShoppingCart className='hidden md:block' /> 
               <span>ShopSwift</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline lg:space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-900 hover:text-yellow-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span>Home</span>
              </Link>
              <Link
                to="/collections"
                className="flex items-center space-x-1 text-gray-600 hover:text-yellow-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span>Collections</span>
              </Link>
         
                <Link
                  to="/myorder"
                  className="flex items-center space-x-1 text-gray-600 hover:text-yellow-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span className='whitespace-nowrap'>My Orders</span>
              </Link>
                <Link
                  to="/admin-login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-yellow-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                <span>Admin</span>
              </Link>
            </div>
          </div>



             {/* Mobile Navigation */}
          <div className={`block md:hidden bg-yellow-600 absolute top-0 right-[100%] ${showSidebar ? 'translate-x-full' : 'translate-x-0'}  duration-150 pt-12 min-h-screen w-[175px]`}>
            {/* <p onClick={() => setShowSidebar(false)} className='flex justify-end pr-4 font-bold text-white'>X</p> */}
            <div className="flex flex-col items-baseline text-white font-sans">
              <Link
                onClick={handleCloseSidebar}
                to="/"
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors"
              >
                <FiHome className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                onClick={handleCloseSidebar}
                to="/collections"
                className="flex items-center space-x-1  px-3 py-2 text-sm font-medium transition-colors"
              >
                <MdStore className="h-4 w-4" />
                <span>Collections</span>
              </Link>
         
                <Link
                  onClick={handleCloseSidebar}
                  to="/myorder"
                  className="flex items-center space-x-1  px-3 py-2 text-sm font-medium transition-colors"
              >
                <FaShoppingCart className="h-4 w-4" />
                <span className='whitespace-nowrap'>My Orders</span>
              </Link>
                <Link
                  onClick={handleCloseSidebar}
                  to="/admin-login"
                  className="flex items-center space-x-1  px-3 py-2 text-sm font-medium transition-colors"
              >
                <FaUser className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>

       
       
          {/* right icons */}
          <div className='flex items-center gap-7'>
             {/* Search Bar */}
            <div className="relative"> 
              <button className='border border-gray-200 p-2 rounded-full'>
                  <FiSearch className="h-4 w-4 text-gray-500" />
              </button> 
            </div>

           <Link to = "/cart" className="relative">
                <HiOutlineShoppingCart className="h-5 w-5" />
                 <div
                    className="absolute -top-2 -right-3.5 bg-red-500 rounded-full text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                   <span>{carts && carts.length > 0 ? carts.length : 0}</span>
                 </div>
                
             </Link>
             {user && user._id ?
                <div className='relative'>
                  <button onClick={() => setShowProfile(prev => !prev)} className='h-8 w-8 rounded-full bg-gray-200 font-bold'> {user.fullname.slice(0,1).toUpperCase()}</button>
                 { showProfile && <Profile setShowProfile = {setShowProfile} />}
                </div> :
                <Link to = '/register' className='bg-yellow-500 rounded px-3 py-1 hover:bg-yellow-600 duration-300 text-sm'>Register</Link>
               }
          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar