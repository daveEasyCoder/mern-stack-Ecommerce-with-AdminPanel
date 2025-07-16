import React from 'react'

import { AiFillHeart } from 'react-icons/ai';

import { FaEye, FaStar } from 'react-icons/fa'
import {Link} from 'react-router-dom'

const ProductItem = ({product}) => {

  return (
     <div
              key={product._id}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
            >
              <div className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={`http://localhost:301/productImage/${product?.image[0]}`}
                    alt={product?.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Wishlist Button */}
                  <button
                    className="absolute top-3 right-3 z-20 rounded-full p-2 hover:bg-white transition-all duration-200"  
                  >
                    <AiFillHeart
                      className="h-5 w-5 fill-red-500"
                    />
                  </button>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"> </div>
                 </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product?.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product?.rating} ({458} reviews)
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{product.name}</h3>

                  {/* Pricing */}
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">${product?.originalPrice}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">${product?.discountedPrice}</span>
                    <span className="text-sm text-green-600 font-semibold ml-2">
                      Save ${product?.discount.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-2 py-1 text-sm border border-gray-300 rounded-sm">
                         {product?.category}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link to = {`/product-detail/${product._id}`}
                      className="flex justify-center gap-2 items-center flex-1 bg-yellow-500 py-2 text-white font-semibold"
                    >
                      <FaEye className="" />
                     <span>View product</span>
                    </Link>
                    <button
                     
                      className="px-4 py-2 border border-gray-300  hover:bg-green-50 bg-transparent"
                    > 
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default ProductItem