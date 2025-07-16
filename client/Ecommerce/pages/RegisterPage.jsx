import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const RegisterPage = () => {
  const [userInfo,setUserInfo] = useState({
    fullname:"",
    email:"",
    password:""
  })
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
      const {name, value} = e.target
      setUserInfo({
        ...userInfo,
        [name]:value.trim()
      })
  }

  const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const handleSignup = async (e) => {
      e.preventDefault()
      setError("")
      if(!userInfo.fullname){
        setError("fullname is required")
      }else if(!userInfo.email){
        setError("email is required")
      }else if(!validEmail.test(userInfo.email)){
        setError("Invalid email address")
      }else if(!userInfo.password){
        setError("password is required")
      }else if(userInfo.password.length < 6){
        setError("password length must be greater than 6 character")
      }else{
        try {
          // console.log(userInfo);
          setLoading(true)
           const res = await axios.post("http://localhost:301/api/user/register",userInfo)
           if(res.data.success){
             alert(res.data.message)
             setUserInfo({
                  fullname:"",
                  email:"",
                  password:"",
             })
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
       <div>
        <form onSubmit={handleSignup} className='bg-white shadow  p-8 rounded'>
           <h1 className='text-3xl font-bold mb-3'>Signup</h1>
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
                  <input type="password" name='password' autoCapitalize='password' onChange={handleChange} value={userInfo.password} required placeholder='password' className='w-full border tracking-wide text-sm border-gray-300 focus:outline-1.5 focus:border-0 focus:outline-indigo-400 rounded px-2 py-2' />
              </div>
            </div>
             {error &&  <p className='text-red-600 mt-2 text-sm'>{error}</p>}
            <div>
               <button type='submit' className='bg-black hover:bg-gray-800 duration-150 cursor-pointer w-full py-2 text-white  tracking-wide mt-4'>{loading ? 'signing up...' : 'Sign up'}</button>
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