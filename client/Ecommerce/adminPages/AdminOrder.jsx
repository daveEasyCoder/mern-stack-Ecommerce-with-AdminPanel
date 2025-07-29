import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import OrderItem from '../adminComponents/OrderItem'
import { useEcommerce } from '../context/EcommerceContext'
const AdminOrder = () => {
  
    const navigate = useNavigate()

    const {url} = useEcommerce()
    const[orders,setOrders] = useState([])
    const[error,setError] = useState("")
    const getOrder = async () => {
         try {
            const res = await axios.get(`${url}/api/order/get-all-orders/`,{withCredentials:true})
            if(res.data.success){
                setOrders(res.data.orders)
            }
         } catch (error) {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    localStorage.removeItem("admin")
                    navigate("/admin-login")
                    console.log("your are not authorized");        
                }
                if(error.response.data && error.response.data.message){
                    setError(error.response.data.message)
                }
            }else{
               setError("Internal server error.try later!")
            }
         }
    }


    useEffect(() => {
        getOrder()
    },[])
  return (
        <div className="pt-20 ml-17 md:ml-67">
           <div className=" space-y-4 max-w-4xl">
            <h2 className="text-xl font-medium">Orders</h2>
            {orders.map((order, index) => (
                <OrderItem key={index} order = {order} setError = {setError}/>       
            ))}
        </div>
       </div>
  )
}

export default AdminOrder