import React from 'react'
import {toastSuccess} from '../utility/toast.js'
import axios from 'axios'
import { useEcommerce } from '../context/EcommerceContext.jsx'

const OrderItem = ({order,setError}) => {

        const {url} = useEcommerce()
        const handleStatus = async (status,orderId) => {
            try {
                const res = await axios.post(`${url}/api/order/update-status/`,{status,orderId},{withCredentials:true})
                if(res.data.success){
                   toastSuccess("Status updated succesfully")
                }
            } catch (error) {
                if(error.response){
                    if(error.response.status === 401 || error.response.status === 403){
                        localStorage.removeItem("admin")
                        navigate('/admin-login')
                    }
                }else{
                    setError("Server not responding!")
                    console.log(error);
                    
                }
            }
        }

  return (
       <div className="border border-gray-300 rounded-md p-4">
                  <div className="flex items-center md:justify-end border-b pb-2 border-b-gray-200 mb-2">
                     <p className=""><span className="font-semibold text-gray-700">Order Id:</span> <span className='text-xs md:text-sm'>{order._id}</span></p>
                  </div>
                    <div className="flex flex-col gap-3">
                            {order.items.map((item, index) => (
                              <div key={index}>
                                 <div key={index} className="flex gap-2 px-3 py-1">
                                    <div className="md:w-[10%]">
                                        <img className="w-25 h-25 md:h-20 md:w-20" src ={`${url}/productImage/${item.productId.image[0]}`} alt="" />
                                    </div>
                                    <div className="w-[90%] flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="text-gray-800 ">{item.productId.name}</h1>
                                            <div className="flex gap-2 text-sm">
                                               <p className="text-gray-700">${item.productId.discountedPrice}</p>
                                               <p className="text-gray-700">quantity: {item.quantity}</p>
                                               <p className="text-gray-700">size: {item?.selectedSize}</p>
                                            </div>
                                            <p className="text-xs text-gray-700">  {new Date(order.createdAt).toLocaleDateString("en-US")}</p>
                                        </div>
                                   
                                        <div>
                                            <select onChange={(e) => handleStatus(e.target.value,order._id)} name="status" id="status" value={order.status} className='border border-gray-200 px-2 py-1 text-sm'>
                                                <option  value="delivered">Delivered</option>
                                                <option  value="shipped">Shipped</option>
                                                <option  value="order-placed">Order-placed</option>
                                                <option  value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {index < order.items.length-1 && <hr className="text-gray-200 mt-3"/>}   
                              </div>
                            ))}         
                    </div> 
                     {/* Shipping Address & Total Price */}
                    <div className="grid md:grid-cols-3 mt-4 pt-3 text-sm text-gray-700 space-y-1 px-3">
                        <div className="mt-4 border-t border-t-gray-300 pt-3 text-sm text-gray-700 space-y-1 px-3">
                            <p className="font-semibold">Shipping Address:</p>
                            <p>Name: {order.shippingAddress?.fullname}</p>
                            <p>Address: {order.shippingAddress?.address}</p>
                            <p>City: {order.shippingAddress?.city}</p>
                            <p>Postal Code: {order.shippingAddress?.postalCode}</p>
                            <p className="mt-2 font-semibold">Total Price: ${order.totalPrice}</p>
                        </div>
                        <div className="mt-4 border-t border-t-gray-300 pt-3 text-sm text-gray-700 space-y-1 px-3">
                            <p className="font-semibold">Customer:</p>
                            <p>Name: {order.userId?.fullname}</p>
                            <p>Email: {order.userId?.email}</p>
                        </div>
                        <div className="mt-4 border-t border-t-gray-300 pt-3 text-sm text-gray-700 space-y-1 px-3">
                            <p className="font-semibold">Payment Detail:</p>
                            <p>payment Method: {order.paymentMethod === "Cash On Delivery" ? 'COD' : order.paymentMethod}</p>
                            <p>Payment status: {order?.isPaid ? "Paid" : "unPaid"}</p>
                        </div>
                    </div>
               </div> 
  )
}

export default OrderItem