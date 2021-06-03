import React from "react";
import { filterInitialValues } from "../../utils/initialValues";

const FilterAreaSelect = (props) => {
  const { handleArea, area, dataValue, label } = props;
  return (
    <div
      className="flex items-center hover:bg-gray-50 hover:opacity-95 cursor-pointer rounded-full"
      onClick={handleArea}
      data-value={dataValue}
    >
      <div
        className={
          area.includes(dataValue[0]) &&
          !(area.length === filterInitialValues.area.length)
            ? "h-4 w-4 bg-mainGreen rounded-full mr-1 transition-all duration-200 ease-in lg:mr-2"
            : "h-4 w-4 bg-transparent border border-gray-300 rounded-full mr-1 transition-all duration-200 ease-in lg:mr-2"
        }
      ></div>
      <div className="text-sm text-gray-700">{label}</div>
    </div>
  );
};

export default FilterAreaSelect;
