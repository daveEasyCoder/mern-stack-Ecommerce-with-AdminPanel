import React, { useState } from 'react'
import axios from 'axios'
import { useEcommerce } from '../context/EcommerceContext'
import { useNavigate } from 'react-router-dom'
import { toastSuccess } from '../utility/toast'
const ChangePassword = () => {

    const {setUser,url} = useEcommerce()
    const [password,setPassword] = useState({
      oldPassword:"",
      newPassword:"",
      confirmNewPassword:""
    })
    const [error,setError] = useState("")
    const navigate = useNavigate()
    const handlePasswordChange = (e) => {
        const {value,name} = e.target
        setPassword({
            ...password,
             [name]: value
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
       if(!password.oldPassword){
         setError("current password required")
       }else if(!password.newPassword){
          setError("New password required")
       }else if(password.newPassword.length < 6){
           setError("Password length must be grater than 6 character")
       }else if(password.newPassword !== password.confirmNewPassword){
            setError("Password is not match")
       } else{
       
        try {
            const res = await axios.post(`${url}/api/user/change-password/`,password,{withCredentials:true})
            if(res.data.success){
                toastSuccess("Password changed successfully!")
                setPassword({
                     oldPassword:"",
                     newPassword:"",
                     confirmNewPassword:""
                })
            }
        } catch (error) {
            if(error.response){
              if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    console.log("you are not authorized")
                    setUser(null)
                    navigate("/login")
                }
              }
              if(error.response.data.message){
                console.log(error.response.data.message);  
                setError(error.response.data.message)
              }
            }else{
                console.log(error);
                setError("server is not responding. try again!")
            }
        }
        
       }
    }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='flex-1 m-2 bg-white shadow p-6 rounded max-w-md'>
            <h1 className='text-center text-xl mb-4 bg-gray-100 py-2'>Change Password</h1>
            <form  onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <div className='flex flex-col gap-y-0.5'>
                    <label htmlFor="old-password" className=' text-gray-700'>Current password</label>
                    <input onChange={handlePasswordChange} type="password" name='oldPassword' autoComplete='current-password' placeholder='Enter old password' className='border text-sm border-gray-300 rounded px-3 py-2 focus:outline-1.5 focus:outline-gray-400'/>
                </div>
                <div className='flex flex-col gap-y-0.5'>
                    <label htmlFor="new-password" className=' text-gray-700'>New password</label>
                    <input onChange={handlePasswordChange} type="password" name='newPassword' autoComplete='new-password' placeholder='Enter New password' className='border text-sm border-gray-300 rounded px-3 py-2 focus:outline-1.5 focus:outline-gray-400'/>
                </div>
                <div className='flex flex-col gap-y-0.5'>
                    <label htmlFor="confirm-new-password" className=' text-gray-700'>Confirm New password</label>
                    <input onChange={handlePasswordChange} type="password" name='confirmNewPassword' autoComplete='confirm-new-password' placeholder='Confirm New password' className='border text-sm border-gray-300 rounded px-3 py-2 focus:outline-1.5 focus:outline-gray-400'/>
                </div>
                {error && <p className='text-sm text-red-600'>{error}</p>}
                <button type='submit' className='bg-green-700 rounded text-white py-2 cursor-pointer hover:bg-green-900 duration-300 text-sm mt-2'>Change</button>
            </form>
        </div>
    </div>
  )
}

export default ChangePassword