import React from "react";

const Category = (props) => {
  const { category } = props;
  return (
    <div>
      {category === "障害馬" && (
        <div className="fontSize-sm border rounded-full border-red-700 text-red-700 px-4 py-0.5 font-semibold w-20 whitespace-nowrap text-center">
          {category}
        </div>
      )}
      {category === "馬場馬" && (
        <div className="fontSize-sm border rounded-full border-blue-900 text-blue-900 px-4 py-0.5 font-semibold w-20 whitespace-nowrap text-center">
          {category}
        </div>
      )}
      {category === "総合馬" && (
        <div className="fontSize-sm border rounded-full border-green-800 text-green-800 px-4 py-0.5  font-semibold w-20 whitespace-nowrap text-center">
          {category}
        </div>
      )}
      {category === "レクレーション" && (
        <div className="fontSize-sm border rounded-full border-yellow-300 text-yellow-300 px-4 py-0.5  font-semibold w-20 whitespace-nowrap text-center">
          {category}
        </div>
      )}
    </div>
  );
};

export default Category;
