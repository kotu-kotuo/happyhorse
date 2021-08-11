import React from "react";
import { FC } from "react";

type Props = {
  category: string;
};

const Category: FC<Props> = (props) => {
  const { category } = props;
  return (
    <div>
      {category === "障害馬" && (
        <div className="fontSize-sm whitespace-nowrap border rounded-full border-red-700 text-red-700 px-4 pt-1 pb-0.5 font-bold sm:font-semibold inline-block sm:py-0.5">
          {category}
        </div>
      )}
      {category === "馬場馬" && (
        <div className="fontSize-sm whitespace-nowrap border rounded-full border-blue-900 text-blue-900  px-4 pt-1 pb-0.5 font-bold sm:font-semibold d inline-block sm:py-0.5">
          {category}
        </div>
      )}
      {category === "総合馬" && (
        <div className="fontSize-sm whitespace-nowrap border rounded-full border-green-800 text-green-800 px-4 pt-1 pb-0.5 font-bold sm:font-semibold  inline-block sm:py-0.5">
          {category}
        </div>
      )}
      {category === "レクレーション" && (
        <div className="fontSize-sm whitespace-nowrap border rounded-full border-yellow-300 text-yellow-300 px-4 pt-1 pb-0.5 font-bold sm:font-semibold  inline-block sm:py-0.5">
          {category}
        </div>
      )}
    </div>
  );
};

export default Category;
