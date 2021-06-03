import Link from "next/link";
import React from "react";
import { IoChevronForwardOutline } from "react-icons/io5";

const MenuListItem = (props) => {
  const { label, link } = props;
  return (
    <div className="border-b">
      <Link href={link}>
        <a className="px-4 py-3.5 hover:bg-gray-100 flex items-center sm:py-4">
          <p className="text-sm font-medium text-gray-800 leading-none">
            {label}
          </p>
          <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
        </a>
      </Link>
    </div>
  );
};

export default MenuListItem;
