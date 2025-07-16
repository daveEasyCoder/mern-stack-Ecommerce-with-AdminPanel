import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/Skeleton'
import axios from 'axios'
import ProductItem from '../components/ProductItem'
import NotFound from '../components/NotFound'

const CategoryView = () => {
    const {category} = useParams()
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")
    const [products,setProducts] = useState([])
    const navigate = useNavigate()
 
     const getProduct =  async () => {
      try{
        
        setLoading(true)
        const res = await axios.get(`http://localhost:301/api/product/get-product-category/${category}`)
        if(res.data.success){
            setProducts(res.data.products)
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
  },[category])


   if(loading) return <Loader />
   if(!products || products.length === 0) return <NotFound error = {error}/>
  return (
    <div className='pt-25'>
        <div className='max-w-5xl mx-auto h-60 flex flex-col px-5 text-center items-center justify-center rounded-sm mb-9 bg-gray-100'>
              <h1 className='text-3xl font-bold px-2 mb-2'>Category: <span className='text-yellow-500'>{category}</span></h1>
              <p className='w-[70%] text-sm'>
                {category === "Men" ?
                 'Men ipsum dolor sit amet consectetur adipisicing elit. Et sunt!':
                 category === "Women" ? 'Women ipsum dolor sit amet consectetur adipisicing elit. Et sunt!':
                 category === "Kids" ? "Kids ipsum dolor sit amet consectetur adipisicing elit. Et sunt!" : 
                 category === "Accessories" ? "Accessories ipsum dolor sit amet consectetur adipisicing elit. Et sunt!":""
                }
              </p>
        </div>

        <div className='max-w-5xl mx-auto'>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
              {  
                products.map((product,index) => (
                  <ProductItem key={index} product={product} />
                ))
              }
            </div>
        </div>
     
  
    </div>
  )
}

export default CategoryView