import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import Loader from '../components/Loader'
import emptyOrderImg from '../src/assets/emptyOrder.png'
import OrderItem from '../adminComponents/OrderItem'
import { BiArrowBack } from 'react-icons/bi';
import { useEcommerce } from '../context/EcommerceContext'

const UserOrder = () => {
    const {id} = useParams()

    const {url} = useEcommerce()

    const[orders,setOrders] = useState([])
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const getUserOrder = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${url}/api/order/get-user-order/${id}`,{withCredentials:true})
            if(res.data.success){
                console.log(res.data);
                setOrders(res.data.order)
            }
            setLoading(false)
        } catch (error) {
             setLoading(false)
             if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    localStorage.removeItem("admin")
                    navigate("/admin-login")
                    console.log("your are not authorized");        
                }
                if(error.response.data && error.response.data.message){
                    console.log(error.response.data.message); 
                    setError(error.response.data.message)
                }
            }else{
               setError("Internal server error.try later!")
            }
        }
    }


    useEffect(() => {
        getUserOrder()
    },[id])


    if(loading) return <Loader />
  
  return (
    <div className='pt-20 ml-17 md:ml-67'>
        <div className=' max-w-4xl'>
            <button onClick={() => navigate(-1)} className='h-8 w-8 flex items-center mb-1 justify-center cursor-pointer hover:bg-gray-200 duration-300 rounded-full'><BiArrowBack className='text-gray-500' size={20} /></button>
            {
                orders && orders.length ?
                orders.map(order => (
                    <OrderItem order={order} setError = {setError}/>
                )) :
                  <div className='min-h-[80vh] flex flex-col items-center justify-center '>
                    <img className='w-64' src={emptyOrderImg} alt="" />
                    <p className='text-2xl text-gray-600 mt-3'>Order not found</p>
                </div>
            }
        </div>
    </div>
  )
}

export default UserOrder