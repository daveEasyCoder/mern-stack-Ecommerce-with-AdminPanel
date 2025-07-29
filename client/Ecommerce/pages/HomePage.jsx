import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero';
import Product from '../components/product';
import { useEcommerce } from '../context/EcommerceContext';
import axios from 'axios';
import BestCategory from '../components/BestCategory';

const HomePage = () => {

  const {setProducts,setUser,url} = useEcommerce()
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const getProfile = async () => {
    try {
     const res = await axios.get(`${url}/api/user/me`,{withCredentials:true})
     if(res.data.success){
      setUser(res.data.user)
     }
    } catch (error) {
      console.log(error);
      
    }
  }
  const getProduct =  async () => {
    try{
       
       setLoading(true)
       const res = await axios.get(`${url}/api/product/get-product`)
       if(res.data.success){
          setProducts(res.data.products)
          localStorage.setItem("products",JSON.stringify(res.data.products))
          setLoading(false)
       }
    }catch(err){
      setLoading(false)
      if(err.response){
         if(err.response.data.message){
          console.log(err)
          setError(err.response.data.message)
         }
      }else{
        console.log(err)
        setError("server not responding. please try later!")  
      }
    }
  }

  useEffect(() => {
    getProfile()
    getProduct()
  },[])
  return (
       <>
        <Hero />
        <BestCategory />
        <Product />
       </>
  )
}

export default HomePage