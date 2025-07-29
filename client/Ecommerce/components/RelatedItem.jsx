import React from 'react'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const RelatedItem = ({p}) => {

      const navigate = useNavigate()
  return (
     <div onClick={() => navigate(`/product-detail/${p._id}`)} className="hover:shadow-lg sm:border  hover:-translate-y-0.5 border-gray-200  transition-all">
          <div className="sm:p-4">
            <div className="mb-4 h-60 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`${url}/productImage/${p?.image[0]}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
              {/* product info */}
              <div className='px-2 sm:p-0'>
                 <h3 className="font-semibold mb-2 line-clamp-2">{p?.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${p.rating > i ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'} `}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">{p.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">${p?.originalPrice}</span>
                    <span className="text-sm text-gray-500 line-through">${p?.discountedPrice}</span>
                  </div>
              </div>
          </div>
        </div>
  )
}

export default RelatedItem