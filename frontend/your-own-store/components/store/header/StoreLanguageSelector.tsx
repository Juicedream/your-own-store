import React from "react";
import { MdArrowDropDown } from "react-icons/md";
import { IoFlagSharp } from "react-icons/io5";
const StoreLanguageSelector = () => {
  return (
    <div className="flex w-fit items-center justify-center gap-1">
      {/* Language flag */}
      <IoFlagSharp size={20} color="orange" />
      {/* Language  */}
      <p className="uppercase font-extrabold">en</p>
      {/* Dropdown icon  */}
      <MdArrowDropDown className="text-gray-400 text-xl" />
    </div>
  );
};

export default StoreLanguageSelector