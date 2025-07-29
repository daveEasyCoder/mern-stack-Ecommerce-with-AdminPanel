import React from 'react'
import {SyncLoader} from "react-spinners";
const Loader = () => {
  return (
   <div className='h-[90vh] flex items-center justify-center flex-col'><SyncLoader className="text-gray-800" size={10} /></div>
  )
}

export default Loader