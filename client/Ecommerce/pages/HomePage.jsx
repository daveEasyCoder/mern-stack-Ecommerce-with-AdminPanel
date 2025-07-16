import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero';
import Product from '../components/product';
import { useEcommerce } from '../context/EcommerceContext';
import axios from 'axios';
import BestCategory from '../components/BestCategory';
import CategoryView from './CategoryView';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {

  const {setProducts} = useEcommerce()
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const navigate = useNavigate()

  const getProduct =  async () => {
    try{
       
       setLoading(true)
       const res = await axios.get("http://localhost:301/api/product/get-product")
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