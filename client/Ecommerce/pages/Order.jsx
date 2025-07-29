import React from 'react'
import { useEcommerce } from '../context/EcommerceContext'
import { useState } from 'react'
import axios from 'axios'
import { toastError, toastSuccess } from '../utility/toast'

const Order = () => {

    const {carts,url} = useEcommerce()
    const [shippingAddress,setShippingAddress] = useState({
         fullname:"",
         address:"",
         city:"",
         postalCode:""
      }) 
      const [paymentMethod,setPaymentMethod] = useState("")
      const[error,setError] = useState("")

      const handleShippingChange = (e) => {
        const {name,value} = e.target
        setShippingAddress({
            ...shippingAddress,
             [name]:value
        })
      }
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

    const handlePlaceOrder = async () => {
       if(!shippingAddress.fullname || !shippingAddress.address || !shippingAddress.city){
         alert("all field required")
       }else if(!paymentMethod){
           alert("payment method required")
       } else if(paymentMethod === "Online"){
             alert("Online method not supported Yet")
       }else{
         try {  
             const res = await axios.post(`${url}/api/order/place-order`,{shippingAddress,paymentMethod},{withCredentials:true})
             if(res.data.success){
                toastSuccess("Order placed successfully")
                setShippingAddress({
                        fullname:"",
                        address:"",
                        city:"",
                        postalCode:""
                })
             }
         } catch (error) {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    console.log("You are not authorized")
                    setUser(null)
                    navigate("/login")
                }
                if(error.response.data && error.response.data.message){
                    toastError(error.response.data.message)
                    console.log(error.response.data.message);
                }
            }else{
               setError("Interval server error. try later!")
               console.log(error);
               
            }
         }
        
       }
        
    }

  return (
    <div className='pt-25'>
        <div className='max-w-6xl mx-auto px-3 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* delivery info */}
            <div className='w-[90%]'>
                <h1 className='mb-4 text-xl text-gray-700 font-bold'>Delivery Info</h1>
                <div className='grid gap-3 grid-cols-1 sm:grid-cols-2'>
                    <div>
                        <label htmlFor="" className='font-semibold text-gray-700'>FullName:</label>
                        <input type="text" onChange={handleShippingChange} value={shippingAddress.fullname} name='fullname'  placeholder='full name' className='w-full px-2 py-2 border border-gray-300 focus:outline-1 focus:outline-indigo-500 rounded mt-0.5' />
                    </div>
                    <div>
                        <label htmlFor="" className='font-semibold text-gray-700'>Address:</label>
                        <input type="text"  onChange={handleShippingChange} value={shippingAddress.address} name='address'  placeholder='Address' className='w-full px-2 py-2 border border-gray-300 focus:outline-1 focus:outline-indigo-500 rounded mt-0.5' />
                    </div>
                    <div>
                        <label htmlFor="" className='font-semibold text-gray-700'>City:</label>
                        <input type="text"  onChange={handleShippingChange} value={shippingAddress.city} name='city' placeholder='City' className='w-full px-2 py-2 border border-gray-300 focus:outline-1 focus:outline-indigo-500 rounded mt-0.5' />
                    </div>
                    <div>
                        <label htmlFor="" className='font-semibold text-gray-700'>postalCode(optional):</label>
                        <input type="text"  onChange={handleShippingChange} value={shippingAddress.postalCode} name='postalCode'  placeholder='postalcode' className='w-full px-2 py-2 border border-gray-300 focus:outline-1 focus:outline-indigo-500 rounded mt-0.5' />
                    </div>
                </div>
            </div>
            {/* Order info */}
            <div className=''>
               <div className=" p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">  
                   <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                    <select onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="">Select Payment Method</option>
                        <option value="Cash On Delivery">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

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

                <button onClick={handlePlaceOrder} className="w-full py-3 mt-6 cursor-pointer bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition">
                   Place Order
                </button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Order