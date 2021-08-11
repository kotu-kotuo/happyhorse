import React, { JSXElementConstructor } from "react";
import { FC } from "react";

type Props = {
  label: string;
  value;
};

const TableListItem: FC<Props> = (props) => {
  const { label, value } = props;
  return (
    <div>
      <div className="flex mb-3 items-center">
        <div className="fontSize-base w-1/4 text-gray-600 md:ml-10">
          {label}
        </div>
        <div className="fontSize-base w-3/4 text-gray-700 font-bold sm:font-semibold">
          {value}
        </div>
      </div>
      <div className="border-b shadow-xs"></div>
    </div>
  );
};

export default TableListItem;
