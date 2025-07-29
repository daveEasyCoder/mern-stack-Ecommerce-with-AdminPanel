import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { LuPackage } from 'react-icons/lu';
import { FaShoppingCart,FaEye, FaUser } from 'react-icons/fa'
import axios from 'axios';
import { useEcommerce } from '../context/EcommerceContext';
import { useState } from 'react';

const Admin = () => {

    const {setAdmin,url} = useEcommerce()
    const navigate = useNavigate()

    const [activeIndex,setActiveIndex] = useState(0)

    const dashboardicon = (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z" />
        </svg>
    );

    const overviewicon = (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Zm0-3.556h.009m7.933-10.927 3.143 3.143a.889.889 0 0 1 0 1.257l-7.974 7.974v-8.8l3.574-3.574a.889.889 0 0 1 1.257 0Z" />
        </svg>
    );

    const sidebarLinks = [
        { name: "Dashboard", path: "/admin", icon: dashboardicon },
        { name: "addProduct", path: "add-product", icon: overviewicon },
        { name: "Products", path: "product", icon: <LuPackage /> },
        { name: "Orders", path: "admin-order", icon: <LuPackage /> },
        { name: "Users", path: "users", icon: <FaUser /> },
    ];

      const handleLogout = async () => {
            try {
                const res = await axios.post(`${url}/api/user/logout`,{},{withCredentials:true})
                if(res.data.success){
                    setAdmin(null)
                    navigate("/login")
                }
            } catch (error) {
                console.log(error);
                
            }
        }

  

  return (
    <div className=''>
        <div className=''>
             <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-600">
                        <FaShoppingCart /> ShopSwift
                    </h1>  
                </div>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button onClick={handleLogout} className='border cursor-pointer rounded-full text-sm px-4 py-1'>Logout</button>
                </div>
            </div>
            <div className="fixed left-0 top-14 bg-white md:w-64 w-16 border-r h-[100vh] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                {sidebarLinks.map((item, index) => (
                    <Link onClick={() => setActiveIndex(index)} to={item.path} key={index}
                        className={`flex items-center py-3 px-4 gap-3 
                            ${index === activeIndex ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                                : "hover:bg-gray-100/90 border-white text-gray-700"
                            }`
                        }
                    >
                        {item.icon}
                        <p className="md:block hidden text-center">{item.name}</p>
                    </Link>
                ))}
            </div>
        </div>
        <Outlet />
    </div>

  )
}

export default Admin

