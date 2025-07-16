import React from 'react'
import img1 from '../src/assets/jacket.jpg'
import img2 from '../src/assets/bag.webp'
import img3 from '../src/assets/t-shirt.jpg'
import { useNavigate } from 'react-router-dom'
import { useEcommerce } from '../context/EcommerceContext'
const BestCategory = () => {

    const navigate = useNavigate()

    const categories = [{
        name:"Men",
        image:img1
    },{
        name:"Women",
        image:img2
    },{
        name:"Kids",
        image:img3
    },{
        name:"Accessories",
        image:img1
    }]
  return (
    <div className='max-w-6xl mx-auto py-15 px-3'>
        <div className='mb-4'>
            <h1 className='text-3xl font-bold'>Our Best Category</h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
            {
                categories.map((category,index) => (
                       <div key={index} onClick={() => navigate(`category-view/${category.name}`)} className='category-item relative overflow-hidden'>
                            <img className='w-full h-80 hover:scale-110  object-cover' src={category.image} alt="" />
                            <div className='absolute flex items-end justify-center inset-0 bg-black/20'>
                            <div className='text-center px-1.5'>
                                <h1 className='text-white text-2xl mb-2'>{category.name}</h1>
                            </div>
                            </div>
                       </div>
                ))
            }
        </div>
    </div>
  )
}

export default BestCategory