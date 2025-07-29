import { createContext,useContext, useEffect, useState } from "react";

const context = createContext(null)

export const useEcommerce = () => useContext(context)

const EcommerceProvider = ({children}) => {

    const [products,setProducts] = useState([])
    const [carts,setCarts] = useState([])
    const[myOrders,setMyOrders] = useState([])
    const[user,setUser] = useState(null)
    const[admin,setAdmin] = useState(null)

    const url = "http://localhost:301"


    const getStoredProducts = () => {
        const storedProducts = localStorage.getItem("products")
        if(storedProducts){
            setProducts(JSON.parse(storedProducts))
        }
    }

    useEffect(() => {
        getStoredProducts()
    },[])

    return <context.Provider value={{url,products,setProducts,carts,setCarts,myOrders,setMyOrders,user,setUser,admin,setAdmin}}>
        {children}
    </context.Provider>
}
export default EcommerceProvider