import React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {toastSuccess} from '../utility/toast.js'
import { useEcommerce } from '../context/EcommerceContext.jsx'
const ResetPassword = () => {

    const {token} = useParams()
    const {url} = useEcommerce()
    const [password,setPassword] = useState({
        newPassWord:"",
        confirmNewPassWord:""
    })
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name,value} = e.target
        setPassword({
            ...password,
            [name]:value
        })
    }

      const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if(!password.newPassWord){
            setError("New password required.")
        }else if(!password.confirmNewPassWord){
            setError("Please confirm new password.")
        }else if(password.newPassWord.length < 6){
             setError("password length must be greater than 6 character.")
        }else if(password.newPassWord !== password.confirmNewPassWord){
             setError("password not match. ")
        } else if(!/[A-Z]/.test(password.newPassWord)){
            setError("Password should contain upperCase.")
        }else if(!/[0-9]/.test(password.newPassWord)){
            setError("Password should contain Number.")
        }else if(!/[\W_]/.test(password.newPassWord)){
        setError("Password should contain Special Character.")
        } else{
            try {
                setLoading(true)
                 const res = await axios.post(`${url}/api/user/reset-password/${token}`,password)
                 if(res.data.success){
                    setPassword({
                         newPassWord:"",
                         confirmNewPassWord:""
                    })
                    navigate("/login")
                   toastSuccess(res.data.message)           
                 }
                 setLoading(false)
            } catch (error) {
                setLoading(false)
               if(error.response){
                 if(error.response.data.message){
                    setError(error.response.data.message)
                 }
               }else{
                setError("Internal server error.")
               }
                
            }
        }
      }
  return (
    <form onSubmit={handleSubmit} className='min-h-screen flex items-center justify-center bg-gray-100'>
           <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow shadow-black/10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Reset Password</h2>
             <div className=''>
                 <label htmlFor="">New Password</label>
                  <input onChange={handleChange} value={password.newPassWord} name='newPassWord' id="new-password" className="w-full border mt-1 border-gray-500/30 focus:border-indigo-500 outline-none rounded py-2.5 px-4" type="text"  />
             </div>
             <div>
                 <label htmlFor="">Confirm new password</label>
                  <input onChange={handleChange} value={password.confirmNewPassWord} name = "confirmNewPassWord" id="confirm-new-password" className="w-full border mt-1 border-gray-500/30 focus:border-indigo-500 outline-none rounded py-2.5 px-4" type="text"  />
             </div>
            <button disabled = {loading} type="submit" className={`w-full my-3 active:scale-95 ${loading ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'} transition py-2.5 rounded text-white bg-yellow-500 hover:bg-yellow-600 duration-300 `}>Change password</button>
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
     </form>
  )
}

export default ResetPassword