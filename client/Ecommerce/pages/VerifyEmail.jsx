import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios'
import { useEcommerce } from '../context/EcommerceContext'
const VerifyEmail = () => {
    const {token} = useParams()
    const {url} = useEcommerce()
    const[isVerified,setIsVerified] = useState(false)
    const[loading,setLoading] = useState(false)
    const [error,setError] = useState("")
    const verifyEmail = async () => {
        try {
          setLoading(true)
           const res = await axios.get(`${url}/api/user/verify-email/${token}`)
           if(res.data.success){
            
              setIsVerified(true)

           }
           setLoading(false)
        } catch (error) {
          setLoading(false)
            if(error.response){
                if(error.response.data.message){
                  setError(error.response.data.message)
                }
            }else{
                setError(error.message)
            }
        }
    }
    useEffect(() => {
      verifyEmail()
    },[])

    if(loading) return <div className='h-[90vh] flex items-center justify-center flex-col'><SyncLoader className="text-gray-800" size={10} />verifying...</div>
    if(error) return <div className='h-[90vh] flex items-center justify-center flex-col text-gray-700'>{error}</div>
  return (
    <div className='min-h-screen flex items-center justify-center'>
       <div>
          {
            isVerified ?
                  <div className='text-center flex flex-col items-center'>
                     <FaCheckCircle className="text-green-600 text-6xl mb-4" />
                      <p className='text-3xl text-gray-700 leading-0.5 mb-6'>Verified Successfully</p>
                      <Link to= "/login" className='bg-green-700 rounded text-white text-sm px-5 py-1 cursor-pointer hover:bg-green-800 duration-150'>Login</Link>
                  </div> :
                  <div className='text-center font-semibold text-gray-700'>
                      <p className='text-3xl'>Your are not verified</p>
                      <p className='text-lg text-gray-600'>try later!</p>
                  </div>
          }
       </div>
    </div>
  )
}

export default VerifyEmail