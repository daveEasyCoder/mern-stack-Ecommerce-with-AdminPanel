
import { useState } from "react";
import axios from 'axios'
const AddProduct = () => {

    const [product,setProduct] = useState({
        name:"",
        originalPrice:0,
        discountedPrice:0,
        description:"",
        rating:0,
        category:"",
        subCategory:""
    })
    const [images,setImages] = useState({
        image1:'',
        image2:'',
        image3:'',
        image4:''
    })
    const[sizes,setSizes] = useState([
        {size:"S",stock:0},
        {size:"M",stock:0},
        {size:"L",stock:0},
        {size:"XL",stock:0},
        {size:"XXL",stock:0},
    ]);

    const [error,setError] = useState("")
    const handleImageChange = (e) => {
          setImages(prev => ({...prev, [e.target.name]:e.target.files[0]}))
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
        setError("")
        if(!images.image1 && !images.image2 && !images.image3 && !images.image4){
           console.log("image required");
           
        }else if(!product.name || !product.originalPrice || !product.discountedPrice || !product.description || !product.rating || !product.category || !product.subCategory){
           console.log("all fields are required");
           setError("All fields are required");
        }else if(product.rating < 0){
            setError("rating cannot be negative")
        }else if(product.rating > 5){
            setError("rating cannot greater than 5")
        } else{
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

                if(images.image1){
                    formData.append("image",images.image1)
                }
                if(images.image2){
                    formData.append("image",images.image2)
                }
                if(images.image3){
                    formData.append("image",images.image3)
                }
                if(images.image4){
                    formData.append("image",images.image4)
                }
                
                const res = await axios.post("http://localhost:301/api/product/add-product",formData)
                if(res.data && res.data.success){
                   alert(res.data.message)
                    console.log(res.data);
                    
                }
            } catch (error) {
              
                if(error.response){
                   if(error.response.data.message){
                    setError(error.response.data.message)
                   }
                }else{
                    setError("server is not responding.please try again!")
                    console.log(error);   
                }
                console.log(error)
                
            }     
        }
    }

    return (
        <div className="pt-15 flex flex-col justify-between ml-16 md:ml-60 bg-white">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-2xl">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <label className="border border-gray-300 rounded-sm">
                            <input onChange={handleImageChange} name="image1" accept="image/*" type="file"  hidden />
                            <img className="max-w-24 cursor-pointer" src={images.image1 ? URL.createObjectURL(images.image1) : "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} alt="uploadArea" width={100} height={100} />
                        </label>
                        <label className="border border-gray-300 rounded-sm">
                            <input onChange={handleImageChange} name="image2" accept="image/*" type="file"  hidden />
                           <img className="max-w-24 cursor-pointer" src={images.image2 ? URL.createObjectURL(images.image2) : "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} alt="uploadArea" width={100} height={100} />
                        </label>
                        <label className="border border-gray-300 rounded-sm">
                            <input onChange={handleImageChange} name="image3" accept="image/*" type="file"  hidden />
                            <img className="max-w-24 cursor-pointer" src={images.image3 ? URL.createObjectURL(images.image3) : "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} alt="uploadArea" width={100} height={100} />
                        </label>
                        <label className="border border-gray-300 rounded-sm">
                            <input onChange={handleImageChange} name="image4" accept="image/*" type="file"  hidden />
                            <img className="max-w-24 cursor-pointer" src={images.image4 ? URL.createObjectURL(images.image4) : "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} alt="uploadArea" width={100} height={100} />
                        </label>
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

                 <div className="">
                   <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Rating</label>
                        <input onChange={handleChange} id="rating" name="rating" value={product.rating} type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                 </div>
                 <div>
                    <label className="text-base font-medium" htmlFor="">SIZE</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {
                            sizes.map((s,index) => (
                                <div>
                                    <label htmlFor="">{s.size === "S" ? "Small" : s.size === "M" ? "Medium" : s.size === "L" ? "Large" : s.size === "X" ? "Large" : s.size === "XL" ? "Extra Large" : "XXL" }</label>
                                    <input className="w-full border border-gray-300 px-2 py-1.5 text-sm" placeholder="quantity" onChange={(e) => handleSizeChange(index,e.target.value)} type="number"  />
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">ADD</button>
            </form>
        </div>
    );
};

export default AddProduct;