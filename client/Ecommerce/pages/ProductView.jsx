import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { MdAdd, MdRemove } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import RelatedItem from '../components/RelatedItem';
import { useEcommerce } from '../context/EcommerceContext';
import { toastInfo,toastSuccess } from '../utility/toast';
import Loader from '../components/Loader';


const ProductView = () => {
  const {id} = useParams()
  const {setCarts,setUser,url} = useEcommerce()
  const [product,setProduct] = useState(null)
  const [relatedProducts,setRelatedProducts] = useState([])
  const [loading,setLoading] = useState(false)
  const [cartLoading,setCartLoading] = useState(false)
  const[error,setError] = useState()
  const [quantity,setQuantity] = useState(1)
  const [image,setImage] = useState("")
  const [selectedSize,setSelectedSize] = useState("")
  const [size,setSize] = useState([])
  const [leftStock,setLeftStock] = useState(0)

  const navigate = useNavigate()

  let user = localStorage.getItem("user")
  if(user){
     user = JSON.parse(user)
  }

  const getEachProduct =  async () => {
    try{
       
       setLoading(true)
       const res = await axios.get(`${url}/api/product/get-each-product/${id}`)
       if(res.data.success){
          setProduct(res.data.product)
          setImage(res.data.product.image[0])
          setSelectedSize(res.data.product.sizes[0].size)
          setSize(res.data.product.sizes)
          setRelatedProducts(res.data.relatedProducts)
          if(res.data.product.sizes && res.data.product.sizes.length){
              const stock = res.data.product.sizes.reduce((acc,item) => acc + Number(item.stock),0)
              setLeftStock(stock)
          }
          setLoading(false)
       }
       
    }catch(err){
      setLoading(false)
      if(err.response){
         if(err.response?.data?.message){
          setError(err.response.data.message)
          console.log(err.response.data.message)
         }
      }else{
        console.log(err)
        setError("server not responding. please try later!")
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0,0)
    getEachProduct()
  },[id])


  const handleSizeChange = (value) => {
     setSelectedSize(value)
  }
  const addToCart = async () => {

     const item = size.find(s => s.size === selectedSize)
     const inStock = quantity <= item.stock
     if(inStock){
        try { 
            setCartLoading(true)
            const res = await axios.post(`${url}/api/cart/add-to-cart/${id}`,{quantity,selectedSize},{withCredentials:true})
            if(res.data.success){
              setCarts(res.data.cart.items);  
              toastSuccess("Added to Cart successfully")
            }
              setCartLoading(false)
          } catch (error) {
            setCartLoading(false)
          if(error.response){
              if(error.response.status === 401 || error.response.status === 403){
                  console.log("you are not authorized")
                  setUser(null)
                  navigate("/login")
              }
              if(error.response?.data?.message){
                setError(error.response.data.message)
                console.log(error.response.data.message)
              }
              console.log(error.response);   
            }else{
              console.log("server is not responding. try later!")
            }
          }
     }else{
        toastInfo("Out of stock")
     }
  }

  if(loading) return <Loader />
    
  if(error) return <div className='h-[60vh] flex items-center justify-center text-gray-700'>{error}</div>
  return (
    <div className='pt-20 pb-3'>
        <div className='max-w-6xl mx-auto px-2'>
            <p className='text-sm mb-8'> <span className='text-gray-500'>Home / Products / {product?.category} /</span> <span className='text-black font-medium'>{product?.name}</span></p>
            <div className='flex flex-col md:flex-row items-stretch gap-3'>
                <div className='md:w-1/2'>
                    <div className='w-full bg-gray-200 h-90'><img className='rounded-sm w-full h-full object-cover' src ={`${url}/productImage/${image}`}  alt="" /></div>
                    <div className='grid grid-cols-4 gap-2 mt-2'>
                       {
                        product?.image && product?.image?.length &&
                         product.image.map((img,index) => img && <img key={index} onClick={() => setImage(img)} className='w-full h-32 rounded-sm object-cover' src ={`${url}/productImage/${img}`}alt="" />)
                       }
                    </div>
                </div>

                <div className='md:w-1/2'>
                    <h1 className='text-3xl text-gray-900 font-bold m-0'>{product?.name}</h1>
                    <div className='flex items-center gap-4 mt-3'>
                        <span className='flex items-center gap-0.5'>
                           {[...Array(5)].map((_,i) => (
                                <FaStar className='text-yellow-400 text-xl' key={i} />
                            ))}
                        </span>
    
                        <span className='text-sm text-gray-600'>'{product?.rating}(1243 reviews)</span>
                        <span className='text-green-600 text-sm font-medium'>{ leftStock > 0 ? 'in Stock' : 'out of stock' }</span>
                    </div>
                    <div className='flex itmes-center gap-6 mt-8'>
                        <h1 className='text-3xl text-gray-800 font-bold'>${product?.discountedPrice}</h1>
                        <h1 className='text-gray-600 text-2xl line-through'>${product?.originalPrice}</h1>
                        <button className='bg-red-600 text-white rounded-full px-3 py-1.5 font-medium'>Save ${product?.discount}</button>
                    </div>
                    <p className='text-gray-700 text-sm mb-5 mt-1'>Free shipping on order over $50</p>
                    <p className='text-gray-800 text-md leading-6  mb-4'>{product?.description}</p>
                    <div>
                       
                        <div className='flex items-center gap-2'>
                          {
                            product?.sizes && product?.sizes?.length ?
                              <select onChange={(e) => handleSizeChange(e.target.value)} className='border rounded border-gray-200 py-2 px-1.5 focus:outline-1 focus:outline-yellow-400'>
                                 <option value="">select size</option>
                                 {
                                  product.sizes.map((s,index) => (
                                      <option key={index} value={s.size} className='text-gray-500'> {s.size} {s.stock === 0 ? '( out of stock )' : `( ${s.stock} left in stock )`}</option>
                                 ))
                                 }
                              </select> : ''
                          }
                        </div>
                    </div>

                 {/* quantity update */}
                  <div className='flex items-center mt-5 gap-4'>
                       <div className="flex items-center border justify-center w-[23%] border-gray-300 rounded-lg">
                        <button onClick={() => quantity > 1 && setQuantity(prev => prev - 1)} className="h-10 w-10 flex items-center justify-center rounded-sm p-0 hover:bg-gray-200  duration-300  cursor-pointer">
                            <MdRemove className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                        <button onClick={() => setQuantity(prev => prev + 1)} className="h-10 w-10 flex items-center justify-center rounded-sm p-0 hover:bg-gray-200  duration-300  cursor-pointer">
                            <MdAdd className="h-4 w-4" />
                        </button>
                    </div>
                    <div className='text-sm text-gray-800'>Only {leftStock ? leftStock : 0} left in the stock</div>
                  </div>
                {/* Add to cart button */}
                  <div className='mt-5'>
                      <button onClick={addToCart} className={`bg-yellow-400 rounded-sm text-white w-1/2 ${cartLoading ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center justify-center py-2`}>{cartLoading ? 'Adding...' : 'Add to cart'}</button>
                  </div>

                </div>

            </div>
        </div>

      
       {/* Related Products {`/product-detail/${product._id}`} */}
        <div  className="mt-16 px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
            {relatedProducts.map((p,index) => (
              <RelatedItem key={index} p={p}/>
            ))}
          </div>
        </div>






    </div>
  )
}

export default ProductView