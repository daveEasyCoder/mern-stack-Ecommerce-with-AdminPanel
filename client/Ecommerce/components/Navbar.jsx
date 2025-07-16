import React from 'react'
import { FiHome, FiInfo, FiPhone, FiSearch } from 'react-icons/fi';
import { HiOutlineShoppingCart } from 'react-icons/hi';

import { MdStore } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useEcommerce } from '../context/EcommerceContext';
const Navbar = () => {

  const {carts} = useEcommerce()
  let user = localStorage.getItem("user")
  if(user) {
    user = JSON.parse(user)
  }
  return (
       <nav className="fixed top-0 z-50 w-full border-b border-b-gray-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-18">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to = "/" className="text-2xl font-bold text-yellow-400">
                Ecomm
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <FiHome className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/collections"
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <MdStore className="h-4 w-4" />
                <span>Collections</span>
              </Link>
              <Link
               to="/add-product"
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <FiInfo className="h-4 w-4" />
                <span>About</span>
              </Link>
              <a
                href="#"
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <FiPhone className="h-4 w-4" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className=" flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          {/* right icons */}
          <div className='flex items-center gap-7'>
           <Link to = "/cart" className="relative">
                <HiOutlineShoppingCart className="h-5 w-5" />
                 <div
                    className="absolute -top-2 -right-3.5 bg-red-500 rounded-full text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                   <span>{carts && carts.length > 0 ? carts.length : 0}</span>
                 </div>
                
             </Link>
             {user && user.id && <button className='h-8 w-8 rounded-full bg-gray-200 font-bold'>{user.fullname.slice(0,1).toUpperCase()}</button>}
          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar