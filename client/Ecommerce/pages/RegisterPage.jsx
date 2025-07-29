import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toastSuccess } from '../utility/toast'
import { FaEye,FaEyeSlash } from 'react-icons/fa'
import { useEcommerce } from '../context/EcommerceContext'

const RegisterPage = () => {

  const {url} = useEcommerce()
  const [userInfo,setUserInfo] = useState({
    fullname:"",
    email:"",
    password:""
  })
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)
  const [successMessage,setSuccessMessage] = useState(false)
  const [showPassword,setShowPassword] = useState(false)

  const navigate = useNavigate()
  const handleChange = (e) => {
      const {name, value} = e.target
      setUserInfo({
        ...userInfo,
        [name]:value
      })
  }


  const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const handleSignup = async (e) => {
      e.preventDefault()
      setError("")
      setSuccessMessage(false)
      const name = userInfo.fullname.trim().split(" ")
      if(!userInfo.fullname){
        setError("fullname is required")
      }else if(name.length < 2){
         setError("fullname is required")
      } else if(!userInfo.email){
        setError("email is required")
      }else if(!validEmail.test(userInfo.email)){
        setError("Invalid email address")
      }else if(!userInfo.password){
        setError("password is required")
      }else if(userInfo.password.length < 6){
        setError("password length must be greater than 6 character")
      }else if(!/[A-Z]/.test(userInfo.password)){
          setError("Password should contain upperCase")
      }else if(!/[0-9]/.test(userInfo.password)){
          setError("Password should contain Number")
      }else if(!/[\W_]/.test(userInfo.password)){
        setError("Password should contain Special Character")
      } else{
        try {

          setLoading(true)
           const res = await axios.post(`${url}/api/user/register`,userInfo)
           if(res.data.success){
            toastSuccess('Registration successful!.');
             setUserInfo({
                  fullname:"",
                  email:"",
                  password:"",
             })
             setSuccessMessage(true)
           }
           setLoading(false)
        } catch (err) {
          setLoading(false)
          if(err.response){
             if(err.response.data.message){
              console.log(err.response.data.message)
              setError(err.response.data.message)
             }else{
              console.log(err)
             }
          }else{
            console.log(err)
            setError("Server is not responding. try later!")
          }
        }
      }
  }
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
       <div className='flex-1 max-w-xl m-2'>
        <form onSubmit={handleSignup} className='bg-white shadow  p-8 rounded '>
           <h1 className='text-3xl font-bold'>Welcome back!</h1>
           <p className='mb-4 text-gray-900'>Create Account below</p>
            <div className='flex flex-col gap-3'>
               <div>
                  <label htmlFor="full name" className=' text-gray-600'>Full Name:</label>
                  <input type="text" name='fullname' autoComplete='fullname' onChange={handleChange} value={userInfo.fullname} required placeholder='fullname' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
              </div>
               <div>
                  <label htmlFor="email" className=' text-gray-600'>Email:</label>
                  <input type="email" name='email' autoComplete='email' onChange={handleChange}  value={userInfo.email} required placeholder='email' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
              </div>
               <div>
                  <label htmlFor="password" className=' text-gray-600'>Password:</label>
                  <div className='relative'>
                      <input type={showPassword ? 'text' : 'password'} name='password' autoCapitalize='password' onChange={handleChange} value={userInfo.password} required placeholder='password' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
                      {showPassword ? <FaEye onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' /> :
                                      <FaEyeSlash onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' /> 
                      }
                  </div>
              </div>
            </div>
             {error &&  <p className='text-red-600 mt-2 text-sm'>{error}</p>}
             {successMessage &&  <p className='text-blue-600 mt-2 text-sm'>Registration successful! Please verify your email to activate your account</p>}
            <div>
               <button type='submit' disabled = {loading} className={`bg-yellow-400 hover:bg-yellow-500 text-black duration-150 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} w-full py-2  tracking-wide mt-4`}>{loading ? 'signing up...' : 'Sign up'}</button>
            </div>
             <div className='flex items-center gap-3 w-full mt-3'>
                 <span className='bg-gray-100 w-[45%] h-0.5 rounded-full'></span>
                 <span>or</span>
                <span className='bg-gray-100 w-[45%] h-0.5 rounded-full'></span>
             </div>
             <div>
               <button onClick={() => navigate("/login")} type='button' className=' w-full py-2 border cursor-pointer border-gray-300 hover:bg-gray-200 duration-300 tracking-wide mt-4'>Signin</button>
            </div>
        </form>
       </div>
    </div>
  )
}

export default RegisterPage