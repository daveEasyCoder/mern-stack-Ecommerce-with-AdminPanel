import React,{ useEffect,useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';


import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useEcommerce } from '../context/EcommerceContext';
const AdminProduct = () => {

     const {admin,url} = useEcommerce()
     const [products,setProducts] = useState([])
     const[loading,setLoading] = useState(false)
     const [error,setError] = useState("")
     const [showMenu,setShowMenu] = useState(false)
     const [showMenuIndex,setShowMenuIndex] = useState(null)
     
     const navigate = useNavigate()

      const getProduct =  async () => {
    try{  
       setLoading(true)
       const res = await axios.get(`${url}/api/product/get-product`)
       if(res.data.success){
          setProducts(res.data.products)
          setLoading(false)
       }
    }catch(err){
      if(err.response){
         if(err.response.data.message){
          console.log(err)
          setError(err.response.data.message)
         }
         setLoading(false)
      }else{
        console.log(err)
        setError("server not responding. please try later!")
        setLoading(false)
      }
    }
  }

  const checkAdmin = () => {
    if(!admin || !admin._id){
       navigate("/admin-login")
     }
  }
  useEffect(() => {
    checkAdmin()
    getProduct()
  },[])

  const calculateStock = (product) => {
    const stock = product.sizes.reduce((acc,size) => (acc + size.stock),0)
    return stock
  }

  const handleShowMenu = (id) => {
    setShowMenu(prev => !prev)
    setShowMenuIndex(id) 
  }

  

  if(loading) return <div className='flex items-center justify-center h-[3-vh]'>loading...</div>

  return (
    <div className='ml-15 md:ml-58'>

         <div className="flex-1 py-10 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">Stock</th>
                                <th className="px-4 py-3 font-semibold truncate">Action</th>
                            </tr>
                        </thead>
      
                        <tbody className="text-sm text-gray-500">
                            {products.map((product, index) => (
                                <tr key={index} className="border-t border-gray-500/20">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <div className="border border-gray-300 rounded overflow-hidden">
                                            <img  src={`${url}/productImage/${product?.image[0]}`} alt="Product" className="w-16" />
                                        </div>
                                        <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3 max-sm:hidden">${product.originalPrice}</td>
                                    <td className="px-4 py-3">{calculateStock(product)}</td>
                                    <td className="px-4 py-3 relative">
                                        <BsThreeDotsVertical onClick={() => handleShowMenu(index)} className="text-lg cursor-pointer text-gray-600 hover:text-black" />
                                          {showMenu && index === showMenuIndex && (
                                                <div className="absolute right-0 mt-2 w-28 bg-white shadow-md border border-gray-300  rounded-md z-10">
                                                    <Link to={`/admin/edit-product/${product._id}`}
                                                        
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full"
                                                    >
                                                        <MdEdit /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => alert(product._id)}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                                    >
                                                        <MdDelete /> Delete
                                                    </button>
                                                    </div>
                                                )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
  )
}

export default AdminProduct