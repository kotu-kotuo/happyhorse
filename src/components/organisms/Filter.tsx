import React from "react";
import { filterInitialValues } from "../../utils/initialValues";
import FilterAreaSelect from "../atoms/FilterAreaSelect";

const Filter = (props) => {
  const {
    filterPost,
    setPriceMin,
    setPriceMax,
    setAgeMin,
    setAgeMax,
    setHeightMin,
    setHeightMax,
    setBreed,
    setColor,
    category,
    setCategory,
    priceMin,
    priceMax,
    ageMin,
    ageMax,
    heightMin,
    heightMax,
    breed,
    color,
    area,
    setArea,
    feature,
    setFeature,
    showOnlyAvailable,
    setShowOnlyAvailable,
    filterClear,
  } = props;

  const handleCategory = async (e: React.MouseEvent<HTMLElement>) => {
    const value = e.currentTarget.getAttribute("data-value");
    console.log(1, category, value);
    if (category.length === filterInitialValues.category.length) {
      console.log(2, category, value);
      await setCategory([value]);
    } else {
      if (category.includes(value)) {
        console.log(4, category, value);
        if (category.length === 1) {
          setCategory(filterInitialValues.category);
        } else {
          const filterArray = await category.filter(
            (category) => category !== value
          );
          await setCategory([...filterArray]);
        }
      } else {
        console.log(3, category, value);
        await setCategory([value, ...category]);
      }
    }
  };

  const handleArea = async (e: React.MouseEvent<HTMLElement>) => {
    const value = e.currentTarget.getAttribute("data-value").split(",");
    console.log(1, area, value);
    if (area.length === filterInitialValues.area.length) {
      console.log(2, area, value);
      await setArea(value);
    } else {
      if (area.includes(value[0])) {
        console.log(4, area, value);
        if (area.length < 10) {
          setArea(filterInitialValues.area);
        } else {
          const filterArray = await area.filter(
            (area) => !value.includes(area)
          );
          await setArea([...filterArray]);
        }
      } else {
        console.log(3, area, value);
        await setArea([...value, ...area]);
      }
    }
  };

  const handleFeature = async (e: React.MouseEvent<HTMLElement>) => {
    const value = e.currentTarget.getAttribute("data-value");
    console.log(1, feature, value);
    if (feature.length === filterInitialValues.features.length) {
      console.log(2, feature, value);
      await setFeature([value]);
    } else {
      if (feature.includes(value)) {
        console.log(4, feature, value);
        if (feature.length === 1) {
          setFeature(filterInitialValues.features);
        } else {
          const filterArray = await feature.filter(
            (feature) => feature !== value
          );
          await setFeature([...filterArray]);
        }
      } else {
        console.log(3, feature, value);
        await setFeature([value, ...feature]);
      }
    }
  };

  const handleBreed = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "allBreed") {
      setBreed(filterInitialValues.breed);
    } else {
      setBreed([e.target.value]);
    }
  };

  const handleColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "allColor") {
      setColor(filterInitialValues.color);
    } else {
      setColor([e.target.value]);
    }
  };

  return (
    <div>
      <form onSubmit={filterPost}>
        <div className="px-4 py-6 shadow-md border border-gray-50 rounded-lg">
          <div className=" text-center text-sm font-semibold text-gray-400 opacity-95">
            絞り込み検索
          </div>

          <div
            className="flex items-center cursor-pointer mt-8 mb-8 pl-1"
            onClick={() => {
              setShowOnlyAvailable(!showOnlyAvailable);
            }}
          >
            <div className="relative mr-3">
              <div
                className={
                  showOnlyAvailable
                    ? "w-10 h-4 bg-mainGreen bg-opacity-60 rounded-full shadow-inner ease-in-out transition-all duration-100"
                    : "w-10 h-4 bg-gray-400 rounded-full shadow-inner ease-in-out transition-all duration-100"
                }
              ></div>
              <div
                className={
                  showOnlyAvailable
                    ? "absolute w-6 h-6 bg-mainGreen rounded-full shadow -left-1 -top-1  ease-in-out transition-all duration-300 transform translate-x-full"
                    : "absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1  ease-in-out transition-all duration-300"
                }
              ></div>
            </div>
            <div className="text-sm text-gray-700 hover:opacity-80">
              販売中のみ表示
            </div>
          </div>

          <div className="mb-4 mt-7 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            カテゴリー
          </div>
          <div className="flex flex-wrap lg:block">
            {filterInitialValues.category.map((element, index) => (
              <div
                key={index}
                className="flex items-center mr-3.5 mb-2  hover:bg-gray-50 hover:opacity-95 cursor-pointer rounded-full lg:mr-0"
                onClick={handleCategory}
                data-value={element}
              >
                <div
                  className={
                    category.includes(element) &&
                    !(category.length === filterInitialValues.category.length)
                      ? "h-4 w-4 bg-mainGreen rounded-full mr-1 transition-all duration-200 ease-in lg:mr-2"
                      : "h-4 w-4 bg-transparent border border-gray-300 rounded-full mr-1 transition-all duration-200 ease-in lg:mr-2"
                  }
                ></div>
                <div className="text-sm text-gray-700">{element}</div>
              </div>
            ))}
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            価格
          </div>
          <div className="flex">
            <input
              type="number"
              name="price"
              placeholder="min"
              value={priceMin === filterInitialValues.priceMin ? "" : priceMin}
              className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPriceMin(e.target.valueAsNumber)
              }
            />
            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            <input
              type="number"
              name="price"
              placeholder="max"
              value={priceMax === filterInitialValues.priceMax ? "" : priceMax}
              className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPriceMax(e.target.valueAsNumber)
              }
            />
          </div>

          <div className="mb-4 mt-10 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            年齢
          </div>
          <div className="flex">
            <input
              type="number"
              name="age"
              placeholder="min"
              value={ageMin === filterInitialValues.ageMin ? "" : ageMin}
              className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAgeMin(e.target.valueAsNumber)
              }
            />
            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            <input
              type="number"
              name="age"
              placeholder="max"
              value={ageMax === filterInitialValues.ageMax ? "" : ageMax}
              className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAgeMax(e.target.valueAsNumber)
              }
            />
          </div>

          <div className="mb-4 mt-10 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            身長(cm)
          </div>
          <div className="flex">
            <input
              type="number"
              name="height"
              placeholder="min"
              value={
                heightMin === filterInitialValues.heightMin ? "" : heightMin
              }
              className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHeightMin(e.target.valueAsNumber)
              }
            />
            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            <input
              type="number"
              name="height"
              placeholder="max"
              value={
                heightMax === filterInitialValues.heightMax ? "" : heightMax
              }
              className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHeightMax(e.target.valueAsNumber)
              }
            />
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            品種
          </div>
          <div className="mb-3">
            <select
              name="breed"
              className="text-sm text-gray-700 w-full appearance-none relative cursor-pointer block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              onChange={handleBreed}
            >
              <option hidden></option>
              <option
                value="allBreed"
                selected={breed.length === filterInitialValues.breed.length}
              ></option>
              {filterInitialValues.breed.map((element, index) => (
                <option
                  key={index}
                  value={`${element}`}
                  selected={
                    breed.includes(`${element}`) &&
                    !(breed.length === filterInitialValues.breed.length)
                      ? true
                      : false
                  }
                >
                  {`${element}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            毛色
          </div>
          <select
            name="color"
            className="text-sm text-gray-700 w-full appearance-none relative cursor-pointer block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            onChange={handleColor}
          >
            <option hidden></option>
            <option
              value="allColor"
              selected={color.length === filterInitialValues.color.length}
            ></option>
            {filterInitialValues.color.map((element, index) => (
              <option
                key={index}
                value={`${element}`}
                selected={
                  color.includes(`${element}`) &&
                  !(color.length === filterInitialValues.color.length)
                    ? true
                    : false
                }
              >{`${element}`}</option>
            ))}
          </select>

          <div className="mb-4 mt-10 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            地域
          </div>
          <div className="flex flex-wrap lg:block">
            <div className="mr-3.5 mb-2 lg:mr-0">
              <FilterAreaSelect
                handleArea={handleArea}
                area={area}
                dataValue={[
                  "北海道",
                  "青森県",
                  "秋田県",
                  "福島県",
                  "岩手県",
                  "山形県",
                  "宮城県",
                ]}
                label={"北海道・東北"}
              />
            </div>
            <div className="mr-3.5 mb-2 lg:mr-0">
              <FilterAreaSelect
                handleArea={handleArea}
                area={area}
                dataValue={[
                  "茨城県",
                  "栃木県",
                  "群馬県",
                  "埼玉県",
                  "千葉県",
                  "東京都",
                  "神奈川県",
                ]}
                label={"関東"}
              />
            </div>
            <div className="mr-3.5 mb-2 lg:mr-0">
              <FilterAreaSelect
                handleArea={handleArea}
                area={area}
                dataValue={[
                  "愛知県",
                  "岐阜県",
                  "福井県",
                  "山梨県",
                  "石川県",
                  "新潟県",
                  "富山県",
                  "長野県",
                  "静岡県",
                ]}
                label={"中部"}
              />
            </div>
            <div className="mr-3.5 mb-2 lg:mr-0">
              <FilterAreaSelect
                handleArea={handleArea}
                area={area}
                dataValue={[
                  "三重県",
                  "大阪府",
                  "京都府",
                  "兵庫県",
                  "奈良県",
                  "滋賀県",
                  "和歌山県",
                ]}
                label={"近畿"}
              />
            </div>
            <div className="mr-3.5 mb-2 lg:mr-0">
              <FilterAreaSelect
                handleArea={handleArea}
                area={area}
                dataValue={[
                  "岡山県",
                  "広島県",
                  "鳥取県",
                  "島根県",
                  "山口県",
                  "徳島県",
                  "香川県",
                  "愛媛県",
                  "高知県",
                ]}
                label={"中国・四国"}
              />
            </div>
            <div className="mr-3.5 mb-2 lg:mr-0">
              <FilterAreaSelect
                handleArea={handleArea}
                area={area}
                dataValue={[
                  "福岡県",
                  "大分県",
                  "佐賀県",
                  "長崎県",
                  "宮崎県",
                  "鹿児島県",
                  "沖縄県",
                  "熊本県",
                ]}
                label={"九州・沖縄"}
              />
            </div>
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            特徴
          </div>
          <div className="flex flex-wrap lg:block">
            {filterInitialValues.features.map((element, index) => (
              <div
                key={index}
                className="flex items-center mr-3.5 mb-2  hover:bg-gray-50 hover:opacity-95 cursor-pointer rounded-full lg:mr-0"
                onClick={handleFeature}
                data-value={element}
              >
                <div
                  className={
                    feature.includes(element) &&
                    !(feature.length === filterInitialValues.features.length)
                      ? "h-4 w-4 bg-mainGreen rounded-full mr-1 transition-all duration-200 ease-in lg:mr-2"
                      : "h-4 w-4 bg-transparent border border-gray-300 rounded-full mr-1 transition-all duration-200 ease-in lg:mr-2"
                  }
                  hidden={element === "empty"}
                ></div>
                <div
                  className="text-sm text-gray-700"
                  hidden={element === "empty"}
                >
                  {element}
                </div>
              </div>
            ))}
          </div>

          {/* <div className="mb-3 text-xs font-medium text-mainGreen">
                  さらに表示
                </div> */}

          <div className="flex justify-center mt-8 lg:justify-self-auto">
            <button
              type="submit"
              className="mr-1.5 whitespace-nowrap focus:outline-none text-white text-base font-semibold py-2 px-5 rounded-md bg-gray-400 block w-44 hover:opacity-90 hover:shadow-lg lg:mx-auto"
            >
              検索
            </button>
            <button
              type="submit"
              className="ml-1.5 text-center whitespace-nowrap border border-gray-400 box-border focus:outline-none text-gray-400 text-base rounded-md bg-white block w-20 hover:bg-gray-400 hover:shadow-lg hover:text-white duration-200 lg:mx-auto"
              onClick={filterClear}
            >
              クリア
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filter;
