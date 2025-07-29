import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEcommerce } from '../context/EcommerceContext'
const Profile = ({setShowProfile}) => {

  const {setUser,user,url} = useEcommerce()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
        const res = await axios.post(`${url}/api/user/logout`,{},{withCredentials:true})
        if(res.data.success){
            setUser(null)
            navigate("/login")
        }
    } catch (error) {
        console.log(error);
        
    }
  }
  
  return (
    <div className='absolute top-8 right-0 bg-gray-100 border border-gray-200 rounded-lg shadow p-3 whitespace-nowrap flex flex-col  gap-y-3'>
        <div className='text-center bg-gray-200 p-8 rounded-lg'>
             <button className='h-12 w-12 rounded-full bg-red-500 text-white text-2xl mb-1'> {user?.fullname.slice(0,1).toUpperCase()}</button>
             <p className='font-sans font-semibold'>{user?.fullname}</p>
             <p className='text-sm text-gray-800 font-sans'>{user?.email}</p>
        </div>
        <div className='flex flex-col px-4 gap-3'>
           <button onClick={handleLogout} className='text-sm font-light cursor-pointer hover:bg-red-700 duration-150 bg-red-600 text-white  py-1 rounded'>Logout</button>
           <Link onClick={() => setShowProfile(false)} className='text-sm text-center font-light border border-gray-300 px-3 py-1 rounded' to = "/change-password">Change password</Link>
        </div>
    </div>
  )
}

export default Profile