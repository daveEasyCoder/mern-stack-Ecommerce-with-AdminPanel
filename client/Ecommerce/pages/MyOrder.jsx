import { useEffect, useState } from "react";
import axios from "axios";
const MyOrder = () => {
    const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"

    const orders = [
        { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA"}, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022", status:"processing", isPaid: true },
        { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA"}, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022",status:"delivered", isPaid: true },
        { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA"}, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022",status:"shipped", isPaid: true },
    ];

    const[myOrders,setMyOrders] = useState([])

     const getMyOrder = async () => {
        try {
           const res = await axios.get(`http://localhost:301/api/cart/get-myorder/`,{withCredentials:true})
           if(res.data.success){
            setMyOrders(res.data.orders)
           }
        } catch (error) {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    localStorage.removeItem("user")
                    navigate("/login")
                    console.log("you are not authorized")
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
    return (
       <div className="pt-20">
           <div className="md:p-10 space-y-4 max-w-4xl">
            <h2 className="text-lg font-medium">Orders List</h2>
            {orders.map((order, index) => (

               <div key={index} className="border border-gray-300 rounded-md">
                  <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5   text-gray-800">
                    <div className="flex gap-5">
                        <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
                        <>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col justify-center">
                                    <p className="font-medium">
                                        {item.product.name} <span className={`text-indigo-500 ${item.quantity < 2 && "hidden"}`}>x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </>
                    </div>

                    <div className="text-sm">
                        <p className='font-medium mb-1'>{order.address.firstName} {order.address.lastName}</p>
                        <p>{order.address.street}, {order.address.city}, {order.address.state},{order.address.zipcode}, {order.address.country}</p>
                    </div>

                    <p className="font-medium text-base my-auto text-black/70">${order.amount}</p>

                    <div className="flex flex-col text-sm">
                        <p>Method: {order.paymentType}</p>
                        <p>Date: {order.orderDate}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
                
                     {order.status === "shipped" && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-500">Shipped</p>
                            </div>
                            <button
                                className="text-yellow-600 border-yellow-200 bg-transparent cursor-pointer"
                            >
                                Track
                            </button>
                            </div>
                        </div>
                        )}
                     {order.status === "delivered" && (
                        <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Delivered</p>
                            </div>
                            <button
                                className="text-green-700 border-blue-200 bg-transparent cursor-pointer"
                            >
                                Track
                            </button>
                            </div>
                        </div>
                        )}
                     {order.status === "processing" && (
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Processing</p>
                            </div>
                            <button
                                className="text-blue-700 border-blue-200 bg-transparent cursor-pointer"
                            >
                                Track
                            </button>
                            </div>
                        </div>
                        )}
               </div>        
            ))}
        </div>
       </div>
    );
};

export default MyOrder