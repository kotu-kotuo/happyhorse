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
            {props.category.length === filterInitialValues.category.length ? (
              //filterInitialValuesを表示に反映させたくないので条件分岐
              <>
                <input
                  id="障害馬"
                  name="category"
                  value="障害馬"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleCategory}
                />
                <label htmlFor="障害馬" className="filterCheckText">
                  障害馬
                </label>
                <input
                  id="馬場馬"
                  name="category"
                  value="馬場馬"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleCategory}
                />
                <label htmlFor="馬場馬" className="filterCheckText">
                  馬場馬
                </label>
                <input
                  id="総合馬"
                  name="category"
                  value="総合馬"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleCategory}
                />
                <label htmlFor="総合馬" className="filterCheckText">
                  総合馬
                </label>
                <input
                  id="レクレーション"
                  name="category"
                  value="レクレーション"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleCategory}
                />
                <label htmlFor="レクレーション" className="filterCheckText">
                  レクレーション
                </label>
              </>
            ) : (
              <>
                <input
                  id="障害馬"
                  name="category"
                  value="障害馬"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.category.includes("障害馬")}
                  onChange={props.handleCategory}
                />
                <label htmlFor="障害馬" className="filterCheckText">
                  障害馬
                </label>
                <input
                  id="馬場馬"
                  name="category"
                  value="馬場馬"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.category.includes("馬場馬")}
                  onChange={props.handleCategory}
                />
                <label htmlFor="馬場馬" className="filterCheckText">
                  馬場馬
                </label>
                <input
                  id="総合馬"
                  name="category"
                  value="総合馬"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.category.includes("総合馬")}
                  onChange={props.handleCategory}
                />
                <label htmlFor="総合馬" className="filterCheckText">
                  総合馬
                </label>
                <input
                  id="レクレーション"
                  name="category"
                  value="レクレーション"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.category.includes("レクレーション")}
                  onChange={props.handleCategory}
                />
                <label htmlFor="レクレーション" className="filterCheckText">
                  レクレーション
                </label>
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
                <option value="サラブレッド">サラブレッド</option>
                <option value="アラブ">アラブ</option>
                <option value="アングロアラブ">アングロアラブ</option>
                <option value="アパルーサ">アパルーサ</option>
                <option value="アハルケテ">アハルケテ</option>
                <option value="アンダルシアン">アンダルシアン</option>
                <option value="アングロノルマン">アングロノルマン</option>
                <option value="ウェストファーレン">ウェストファーレン</option>
                <option value="オルデンブルグ">オルデンブルグ</option>
                <option value="KWPN">KWPN</option>
                <option value="クォーターホース">クォーターホース</option>
                <option value="クリオージョ">クリオージョ</option>
                <option value="クリーブランド・ ベイ">
                  クリーブランド・ ベイ
                </option>
                <option value="ザンガーシェイド">ザンガーシェイド</option>
                <option value="セルフランセ">セルフランセ</option>
                <option value="トラケナー">トラケナー</option>
                <option value="トロッター">トロッター</option>
                <option value="ハクニー">ハクニー</option>
                <option value="ハノーバー">ハノーバー</option>
                <option value="パロミノ">パロミノ</option>
                <option value="ハンター">ハンター</option>
                <option value="フリージアン">フリージアン</option>
                <option value="ペイントホース">ペイントホース</option>
                <option value="ホルスタイン">ホルスタイン</option>
                <option value="モルガン">モルガン</option>
                <option value="リピッツァナー">リピッツァナー</option>
                <option value="ウォームブラッド">ウォームブラッド</option>
                <option value="スポーツホース">スポーツホース</option>
                <option value="日本乗系種">日本乗系種</option>
                <option value="半血種">半血種</option>
                <option value="日本在来種">日本在来種</option>
                <option value="ポニー">ポニー</option>
                <option value="ミニチュアホース">ミニチュアホース</option>
                <option value="重種馬">重種馬</option>
                <option value="その他">その他</option>
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
                <option
                  value="サラブレッド"
                  selected={props.breed.includes("サラブレッド")}
                >
                  サラブレッド
                </option>
                <option
                  value="アラブ"
                  selected={props.breed.includes("アラブ")}
                >
                  アラブ
                </option>
                <option
                  value="アングロアラブ"
                  selected={props.breed.includes("アングロアラブ")}
                >
                  アングロアラブ
                </option>
                <option
                  value="アパルーサ"
                  selected={props.breed.includes("アパルーサ")}
                >
                  アパルーサ
                </option>
                <option
                  value="アハルケテ"
                  selected={props.breed.includes("アハルケテ")}
                >
                  アハルケテ
                </option>
                <option
                  value="アンダルシアン"
                  selected={props.breed.includes("アンダルシアン")}
                >
                  アンダルシアン
                </option>
                <option
                  value="アングロノルマン"
                  selected={props.breed.includes("アングロノルマン")}
                >
                  アングロノルマン
                </option>
                <option
                  value="ウェストファーレン"
                  selected={props.breed.includes("ウェストファーレン")}
                >
                  ウェストファーレン
                </option>
                <option
                  value="オルデンブルグ"
                  selected={props.breed.includes("オルデンブルグ")}
                >
                  オルデンブルグ
                </option>
                <option value="KWPN" selected={props.breed.includes("KWPN")}>
                  KWPN
                </option>
                <option
                  value="クォーターホース"
                  selected={props.breed.includes("クォーターホース")}
                >
                  クォーターホース
                </option>
                <option
                  value="クリオージョ"
                  selected={props.breed.includes("クリオージョ")}
                >
                  クリオージョ
                </option>
                <option
                  value="クリーブランド・ ベイ"
                  selected={props.breed.includes("クリーブランド・ ベイ")}
                >
                  クリーブランド・ ベイ
                </option>
                <option
                  value="ザンガーシェイド"
                  selected={props.breed.includes("ザンガーシェイド")}
                >
                  ザンガーシェイド
                </option>
                <option
                  value="セルフランセ"
                  selected={props.breed.includes("セルフランセ")}
                >
                  セルフランセ
                </option>
                <option
                  value="トラケナー"
                  selected={props.breed.includes("トラケナー")}
                >
                  トラケナー
                </option>
                <option
                  value="トロッター"
                  selected={props.breed.includes("トロッター")}
                >
                  トロッター
                </option>
                <option
                  value="ハクニー"
                  selected={props.breed.includes("ハクニー")}
                >
                  ハクニー
                </option>
                <option
                  value="ハノーバー"
                  selected={props.breed.includes("ハノーバー")}
                >
                  ハノーバー
                </option>
                <option
                  value="パロミノ"
                  selected={props.breed.includes("パロミノ")}
                >
                  パロミノ
                </option>
                <option
                  value="ハンター"
                  selected={props.breed.includes("ハンター")}
                >
                  ハンター
                </option>
                <option
                  value="フリージアン"
                  selected={props.breed.includes("フリージアン")}
                >
                  フリージアン
                </option>
                <option
                  value="ペイントホース"
                  selected={props.breed.includes("ペイントホース")}
                >
                  ペイントホース
                </option>
                <option
                  value="ホルスタイン"
                  selected={props.breed.includes("ホルスタイン")}
                >
                  ホルスタイン
                </option>
                <option
                  value="モルガン"
                  selected={props.breed.includes("モルガン")}
                >
                  モルガン
                </option>
                <option
                  value="リピッツァナー"
                  selected={props.breed.includes("リピッツァナー")}
                >
                  リピッツァナー
                </option>
                <option
                  value="ウォームブラッド"
                  selected={props.breed.includes("ウォームブラッド")}
                >
                  ウォームブラッド
                </option>
                <option
                  value="スポーツホース"
                  selected={props.breed.includes("スポーツホース")}
                >
                  スポーツホース
                </option>
                <option
                  value="日本乗系種"
                  selected={props.breed.includes("日本乗系種")}
                >
                  日本乗系種
                </option>
                <option
                  value="半血種"
                  selected={props.breed.includes("半血種")}
                >
                  半血種
                </option>
                <option
                  value="日本在来種"
                  selected={props.breed.includes("日本在来種")}
                >
                  日本在来種
                </option>
                <option
                  value="ポニー"
                  selected={props.breed.includes("ポニー")}
                >
                  ポニー
                </option>
                <option
                  value="ミニチュアホース"
                  selected={props.breed.includes("ミニチュアホース")}
                >
                  ミニチュアホース
                </option>
                <option
                  value="重種馬"
                  selected={props.breed.includes("重種馬")}
                >
                  重種馬
                </option>
                <option
                  value="その他"
                  selected={props.breed.includes("その他")}
                >
                  その他
                </option>
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
              <option value="鹿毛">鹿毛</option>
              <option value="黒鹿毛">黒鹿毛</option>
              <option value="青毛">青毛</option>
              <option value="青鹿毛">青鹿毛</option>
              <option value="栗毛">栗毛</option>
              <option value="栃栗毛">栃栗毛</option>
              <option value="芦毛">芦毛</option>
              <option value="白毛">白毛</option>
              <option value="その他">その他</option>
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
              <option value="鹿毛" selected={props.color.includes("鹿毛")}>
                鹿毛
              </option>
              <option value="黒鹿毛" selected={props.color.includes("黒鹿毛")}>
                黒鹿毛
              </option>
              <option value="青毛" selected={props.color.includes("青毛")}>
                青毛
              </option>
              <option value="青鹿毛" selected={props.color.includes("青鹿毛")}>
                青鹿毛
              </option>
              <option value="栗毛" selected={props.color.includes("栗毛")}>
                栗毛
              </option>
              <option value="栃栗毛" selected={props.color.includes("栃栗毛")}>
                栃栗毛
              </option>
              <option value="芦毛" selected={props.color.includes("芦毛")}>
                芦毛
              </option>
              <option value="白毛" selected={props.color.includes("白毛")}>
                白毛
              </option>
              <option value="その他" selected={props.color.includes("その他")}>
                その他
              </option>
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
                <input
                  id="おとなしい"
                  name="feature"
                  value="おとなしい"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleFeature}
                />
                <label htmlFor="おとなしい" className="filterCheckText">
                  おとなしい
                </label>
                <input
                  id="120cm以上飛べます"
                  name="feature"
                  value="120cm以上飛べます"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleFeature}
                />
                <label htmlFor="120cm以上飛べます" className="filterCheckText">
                  120cm以上飛べます
                </label>
                <input
                  id="噛み癖なし"
                  name="feature"
                  value="噛み癖なし"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleFeature}
                />
                <label htmlFor="噛み癖なし" className="filterCheckText">
                  噛み癖なし
                </label>
                <input
                  id="蹴り癖なし"
                  name="feature"
                  value="蹴り癖なし"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleFeature}
                />
                <label htmlFor="蹴り癖なし" className="filterCheckText">
                  蹴り癖なし
                </label>
                <input
                  id="初心者OK"
                  name="feature"
                  value="初心者OK"
                  type="checkbox"
                  className="hidden w-full"
                  onChange={props.handleFeature}
                />
                <label htmlFor="初心者OK" className="filterCheckText">
                  初心者OK
                </label>
              </>
            ) : (
              <>
                <input
                  id="おとなしい"
                  name="feature"
                  value="おとなしい"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.feature.includes("おとなしい")}
                  onChange={props.handleFeature}
                />
                <label htmlFor="おとなしい" className="filterCheckText">
                  おとなしい
                </label>
                <input
                  id="120cm以上飛べます"
                  name="feature"
                  value="120cm以上飛べます"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.feature.includes("120cm以上飛べます")}
                  onChange={props.handleFeature}
                />
                <label htmlFor="120cm以上飛べます" className="filterCheckText">
                  120cm以上飛べます
                </label>
                <input
                  id="噛み癖なし"
                  name="feature"
                  value="噛み癖なし"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.feature.includes("噛み癖なし")}
                  onChange={props.handleFeature}
                />
                <label htmlFor="噛み癖なし" className="filterCheckText">
                  噛み癖なし
                </label>
                <input
                  id="蹴り癖なし"
                  name="feature"
                  value="蹴り癖なし"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.feature.includes("蹴り癖なし")}
                  onChange={props.handleFeature}
                />
                <label htmlFor="蹴り癖なし" className="filterCheckText">
                  蹴り癖なし
                </label>
                <input
                  id="初心者OK"
                  name="feature"
                  value="初心者OK"
                  type="checkbox"
                  className="hidden w-full"
                  checked={props.feature.includes("初心者OK")}
                  onChange={props.handleFeature}
                />
                <label htmlFor="初心者OK" className="filterCheckText">
                  初心者OK
                </label>
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
              className="text-center mx-auto whitespace-nowrap border border-gray-400 box-border focus:outline-none text-gray-400 text-base pl-4 pr-6 rounded-md bg-white block w-20 hover:bg-gray-400 hover:shadow-lg hover:text-white duration-200"
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
