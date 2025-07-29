import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader'
import defaultProfile from '../src/assets/user.jpg'
import { Link } from 'react-router-dom';

const Users = () => {

       const [users,setUsers] = useState([])
       const [error,setError] = useState("")
       const [loading,setLoading] = useState(false)
       
        const getAllUser = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${url}/api/user/get-all-users`,{withCredentials:true})
            if(res.data.success){
              setUsers(res.data.users)
            }
             setLoading(false)
        } catch (error) {
            setLoading(false)
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    console.log("you are not authorized")
                    setAdmin(null)
                    navigate("/admin-login")
                }
              if(error.response.data.message){
                console.log(error.response.data.message);    
                setError(error.response.data.message)
              }
            }else{
                console.log(error);
                setError("Internal server error")
            }
        }
  }
  
  useEffect(() => {
     getAllUser()
  },[])

  if(loading) return <Loader />
  if(error) return <div className='h-[60vh] flex items-center justify-center text-gray-700'>{error}</div>


  return (
    <div className='pt-22 pl-17 md:ml-50 min-h-screen bg-gray-100 px-2'>
        <div className='max-w-4xl border border-gray-300 p-4 bg-white'>
            <h1 className='text-xl font-bold mb-2'>Users Profile</h1>
            <div className='hidden sm:grid grid-cols-4 bg-gray-100 py-2 mb-2'>
                <div>Image</div>
                <div>full name</div>
                <div>Email</div>
                <div className='text-center'>Role</div>
            </div>
            {
                users && users.length ? 
                 users.map((user,index) => (
                    <div key={index} className={`flex flex-col gap-2 sm:grid sm:grid-cols-4 ${index % 2 === 0 && 'bg-gray-100'} sm:bg-white px-2 rounded sm:hover:bg-gray-100  py-2 sm:items-center`}>
                        <div className='flex items-center gap-2'>
                            <img className='h-20 w-20 sm:h-10 sm:w-10 rounded-full' src={defaultProfile} alt="" />
                        </div>
                        <div className='flex gap-2 items-center'>
                            <p className='sm:hidden text-sm'>Full Name:</p>
                            <Link to={`/admin/user-order/${user._id}`} className='text-sm text-blue-700 underline'>{user?.fullname}</Link>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <p className='sm:hidden text-sm'>Email</p>
                            <p className='text-sm'>{user.email}</p>
                        </div>
                        <div className='flex sm:justify-center'>
                            <p className={`text-xs font-semibold px-2 py-1 rounded-lg ${user.role === 'user' ? 'bg-yellow-100 px-3' : 'bg-blue-200 text-gray-800 '}`}>{user.role}</p>
                        </div>
                    </div>
                 ))
                : <div>No user yet</div>
            }
        </div>
    </div>
  )
}

export default Users