import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import { MdRemove,MdAdd } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { useEcommerce } from "../context/EcommerceContext"
const Cart = () => {

    const {carts,setCarts} = useEcommerce()
    const [error,setError] = useState("")
    

    const navigate = useNavigate()

        let user = localStorage.getItem("user")
        if(user){
            user = JSON.parse(user)
        }
    const getCart = async () => {
        try {
           const res = await axios.get(`http://localhost:301/api/cart/get-cart/`,{withCredentials:true})
           if(res.data.success){
            setCarts(res.data.carts.items)
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
        getCart()
    },[])

         let price = 0
         let taxPrice = 0
         let totalAmount = 0
         const taxFee = 1
        if(carts && carts.length > 0){
             price = carts?.reduce((sum,item) => {
                 return sum + item.quantity * item.productId.discountedPrice
             },0)
             taxPrice = (price * (taxFee / 100)).toFixed(2)
             totalAmount = Number(price) + Number(taxPrice)
        }
       
        const deleteCartItem = async (id) => {
            try {
                const res = await axios.delete(`http://localhost:301/api/cart/delete-cart-item/${id}`,{withCredentials:true})
                if(res.data.success){
                    setCarts(res.data.carts.items)    
                }
            } catch (error) {
               if(error.response){
                  if(error.response.status === 401 || error.response.status === 403){
                    localStorage.removeItem("user")
                    navigate("/login")
                    console.log("you are not authorized")
                }
               }else{
                 console.log(error);  
               }
            }
        }

        const updateQuantity = async (id,action) => {
            try {     
               const res = await axios.post(`http://localhost:301/api/cart/update-quantity/${id}`,{action},{withCredentials:true})
               if(res.data.success){
                setCarts(res.data.carts.items)
               
               }
            } catch (error) {
                 console.log(error);  
            }
        }
        


    return (
        <div className="flex gap-2 items-start flex-col pt-20 md:flex-row py-16 max-w-7xl w-full px-6 mx-auto">
            <div className='flex-1 w-full md:w-[60%] p-4 border border-gray-300/90'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart 
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Qty</p>
                    <p className="text-center">Action</p>
                </div>

                {
                carts && carts?.length ?
                carts.map((cart, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover"  src ={`http://localhost:301/productImage/${cart.productId.image[0]}`} />
                                
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{cart.productId.name}</p>
                                {cart?.selectedSize &&  <p>size: {cart?.selectedSize}</p> }
                                <div className="font-normal text-gray-500/70">
                                    <div className='flex items-center'>
                                        <p>Qty: {cart.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">${cart.productId.discountedPrice * cart.quantity}</p>
                        {/* quantity */}
                      <div className="flex items-center justify-center">
                           <div className="flex items-center border justify-center  border-gray-200 rounded-lg">
                            <button onClick={() => updateQuantity(cart._id,"decrease")} className="h-7 w-7 flex items-center justify-center rounded-sm p-0 hover:bg-gray-200  duration-300  cursor-pointer">
                                <MdRemove className="h-4 w-4" />
                            </button>
                            <span className="px-2 py-1 text-md font-medium">{cart.quantity}</span>
                            <button onClick={() => updateQuantity(cart._id,"increase")} className="h-7 w-7 flex items-center justify-center rounded-sm p-0 hover:bg-gray-200  duration-300  cursor-pointer">
                                <MdAdd className="h-4 w-4" />
                            </button>
                        </div>
                      </div>
                        {/* action button */}
                        <button onClick={() => deleteCartItem(cart._id)} className="cursor-pointer mx-auto">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>) 
                ) : <div className="h-[50vh] flex items-center justify-center">Cart is empty</div>
            }

                <button onClick={() => navigate("/collections")} className="group cursor-pointer flex items-center mt-8 gap-2 text-yellow-500 font-medium">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" className="stroke-yellow-500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Continue Shopping
                </button>

            </div>

            <div className="w-[90%] md:w-[40%] bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/90">
                <h2 className="text-xl md:text-xl font-medium">Cart Summary</h2>
                <hr className="border-gray-300 my-5" />

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>${price}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (1%)</span><span>${taxPrice}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>${totalAmount}</span>
                    </p>
                </div>

                <button onClick={() => navigate("/order")} className="w-full py-3 mt-6 cursor-pointer bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition">
                    Continue to Checkout
                </button>
            </div>
        </div>
    )
}

export default Cart