
import { useState,useEffect } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
const EditProduct = () => {

    const {id} = useParams()
    const [product,setProduct] = useState({
        name:"",
        originalPrice:0,
        discountedPrice:0,
        description:"",
        rating:0,
        category:"",
        subCategory:""
    })
     const[sizes,setSizes] = useState([
        {size:"S",stock:0},
        {size:"M",stock:0},
        {size:"L",stock:0},
        {size:"XL",stock:0},
        {size:"XXL",stock:0},
    ]);
    const [existingImage,setExistingImage] = useState([])
    const [images,setImages] = useState([null,null,null,null])
 
      
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
   
        const getEachProduct =  async () => {
        try{
           
           setLoading(true)
           const res = await axios.get(`http://localhost:301/api/product/get-each-product/${id}`)
           if(res.data.success){
             
              setProduct({
                    name:res.data.product.name,
                    originalPrice:res.data.product.originalPrice,
                    discountedPrice:res.data.product.discountedPrice,
                    description:res.data.product.description,
                    stock:res.data.product.stock,
                    rating:res.data.product.rating,
                    category:res.data.product.category,
                    subCategory:res.data.product.subCategory || ""
              })
                setExistingImage(res.data.product.image || [])

                let existSize = [...sizes]
                const storedSize = res.data.product.sizes
                storedSize.forEach((size,index) => {
                    existSize[index].stock = size.stock || 0
                })
                setSizes(existSize)
                setLoading(false)
           }
           
        }catch(err){
          setLoading(false)
          if(err.response){
             if(err.response?.data?.message){
              setError(err.response.data.message)
              console.log(err.response.data.message)
             }
             setLoading(false)
          }else{
            console.log(err)
            setError("server not responding. please try later!")
            setLoading(false)
          }
        }
      }
    
      useEffect(() => {
        window.scrollTo(0,0)
        getEachProduct()
      },[])

      
    const handleImageChange = (i,file) => {
         let updated = [...images]
         updated[i] = file
         setImages(updated)    
    }
    

   const handleSizeChange = (index,value) => {
       let updated = [...sizes]
       updated[index].stock = value
       setSizes(updated)
    }

    const handleChange = (e) => {
         setProduct(prev => {
            return {
              ...prev,
              [e.target.name]: e.target.value
            }
         })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(product);
        // console.log(sizes);
        // console.log(images);
        
        setError("")
        if(!existingImage || existingImage.length === 0){
           console.log("image required");
           
        }else if(!product.name || !product.originalPrice || !product.discountedPrice || !product.description || !product.rating || !product.category || !product.subCategory){
           console.log("all fields are required");
           setError("All fields are required");
        }else{
            try {
                const formData = new FormData()

                formData.append("name",product.name)
                formData.append("originalPrice",Number(product.originalPrice))
                formData.append("discountedPrice",Number(product.discountedPrice))
                formData.append("description",product.description)
                formData.append("rating",Number(product.rating))
                formData.append("category",product.category)
                formData.append("subCategory",product.subCategory)
                formData.append("sizes",JSON.stringify(sizes))

                for(let i = 0; i < 4; i++){
                    if(images[i]){
                        formData.append("newImages",images[i])
                        formData.append("newImageIndexes",i)
                    }else{
                        if(existingImage[i]){
                            formData.append("existingImages",existingImage[i])
                            formData.append("existingImageIndex",i)
                        }
                    }
                }
       
                const res = await axios.put(`http://localhost:301/api/product/edit-product/${id}`,formData)
                if(res.data && res.data.success){
                  if(res.data.message){
                     alert(res.data.message)
                  }  
                }
            } catch (error) {
              
                if(error.response){
                   if(error.response.data.message){
                    console.log(error.response.data.message)
                    setError(error.response.data.message)
                   }
                }else{
                    setError("server is not responding.please try again!")
                    console.log("server is not responding.please try again!");   
                }
                
            }     
        }
    }

    return (
        <div className="pt-15 flex flex-col justify-between ml-16 md:ml-60 bg-white">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-2xl">
                <h1 className="text-2xl font-bold border-b pb-1 border-b-gray-200">Edit product</h1>
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                    {
                        [0,1,2,3].map((i) => (
                            <label key={i} className="border border-gray-300 rounded-sm">
                                <input onChange={(e) => handleImageChange(i,e.target.files[0])}  name={`image${i}`}   accept="image/*" type="file"  hidden />
                                <img className="max-w-24 cursor-pointer" src={images[i] ? URL.createObjectURL(images[i]) : existingImage[i]  ? `http://localhost:301/productImage/${existingImage[i]}`  :  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} alt="uploadArea" width={100} height={100} />
                            </label>
                        ))
                    }
                       
                  
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={handleChange} id="product-name" name="name" value={product.name} type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea onChange={handleChange} id="product-description" name="description" value={product.description} rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>
          
                <div className="flex flex-col sm:flex-row items-center gap-2">
                         {/* category */}
                    <div className="w-full flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="category">Category</label>
                        <select onChange={handleChange} id="category" name="category" value={product.category} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                            <option value="">Select Category</option>
                            {[{ name: 'Men' }, { name: 'Women' }, { name: 'Kids' },{ name: 'Accessories' }].map((item, index) => (
                                <option key={index} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* sub-category */}
                    <div className="w-full flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="category">Sub-category</label>
                        <select onChange={handleChange} id="sub-category" name="subCategory" value={product.subCategory} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                            <option value="">sub-category</option>
                            {[{ name: 'Shoes' }, { name: 'T-shirt' }, { name: 'Jacket' },{ name: 'Jeans' },{ name: 'Shorts' },{name: 'bags'},{ name: 'SprotsWear' },{ name: 'Watches' },{ name: 'Skirts' },{ name: 'Dresses' }].map((item, index) => (
                                <option key={index} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                    </div> 
                </div>
        
                   <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Rating</label>
                        <input onChange={handleChange} id="rating" name="rating" value={product.rating} type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                
                 <div>
                    <label className="text-base font-medium" htmlFor="">SIZE</label>
                     <div className="grid grid-cols-2 gap-4 mt-2">
                        {
                           sizes && sizes.length &&
                            sizes.map((s,index) => (
                                <div>
                                    <label htmlFor="">{s.size === "S" ? "Small" : s.size === "M" ? "Medium" : s.size === "L" ? "Large" : s.size === "X" ? "Large" : s.size === "XL" ? "Extra Large" : "XXL" }</label>
                                    <input className="w-full border border-gray-300 px-2 py-1.5 text-sm" placeholder="quantity" value={s.stock} onChange={(e) => handleSizeChange(index,e.target.value)} type="number"  />
                                </div>
                            ))
                        }
                 
                    </div>
                 </div>
                 <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={handleChange} name="originalPrice" value={product.originalPrice} id="" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input onChange={handleChange} id="offer-price" name="discountedPrice" value={product.discountedPrice} type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>
                <button type="submit" className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">Update</button>
            </form>
        </div>
    );
};

export default EditProduct;