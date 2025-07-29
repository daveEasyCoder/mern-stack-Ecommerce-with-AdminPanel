import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader'
import axios from 'axios';

const TrackingOrder = () => {
 
    const {url,setUser} = useEcommerce()
    const [orderItem,setOrderItem] = useState({})
    const [order,setOrder] = useState({})
    const {orderId,itemId} = useParams()

    const[error,setError] = useState("")
    const[loading,setLoading] = useState(false)
   const getSingleOrderItem = async () => {
         try {
            setLoading(true)
            const res = await axios.get(`${url}/api/order/get-order-item/${orderId}/item/${itemId}`,{withCredentials:true})
            if(res.data.success){
                console.log(res.data);
                
               setOrderItem(res.data.orderItem)
               setOrder(res.data.order)
            }
             setLoading(false)
         } catch (error) {
             setLoading(false)
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    console.log("You are not authorized")
                    setUser(null)
                    navigate("/login")
                }
                if(error.response.data && error.response.data.message){
                    console.log(error.response.data.message);
                    setError(error.response.data.message)
                }
            }else{
                console.log(error);  
                setError("Interval server error. try later!")
            }  
         }
    }
    


   useEffect(() => {
      getSingleOrderItem()
   },[])



  // Progress steps configuration
  const steps = [
    { id: 'order-placed', label: 'Order-placed' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ];

  if(loading) return <Loader />
 if(error) return <div className='h-[60vh] flex items-center justify-center text-gray-700'>{error}</div>

  return (

    <div>
       {
         order && orderItem &&
        <div className="max-w-4xl mx-auto p-4 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Order Tracking</h1>
            <Link to="/myorder" className="text-blue-600 hover:underline">View all orders</Link>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Order Status & Arrival */}
            <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Order #{order?._id}</span>
            <h2 className="text-xl font-semibold text-yellow-600 mt-1">
                Arriving on {order?.arrivalDate}
            </h2>
            </div>

            {/* Product Info */}
            <div className="flex items-start gap-4 mb-6">
            <img
                src={`http://localhost:301/productImage/${orderItem?.productId?.image[0]}`}
                alt={orderItem?.productId?.name}
                className="w-20 h-20 object-cover rounded border"
            />
            <div>
                <h3 className="font-medium text-gray-800">{orderItem?.productId?.name}</h3>
                <p className="text-gray-600">Quantity: {orderItem?.quantity}</p>
            </div>
            </div>

            {/* Progress Tracker */}
            <div className="mt-8">
            <div className="flex justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
                <div
                    className={`h-full bg-yellow-500 transition-all duration-1000 ${
                    order.status === 'delivered' ? 'w-full' :
                    order.status === 'shipped' ? 'w-2/3' :
                    'w-1/3'
                    }`}
                ></div>
                </div>

                {/* Steps */}
                {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center z-10">
                    <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === step.id || 
                        (order.status === 'delivered' && index < 2) || 
                        (order.status === 'shipped' && index < 1)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    >
                    {index + 1}
                    </div>
                    <span
                    className={`mt-2 text-sm font-medium ${
                        order.status === step.id ||
                        (order.status === 'delivered' && index < 2) ||
                        (order.status === 'shipped' && index < 1)
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }`}
                    >
                    {step.label}
                    </span>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
       }
    </div>
   
  );
};

export default TrackingOrder;