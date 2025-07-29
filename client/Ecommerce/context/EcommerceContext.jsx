import { createContext,useContext, useEffect, useState } from "react";

const EcommerceContext = createContext(null)

export const useEcommerce = () => useContext(EcommerceContext)

const EcommerceProvider = ({children = null}) => {

    const [products,setProducts] = useState([])
    const [carts,setCarts] = useState([])
    const[myOrders,setMyOrders] = useState([])
    const[user,setUser] = useState(null)
    const[admin,setAdmin] = useState(null)

    const url = "https://shopswift-frvx.onrender.com"


    const getStoredProducts = () => {
        const storedProducts = localStorage.getItem("products")
        if(storedProducts){
            setProducts(JSON.parse(storedProducts))
        }
    }

    useEffect(() => {
        getStoredProducts()
    },[])

    return <EcommerceContext.Provider value={{url,products,setProducts,carts,setCarts,myOrders,setMyOrders,user,setUser,admin,setAdmin}}>
        {children}
    </EcommerceContext.Provider>
}
export default EcommerceProvider
