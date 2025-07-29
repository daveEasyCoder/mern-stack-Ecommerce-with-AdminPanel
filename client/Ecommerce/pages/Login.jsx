import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye,FaEyeSlash } from 'react-icons/fa'
import { useEcommerce } from '../context/EcommerceContext'

const Login = () => {
  
  const {url} = useEcommerce()
  const [userInfo,setUserInfo] = useState({
    email:"",
    password:"",
  })
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)
  const [showPassword,setShowPassword] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
      const {name, value} = e.target
      setUserInfo({
        ...userInfo,
        [name]:value.trim()
      })
  }

  const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const handleSignin = async (e) => {
      e.preventDefault()
      setError("")
      if(!userInfo.email){
        setError("email is required")
      }else if(!validEmail.test(userInfo.email)){
        setError("Invalid email address")
      }else if(!userInfo.password){
        setError("password is required")
      }else{
        try {
          // console.log(userInfo);
          setLoading(true)
           const res = await axios.post(`${url}/api/user/login`,userInfo,{withCredentials:true})
           if(res.data.success){
             setUserInfo({
              email:"",
              password:""
             })
             localStorage.setItem("user",JSON.stringify(res.data.user))
             navigate("/")
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
      <Link to = '/admin-login' className='absolute top-3.5 right-8'>Admin</Link>
       <div className='flex-1 max-w-xl m-2'>
        <form onSubmit={handleSignin} className='bg-white shadow  p-8 rounded'>
           <h1 className='text-3xl font-bold mb-3'>Signin</h1>
            <div className='flex flex-col gap-3'>
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
            <div>
               <button type='submit' disabled = {loading} className={`bg-yellow-400 ${loading ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'} hover:bg-yellow-500 duration-150 mb-1 w-full py-2 text-black  tracking-wide mt-4`}>{loading ? 'signing in...' : 'Signin'}</button>
                <Link to="/forgot-password" className='text-sm text-blue-700'>Forgot Password?</Link>
            </div>
             <div className='flex items-center gap-3 w-full mt-3'>
                 <span className='bg-gray-100 w-[45%] h-0.5 rounded-full'></span>
                 <span>or</span>
                <span className='bg-gray-100 w-[45%] h-0.5 rounded-full'></span>
             </div>
             <div>
               <button onClick={() => navigate("/register")} className=' w-full py-2 border cursor-pointer border-gray-300 hover:bg-gray-200 duration-300 tracking-wide mt-4'>Signup</button>
            </div>
        </form>
       </div>
    </div>
  )
}

export default Login