import React from "react";
import { MdArrowDropDown } from "react-icons/md";

interface ProfileInterface {
  name: string;
}

const StoreSignInProfile = ({name}: ProfileInterface) => {
  return (
    <div className="flex flex-col w-fit items-start justify-center hover:cursor-pointer">
      <div className="text-xs">
        <p>Hello, {name}</p>
      </div>
      <div className="flex items-center text-sm font-bold">
        <p>Profile & Orders</p>
        <MdArrowDropDown className="text-gray-400 text-xl" />
      </div>
    </div>
  );
};

export default StoreSignInProfile;
