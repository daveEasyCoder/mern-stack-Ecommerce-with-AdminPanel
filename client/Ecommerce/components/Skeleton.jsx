import React from 'react'

const Loader = () => {
  return (
    <section className="pt-20 bg-white dark:bg-gray-900">
    <div className="container px-6 py-10 mx-auto animate-pulse">
        <h1 className="w-48 h-5 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>

        <div className="grid grid-cols-1 gap-8 mt-4 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
            {
                [1,2,3,4,5,6].map(num => (
                    <div key={num} className="w-full ">
                        <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                        
                        <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                        <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                    </div>
                ))
            }

        </div>
    </div>
</section>
  )
}

export default Loader