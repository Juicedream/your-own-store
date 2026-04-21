import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const StoreSearchBar = () => {
  return (
    <div className="mx-6 flex-1 sm:hidden lg:flex flex-row">
      {/* selector */}
      <div className="h-12 w-20 bg-gray-300 rounded-l-sm flex justify-center px-1">
        <select
          name=""
          id=""
          className="w-full text-black outline-none hover:cursor-pointer text-xs"
        >
          <option value="all">All</option>
          <option value="category">Category</option>
        </select>
      </div>
      {/* input bar */}
      <div className="flex-1 size-12 bg-white text-black">
        <input
          type="text"
          className="size-12 w-full px-2 font-semibold outline-none capitalize"
          placeholder="Search Your Own Store"
        />
      </div>
      {/* search icon */}
      <button className="h-12 w-12 bg-yellow-500 rounded-r-sm flex items-center justify-center hover:cursor-pointer">
        <FaMagnifyingGlass color="#0f172b" />
      </button>
    </div>
  );
};

export default StoreSearchBar;
