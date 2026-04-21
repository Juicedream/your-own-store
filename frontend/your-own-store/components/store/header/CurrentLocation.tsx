import React from "react";
import { IoLocationOutline } from "react-icons/io5";

interface LocationInterface {
  location: string;
}

const CurrentLocation = ({ location }: LocationInterface) => {
  return (
    <div className="w-fit h-10 relative flex justify-end items-end p-0">
      {/* text */}
      <p className="font-light text-sm absolute top-0">Deliver to</p>
      {/* location with pin icon */}
      <IoLocationOutline className="font-bold my-1" size={22} />
      <p className="text-md font-bold flex flex-row items-center ">
        {location}
      </p>
    </div>
  );
};

export default CurrentLocation;
