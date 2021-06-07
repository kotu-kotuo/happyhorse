import React from "react";

const TableListItem = (props) => {
  const { label, value } = props;
  return (
    <div>
      <div className="flex mb-3">
        <div className="fontSize-base w-1/4 text-gray-600 md:ml-10">
          {label}
        </div>
        <div className="fontSize-base w-3/4 text-gray-700 font-semibold">
          {value}
        </div>
      </div>
      <div className="border-b shadow-xs"></div>
    </div>
  );
};

export default TableListItem;
