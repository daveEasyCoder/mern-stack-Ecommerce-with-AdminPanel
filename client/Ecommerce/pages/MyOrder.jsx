import { useEffect, useState } from "react";
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom'
import { useEcommerce } from "../context/EcommerceContext";
import Loader from "../components/Loader";
import emptyOrderImg from '../src/assets/emptyOrder.png'
const MyOrder = () => {
  
    const {myOrders,setMyOrders,setUser,url} = useEcommerce()
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
     const getMyOrder = async () => {
        try {
            setLoading(true)
           const res = await axios.get(`${url}/api/order/get-myorder/`,{withCredentials:true})
           if(res.data.success){
            setMyOrders(res.data.orders)  
           }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    console.log("Your are not authorized")
                    setUser(null)
                    navigate("/login")
                }
               if(error.response.data.message){
                console.log(error.response.data.message);    
                setError(error.response.data.message)
               }
            }else{
                console.log(error);
                setError("Internal server error")
            }
        }
    }

    useEffect(() => {
        getMyOrder()
    },[])


    if(loading) return <Loader />
     if(error) return <div className='h-[60vh] flex items-center justify-center text-gray-700'>{error}</div>
    return (
       <div className="pt-20">
           <div className="md:p-10 space-y-4 max-w-5xl mx-auto">
            {  myOrders && myOrders.length ? <h2 className="text-lg font-medium">My Orders</h2> : null}
            { 
            myOrders && myOrders.length ?
            myOrders.map((order, index) => (
              <div key={index} className="border border-gray-300 rounded-md p-4">
                  <div className="flex items-center justify-end border-b pb-2 border-b-gray-200 mb-2">
                     <p className=""><span className="font-semibold text-gray-700">Order Id:</span> {order._id}</p>
                  </div>
                    <div className="flex flex-col gap-3">
                            {order.items.map((item, index) => (
                              <div key={index}>
                                   <div key={index} className="flex gap-2 px-3 py-1">
                                    <div className="w-[10%]">
                                        <img className="h-20 w-20" src ={`${url}/productImage/${item.productId.image[0]}`} alt="" />
                                    </div>
                                    <div className="w-[90%] flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="text-gray-800 ">{item.productId.name}</h1>
                                            <div className="flex gap-2 text-sm">
                                               <p className="text-gray-700">${item.productId.discountedPrice}</p>
                                               <p className="text-gray-700">quantity: {item.quantity}</p>
                                               <p className="text-gray-700">size: {item?.selectedSize}</p>
                                            </div>
                                            <p className="text-xs text-gray-700">{new Date(order.createdAt).toLocaleDateString("en-US")}</p>
                                        </div>
                                        <div className="text-sm">
                                            {order.status === "order-placed" && <div className="flex gap-1.5 items-center"><div className="w-2 h-2 rounded-full bg-green-500"></div><p className=''>Order placed</p></div>}
                                            {order.status === "shipped" && <div className="flex gap-1.5 items-center"><div className="w-2 h-2 rounded-full bg-blue-500"></div><p className=''>Shipped</p></div>}
                                            {order.status === "delivered" && <div className="flex gap-1.5 items-center"><div className="w-2 h-2 rounded-full bg-yellow-400"></div><p className=''>delivered</p></div>}
                                        </div>
                                        <div>
                                            <Link to={`/track-order/${order._id}/item/${item._id}`} className="shadow px-3 rounded py-1 text-sm cursor-pointer hover:bg-gray-200">Track Order</Link>
                                        </div>
                                    </div>
                                </div>
                                {index < order.items.length-1 && <hr className="text-gray-200 mt-3"/>}   
                              </div>
                            ))}         
                    </div> 
               </div>   
            )) : 
              
              <div className='min-h-[55vh] flex flex-col items-center justify-center '>
                <img className='w-64' src={emptyOrderImg} alt="" />
                <p className='text-2xl text-gray-600 mt-3'>Have no Order yet</p>
              </div>

            }
        </div>
       </div>
    );
};

export default MyOrder