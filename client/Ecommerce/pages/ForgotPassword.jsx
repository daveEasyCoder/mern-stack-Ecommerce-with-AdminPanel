import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEcommerce } from '../context/EcommerceContext'

const ForgotPassword = () => {

    const {url} = useEcommerce()
    const [email,setEmail] = useState("")
    const [error,setError] = useState("")
    const [successMsg,setSuccessMsg] = useState("")
    const [loading,setLoading] = useState(false)

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccessMsg("")
        if(!email){
            setError("Email is required")
        }else if(!emailRegex.test(email)){
           setError("Invalid email address")
        }else{
           try {
              setLoading(true)
               const res = await axios.post(`${url}/api/user/forgot-password`,{email})
               if(res.data.success){
                 setSuccessMsg(res.data.message)
               }
               setLoading(false)
           } catch (error) {
             if(error.response){
                 setLoading(false)
                 if(error.response.data.message){
                  setError(error.response.data.message)
                 }else{
                   setError("Something went wrong. try later!")
                 }
             }else{
              setError("Server not responding!")
             }
           }
            
        }
    }
  return (
     <form onSubmit={handleSubmit} className='min-h-screen flex items-center justify-center bg-gray-100'>
           <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow shadow-black/10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Forget Password?</h2>
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} id="email" className="w-full border mt-1 border-gray-500/30 focus:border-indigo-500 outline-none rounded py-2.5 px-4" type="email" placeholder="Enter your email" />
            <button type="submit" className={`w-full my-3 active:scale-95 transition py-2.5 rounded text-white bg-yellow-500 hover:bg-yellow-600 duration-300 cursor-pointer`}>{loading ? 'loading...' : 'Send Email'}</button>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            {successMsg && <p className='text-sm text-green-700'>{successMsg}</p>}
            <p className="text-center mt-4">Don’t have an account? <Link to = "/register" className="text-blue-500 underline">Signup Now</Link></p>
        </div>
     </form>
  )
}

export default ForgotPassword