import { createContext,useContext, useEffect, useState } from "react";

const context = createContext(null)

export const useEcommerce = () => useContext(context)

const EcommerceProvider = ({children}) => {

    const [products,setProducts] = useState([])
    const [carts,setCarts] = useState([])

    const getStoredProducts = () => {
        const storedProducts = localStorage.getItem("products")
        if(storedProducts){
            setProducts(JSON.parse(storedProducts))
        }
    }

    useEffect(() => {
        getStoredProducts()
    },[])

    return <context.Provider value={{products,setProducts,carts,setCarts}}>
        {children}
    </context.Provider>
}
export default EcommerceProvider