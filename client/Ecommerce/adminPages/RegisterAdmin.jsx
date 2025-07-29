import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaEye,FaEyeSlash } from 'react-icons/fa'
import { useState } from 'react'
import {toastError, toastSuccess} from '../utility/toast.js'
import { useEcommerce } from '../context/EcommerceContext.jsx'

const RegisterAdmin = () => {

    const {url} = useEcommerce()
    const [adminInfo,setAdminInfo] = useState({
        fullname:"",
        email:"",
        password:"",
        secretCode:""
    })
      const [message,setMessage] = useState("")
      const [error,setError] = useState("")
      const [loading,setLoading] = useState(false)
      const [showPassword,setShowPassword] = useState(false)


          const handleChange = (e) => {
            const {name, value} = e.target
            setAdminInfo({
            ...adminInfo,
            [name]:value
            })
        }

      const handleSignin = async (e) => {
         e.preventDefault()
         setError("")
         setMessage("")
         if(!adminInfo.fullname){
            setError("Full Name required")
         }else if(!adminInfo.email){
             setError(" Email is required")
         }else if(!adminInfo.password){
             setError("Password is required")
         }else if(!adminInfo.secretCode){
            setError("Secret code is required")
         } else{
            try {
                setLoading(true)
                const res = await axios.post(`${url}/api/admin/admin-register`,adminInfo)
                if(res.data.success){
                  setMessage(res.data.message)
                  toastSuccess("Admin Registered Succesffully")
                  setAdminInfo({
                        fullname:"",
                        email:"",
                        password:"",
                        secretCode:""
                  })
                }
                 setLoading(false)
            } catch (error) {
               setLoading(false)
              if(error.response){
                 if(error.response.data.message){
                    toastError(error.response.data.message)
                 }
              }else{
                setError("Server is not responding! try again.")
              }
            }
            
         }
      }
  return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
              <div className='flex-1 max-w-xl m-2'>
               <form onSubmit={handleSignin} className='bg-white shadow  p-8 rounded'>
                  <h1 className='text-3xl font-bold mb-1'>Welcome Admin!</h1>
                  <p className='font-semibold mb-4 mt-0'>Signup below</p>
                   <div className='flex flex-col gap-3'>
                      <div>
                         <label htmlFor="fullname" className=' text-gray-600'>Fullname:</label>
                         <input type="fullname" name='fullname' autoComplete='fullname' onChange={handleChange}  value={adminInfo.fullname}  placeholder='Enter fullname' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
                     </div>
                      <div>
                         <label htmlFor="email" className=' text-gray-600'>Email:</label>
                         <input type="email" name='email' autoComplete='email' onChange={handleChange}  value={adminInfo.email}  placeholder='email' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
                     </div>
                      <div>
                         <label htmlFor="password" className=' text-gray-600'>Password:</label>
                           <div className='relative'>
                             <input type={showPassword ? 'text' : 'password'} name='password' autoCapitalize='password' onChange={handleChange} value={adminInfo.password}  placeholder='password' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
                              {showPassword ? <FaEye onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' /> :
                                              <FaEyeSlash onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' /> 
                              }
                             </div>
                     </div>
                      <div>
                         <label htmlFor="email" className=' text-gray-600'>Admin Secret code:</label>
                         <input type="text" name='secretCode' autoComplete='secretCode' onChange={handleChange}  value={adminInfo.secretCode}  placeholder='Enter secret code' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
                     </div>
                   </div>
                    {error &&  <p className='text-red-600 mt-2 text-sm'>{error}</p>}
                   <div>
                     {message && <p className='text-sm text-blue-700'>{message}</p>}
                      <button type='submit' disabled = {loading} className={`bg-yellow-500 ${loading ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'} hover:bg-yellow-600 duration-150  w-full py-2  tracking-wide mt-4`}>{loading ? 'signing up...' : 'Signup'}</button>
                   </div>
               </form>
              </div>
           </div>
  )
}

export default RegisterAdmin