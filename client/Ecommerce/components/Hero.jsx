import React from 'react'
import { FaStar } from 'react-icons/fa'
import { FaTruck, FaShippingFast } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { FaHeadset, FaClock } from 'react-icons/fa';
import personal from '../src/assets/personal.jfif'
const Hero = () => {
  return (
           <div className='relative min-h-screen pt-15'>
        <div className='flex flex-col md:flex-row items-center gap-2 max-w-6xl mx-auto px-3 mt-9'>
            <div className='md:w-1/2'>
                <h1 className='text-5xl font-bold leading-15'>Discover Your <br /><span className='text-yellow-500'>Perfect Style</span></h1>
                <p className='text-lg mt-4 text-gray-600 '>Explore our curated collection of premium products designed to elevate your lifestyle. Quality craftsmanship meets modern design in every piece.</p>
                <div className='flex items-center gap-2 mt-6'>
                    <span className='flex gap-1 text-yellow-400 text-xl'><FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar /></span>
                    <span className='font-medium text-gray-700'>4.9/5</span>
                    <span className=' text-gray-700'>from 2,399+ reviews</span>
                </div>
                <div className='flex items-center gap-6 mt-6'>
                    <button className='bg-black cursor-pointer rounded-sm text-white px-8 py-2'>Shop Now</button>
                    <button className='cursor-pointer rounded-sm text-gray-700 border border-gray-300 px-8 py-2'>View Catalog</button>
                </div>

                <div className='flex items-center justify-between w-[80%] mt-14'>
                    <div className='flex flex-col items-center justify-center gap-1'>
                        <div className='w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center'><FaTruck /></div>
                        <p className='text-sm font-medium text-gray-900'>Free Shipping</p>
                        <p className='text-xs text-gray-600'>Order over $50</p>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-1'>
                        <div className='w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center'><MdSecurity size={17} /></div>
                        <p className='text-sm font-medium text-gray-900'>Secure Payment</p>
                        <p className='text-xs text-gray-600'> SSL Protected</p>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-1'>
                        <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center'><FaHeadset /></div>
                        <p className='text-sm font-medium text-gray-900'>24/7 Support</p>
                        <p className='text-xs text-gray-600'>Always here</p>
                    </div>
                </div>

            </div>
            <div className='md:w-1/2 relative shadow-2xl'>
                <img className='w-full h-full object-cover rounded-sm shadow-lg' src={personal} alt="" />
                <div className='px-3 py-4 rounded-sm absolute -bottom-4 -left-6 bg-white border border-gray-200 flex gap-2 items-center shadow-lg'>
                    <div className='w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center'> <FaClock /></div>
                    <div>
                        <p className='font-medium text-gray-800'>Limited Time</p>
                        <p className='text-sm text-gray-600'>Special offers available</p>
                    </div>
                </div>
                <div className='px-4 py-1.5 bg-red-600 rounded-full absolute -top-5 -right-4 text-white font-bold text-sm'>30% OFF</div>
            </div>
        </div>

        {/*  */}
        
        <div className="absolute -top-10 -right-10 h-64 w-64 bg-pink-600 opacity-20 blur-3xl rounded-full -z-10"></div>
        <div className="absolute -bottom-10 -left-10 h-64 w-64 bg-blue-600 opacity-20 blur-3xl rounded-full -z-10"></div>

    </div>  
  )
}

export default Hero