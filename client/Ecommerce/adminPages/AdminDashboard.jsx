import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEcommerce } from '../context/EcommerceContext'
import { useNavigate } from 'react-router-dom'
import Analytics from '../adminComponents/Analytics'

import Loader from '../components/Loader'


export const AdminDashboard = () => {

   const {admin,setAdmin,url} = useEcommerce()
   const [error,setError] = useState("")
   const [loading,setLoading] = useState(false)
   const navigate = useNavigate()

    const getProfile = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${url}/api/user/admin/me`,{withCredentials:true})
            if(res.data.success){
              setAdmin(res.data.user)
            }
            setLoading(false)
        } catch (error) {
            if(error.response){
              setLoading(false)
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
    getProfile()
  },[])



  if(error) return <div className='h-[60vh] flex items-center justify-center text-gray-700'>{error}</div>
  if(loading) return <Loader />

  return (
    <div className='pt-20 pl-72 bg-gray-100'>
    <h1 className='font-bold text-xl text-gray-800 mb-0'>Admin Dashboard</h1>
    <p className='-mt-0.5 mb-2'>welcome <span className='text-gray-700'>{admin && admin?.email && admin?.fullname}</span> </p>
    <Analytics />
    </div>
  )
}
