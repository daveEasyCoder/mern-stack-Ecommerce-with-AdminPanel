import React, { useEffect, useState } from 'react'
import ProductItem from '../components/ProductItem'
import { useEcommerce } from '../context/EcommerceContext'
import RelatedItem from '../components/RelatedItem'


const Collections = () => {
    const {products} = useEcommerce()
    const [filteredCategory,setFilteredCategory] = useState([])
     
    const [category,setCategory] = useState([])
    const [subCategory,setSubcategory] = useState([])
     
    const handleCategoryChange = (e) => {
        if(category.includes(e.target.value)){
          setCategory(prev => prev.filter(item => item !== e.target.value))
        }else{
          setCategory(prev => [...prev,e.target.value])
        }
    }
    const handleSubCategoryChange = (e) => {
        if(subCategory.includes(e.target.value)){
          setSubcategory(prev => prev.filter(item => item !== e.target.value))
        }else{
          setSubcategory(prev => [...prev,e.target.value])
        }
    }
  
    const applyFilter = () => {
       let product = products.slice()
       if(category && category.length > 0){
         product = product.filter(item => category.includes(item.category))
       }

        if(subCategory && subCategory.length > 0){
         product = product.filter(item => subCategory.includes(item.subCategory))
       }
        // console.log(product);
       
       setFilteredCategory(product)


    }
    
    // useEffect(() => {
    //     setFilteredCategory(products)
    // },[])

    useEffect(() => {
      applyFilter()
    },[category,subCategory])
    
    
  return (
    <div className='pt-20'>
        <div className='max-w-7xl px-3 mx-auto flex flex-col sm:flex-row items-start gap-5'>
            <div className='sm:sticky top-17'>
                <div className='flex flex-row sm:flex-col items-start gap-7 sm:gap-3 rounded px-9 py-3 border border-gray-300'>
                  <div>
                     <h1 className='font-bold'>Category</h1>
                      <div className='pl-2 mt-1 flex  flex-col gap-1'>
                          <div className='flex items-center gap-1'>
                          <input onChange={handleCategoryChange} type="checkbox" name="Men" value={"Men"}/>
                          <span>Men</span>
                        </div>
                          <div className='flex items-center gap-1'>
                              <input  onChange={handleCategoryChange} name="Women" type="checkbox" value={"Women"} />
                              <span>Women</span>
                          </div>
                          <div className='flex items-center gap-1'>
                              <input  onChange={handleCategoryChange} name="Kids" type="checkbox" value={"Kids"} />
                              <span>Kids</span>
                          </div>
                      </div>
                  </div>
                   <div>
                       <h1 className='font-bold'>SubCategory</h1>
                        <div className='pl-2 mt-1 flex  flex-col gap-1'>
                            {
                                ["Shoes","Jeans","Watches","T-shirt","Jacket","Skirts","SportsWear","Shorts"].map((item,index) => (
                                        <div key={index} className='flex items-center gap-1'>
                                            <input onChange={handleSubCategoryChange} type="checkbox" name={item} value={item}/>
                                            <span>{item}</span>
                                        </div>
                                ))
                            }
                          
                        </div>
                   </div>
                </div>
            </div>
            <div className='flex-1'>
                <div>
                    <div className='flex px-4 justify-end mb-1'>
                       <select className='border border-gray-300 px-2 py-1 text-sm rounded' name="" id="">
                         <option className='' value="">Sort by</option>
                         <option value="">option1</option>
                         <option value="">option1</option>
                       </select>
                    </div>
                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-3'>
                        {
                          filteredCategory && filteredCategory.length ?
                          filteredCategory.map((p,index) => (
                            <RelatedItem key={index} p={p} />
                          )) : <div className='col-span-3 flex items-center justify-center h-[70vh] text-shadow-gray-700'>No Product with this Category</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Collections