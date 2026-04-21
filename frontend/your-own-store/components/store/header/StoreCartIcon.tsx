import React from 'react'
import { BsCart3 } from "react-icons/bs";

interface StoreCartInterface {
  cartCount: number;
}

const StoreCartIcon = ({cartCount}: StoreCartInterface) => {
  return (
    <div className="w-fit flex items-center font-extrabold">
              <div className="relative">
                <p className="absolute -top-4 right-2 text-[#ffa500]">{cartCount}</p>
                <BsCart3 size={22}/>
              </div>
              <div className="text-sm font-bold">
                Cart
              </div>
            </div>
  )
}

export default StoreCartIcon