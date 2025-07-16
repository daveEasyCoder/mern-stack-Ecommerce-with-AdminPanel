import React from 'react'

import personal from '../src/assets/personal.jfif'
import ProductItem from './ProductItem';
import { useEcommerce } from '../context/EcommerceContext';

const Product = () => {

    const {products} = useEcommerce()

  return (
    <div className='pt-10'>
        <div>
             {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Best Selling Products</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover our most popular items loved by thousands of customers worldwide
                </p>
                <div className="mt-6 w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>


           <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
              {
                products && products.length ? products.slice(0,6).map((product,index) => (
                  <ProductItem key={index} product={product} />
                )) :
                <div className='col-span-3  flex items-center justify-center h-[20vh]'>
                  <p>Product Not Found</p>
                </div>
              }
        </div>
        </div>
    </div>
  )
}

export default Product