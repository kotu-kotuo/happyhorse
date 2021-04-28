import React from "react";
import { filterInitialValues } from "../../utils/initialValues";

const Filter = (props) => {
  return (
    <div>
      <form onSubmit={props.filterPost}>
        <div className="px-4 py-6 shadow-md border border-gray-50 rounded-lg">
          <div className=" text-center text-sm font-semibold text-gray-400 opacity-95">
            絞り込み検索
          </div>

          <div className="mb-4 mt-7 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            カテゴリー
          </div>
          <div className="checklist">
            {props.category?.length === filterInitialValues.category.length ? (
              //filterInitialValuesを表示に反映させたくないので条件分岐
              <>
                {filterInitialValues.category.map((element) => (
                  <>
                    <input
                      id={`${element}`}
                      name="category"
                      value={`${element}`}
                      type="checkbox"
                      className="hidden w-full"
                      onChange={props.handleCategory}
                    />
                    <label htmlFor={`${element}`} className="filterCheckText">
                      {`${element}`}
                    </label>
                  </>
                ))}
              </>
            ) : (
              <>
                {filterInitialValues.category.map((element) => (
                  <>
                    <input
                      id={`${element}`}
                      name="category"
                      value={`${element}`}
                      type="checkbox"
                      className="hidden w-full"
                      checked={props.category.includes(`${element}`)}
                      onChange={props.handleCategory}
                    />
                    <label htmlFor={`${element}`} className="filterCheckText">
                      {`${element}`}
                    </label>
                  </>
                ))}
              </>
            )}
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            価格
          </div>
          <div className="flex">
            {props.priceMin === filterInitialValues.priceMin ? (
              <input
                type="number"
                name="price"
                placeholder="min"
                value=""
                className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setPriceMin(e.target.valueAsNumber)}
              />
            ) : (
              <input
                type="number"
                name="price"
                placeholder="min"
                value={props.priceMin}
                className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setPriceMin(e.target.valueAsNumber)}
              />
            )}

            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            {props.priceMax === filterInitialValues.priceMax ? (
              <input
                type="number"
                name="price"
                placeholder="max"
                value=""
                className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setPriceMax(e.target.valueAsNumber)}
              />
            ) : (
              <input
                type="number"
                name="price"
                placeholder="max"
                value={props.priceMax}
                className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setPriceMax(e.target.valueAsNumber)}
              />
            )}
          </div>

          <div className="mb-4 mt-10 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            年齢
          </div>
          <div className="flex">
            {props.ageMin === filterInitialValues.ageMin ? (
              <input
                type="number"
                name="age"
                placeholder="min"
                value=""
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setAgeMin(e.target.valueAsNumber)}
              />
            ) : (
              <input
                type="number"
                name="age"
                placeholder="min"
                value={props.ageMin}
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setAgeMin(e.target.valueAsNumber)}
              />
            )}
            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            {props.ageMax === filterInitialValues.ageMax ? (
              <input
                type="number"
                name="age"
                placeholder="max"
                value=""
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setAgeMax(e.target.valueAsNumber)}
              />
            ) : (
              <input
                type="number"
                name="age"
                placeholder="max"
                value={props.ageMax}
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setAgeMax(e.target.valueAsNumber)}
              />
            )}
          </div>

          <div className="mb-4 mt-10 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            身長(cm)
          </div>
          <div className="flex">
            {props.heightMin === filterInitialValues.heightMin ? (
              <input
                type="number"
                name="height"
                placeholder="min"
                value=""
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setHeightMin(e.target.valueAsNumber)}
              />
            ) : (
              <input
                type="number"
                name="height"
                placeholder="min"
                value={props.heightMin}
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setHeightMin(e.target.valueAsNumber)}
              />
            )}

            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>

            {props.heightMax === filterInitialValues.heightMax ? (
              <input
                type="number"
                name="height"
                placeholder="max"
                value=""
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setHeightMax(e.target.valueAsNumber)}
              />
            ) : (
              <input
                type="number"
                name="height"
                placeholder="max"
                value={props.heightMax}
                className="w-20 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
                onChange={(e) => props.setHeightMax(e.target.valueAsNumber)}
              />
            )}
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            品種
          </div>
          <div className="mb-3">
            {props.breed.length === filterInitialValues.breed.length ? (
              <select
                name="breed"
                className="text-sm text-gray-700 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                onChange={props.handleBreed}
              >
                <option hidden></option>
                <option value="allBreed"></option>
                {filterInitialValues.breed.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            ) : (
              <select
                name="breed"
                className="text-sm text-gray-700 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                onChange={props.handleBreed}
              >
                <option hidden></option>
                <option
                  value="allBreed"
                  selected={
                    props.breed.length === filterInitialValues.breed.length
                  }
                ></option>
                {filterInitialValues.breed.map((element) => (
                  <option
                    value={`${element}`}
                    selected={props.breed.includes(`${element}`)}
                  >
                    {`${element}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            毛色
          </div>
          {props.color.length === filterInitialValues.color.length ? (
            <select
              name="color"
              className="text-sm text-gray-700 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              onChange={props.handleColor}
            >
              <option hidden></option>
              <option value="allColor"></option>
              {filterInitialValues.color.map((element) => (
                <option value={`${element}`}>{`${element}`}</option>
              ))}
            </select>
          ) : (
            <select
              name="color"
              className="text-sm text-gray-700 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              onChange={props.handleColor}
            >
              <option hidden></option>
              <option
                value="allColor"
                selected={
                  props.color.length === filterInitialValues.color.length
                }
              ></option>
              {filterInitialValues.color.map((element) => (
                <option
                  value={`${element}`}
                  selected={props.color.includes(`${element}`)}
                >{`${element}`}</option>
              ))}
            </select>
          )}

          <div className="mb-4 mt-10 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            地域
          </div>
          <div className="checklist">
            {props.area.length === filterInitialValues.area.length ? (
              <>
                <input
                  id="北海道・東北"
                  name="area"
                  value={[
                    "北海道",
                    "青森県",
                    "秋田県",
                    "福島県",
                    "岩手県",
                    "山形県",
                    "宮城県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleArea}
                />
                <label htmlFor="北海道・東北" className="filterCheckText">
                  北海道・東北
                </label>
                <input
                  id="関東"
                  name="area"
                  value={[
                    "茨城県",
                    "栃木県",
                    "群馬県",
                    "埼玉県",
                    "千葉県",
                    "東京都",
                    "神奈川県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleArea}
                />
                <label htmlFor="関東" className="filterCheckText">
                  関東
                </label>
                <input
                  id="中部"
                  name="area"
                  value={[
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
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleArea}
                />
                <label htmlFor="中部" className="filterCheckText">
                  中部
                </label>
                <input
                  id="近畿"
                  name="area"
                  value={[
                    "三重県",
                    "大阪府",
                    "京都府",
                    "兵庫県",
                    "奈良県",
                    "滋賀県",
                    "和歌山県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleArea}
                />
                <label htmlFor="近畿" className="filterCheckText">
                  近畿
                </label>
                <input
                  id="中国・四国"
                  name="area"
                  value={[
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
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleArea}
                />
                <label htmlFor="中国・四国" className="filterCheckText">
                  中国・四国
                </label>
                <input
                  id="九州・沖縄"
                  name="area"
                  value={[
                    "福岡県",
                    "大分県",
                    "佐賀県",
                    "長崎県",
                    "宮崎県",
                    "鹿児島県",
                    "沖縄県",
                    "熊本県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleArea}
                />
                <label htmlFor="九州・沖縄" className="filterCheckText">
                  九州・沖縄
                </label>
              </>
            ) : (
              <>
                <input
                  id="北海道・東北"
                  name="area"
                  value={[
                    "北海道",
                    "青森県",
                    "秋田県",
                    "福島県",
                    "岩手県",
                    "山形県",
                    "宮城県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.area.includes("北海道")}
                  onChange={props.handleArea}
                />
                <label htmlFor="北海道・東北" className="filterCheckText">
                  北海道・東北
                </label>
                <input
                  id="関東"
                  name="area"
                  value={[
                    "茨城県",
                    "栃木県",
                    "群馬県",
                    "埼玉県",
                    "千葉県",
                    "東京都",
                    "神奈川県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.area.includes("東京都")}
                  onChange={props.handleArea}
                />
                <label htmlFor="関東" className="filterCheckText">
                  関東
                </label>
                <input
                  id="中部"
                  name="area"
                  value={[
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
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.area.includes("愛知県")}
                  onChange={props.handleArea}
                />
                <label htmlFor="中部" className="filterCheckText">
                  中部
                </label>
                <input
                  id="近畿"
                  name="area"
                  value={[
                    "三重県",
                    "大阪府",
                    "京都府",
                    "兵庫県",
                    "奈良県",
                    "滋賀県",
                    "和歌山県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.area.includes("京都府")}
                  onChange={props.handleArea}
                />
                <label htmlFor="近畿" className="filterCheckText">
                  近畿
                </label>
                <input
                  id="中国・四国"
                  name="area"
                  value={[
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
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.area.includes("高知県")}
                  onChange={props.handleArea}
                />
                <label htmlFor="中国・四国" className="filterCheckText">
                  中国・四国
                </label>
                <input
                  id="九州・沖縄"
                  name="area"
                  value={[
                    "福岡県",
                    "大分県",
                    "佐賀県",
                    "長崎県",
                    "宮崎県",
                    "鹿児島県",
                    "沖縄県",
                    "熊本県",
                  ]}
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.area.includes("福岡県")}
                  onChange={props.handleArea}
                />
                <label htmlFor="九州・沖縄" className="filterCheckText">
                  九州・沖縄
                </label>
              </>
            )}
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            特徴
          </div>
          <div className="checklist">
            {props.feature.length === filterInitialValues.features.length ? (
              <>
                {filterInitialValues.features.map((element) => (
                  <>
                    <input
                      id={`${element}`}
                      name="feature"
                      value={`${element}`}
                      type="checkbox"
                      className="hidden w-full"
                      onChange={props.handleFeature}
                    />
                    <label htmlFor={`${element}`} className="filterCheckText">
                      {`${element}`}
                    </label>
                  </>
                ))}
              </>
            ) : (
              <>
                {filterInitialValues.features.map((element) => (
                  <>
                    <input
                      id={`${element}`}
                      name="feature"
                      value={`${element}`}
                      type="checkbox"
                      className="hidden w-full"
                      checked={props.feature.includes(`${element}`)}
                      onChange={props.handleFeature}
                    />
                    <label htmlFor={`${element}`} className="filterCheckText">
                      {`${element}`}
                    </label>
                  </>
                ))}
              </>
            )}
          </div>

          {/* <div className="mb-3 text-xs font-medium text-mainGreen">
                  さらに表示
                </div> */}
          
          <div className="flex mt-8">
            <button // TODO: ログインしてなかったら遷移させたい
              type="submit"
              className="mx-auto whitespace-nowrap focus:outline-none text-white text-base font-semibold py-2 px-5 rounded-md bg-gray-400 block w-44 hover:opacity-90 hover:shadow-lg"
            >
              検索
            </button>
            <button
              type="submit"
              className="text-center mx-auto whitespace-nowrap border border-gray-400 box-border focus:outline-none text-gray-400 text-base rounded-md bg-white block w-20 hover:bg-gray-400 hover:shadow-lg hover:text-white duration-200"
              onClick={props.filterClear}
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
