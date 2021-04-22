import React from 'react'

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
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            価格
          </div>
          <div className="flex">
            <input
              type="number"
              name="price"
              placeholder="min"
              className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => props.setPriceMin(e.target.valueAsNumber)}
            />

            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            <input
              type="number"
              name="price"
              placeholder="max"
              className="w-1/2 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => props.setPriceMax(e.target.valueAsNumber)}
            />
          </div>
          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            年齢
          </div>
          <div className="flex">
            <input
              type="number"
              name="age"
              placeholder="min"
              className="w-16 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => props.setAgeMin(e.target.valueAsNumber)}
            />

            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            <input
              type="number"
              name="age"
              placeholder="max"
              className="w-16 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => props.setAgeMax(e.target.valueAsNumber)}
            />
          </div>
          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            身長(cm)
          </div>
          <div className="flex">
            <input
              type="number"
              name="height"
              placeholder="min"
              className="w-16 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => props.setHeightMin(e.target.valueAsNumber)}
            />

            <div className="text-gray-700 text-sm mt-1 whitespace-nowrap">
              〜
            </div>
            <input
              type="number"
              name="height"
              placeholder="max"
              className="w-16 appearance-none text-center rounded-none relative block px-1 py-1 border-t-0 border-r-0 border-l-0 border-b border-gray-300 placeholder-gray-400 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => props.setHeightMax(e.target.valueAsNumber)}
            />
          </div>
          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            品種
          </div>
          <div className="mb-3">
            <select
              name="breed"
              className="text-sm text-gray-700 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              onChange={(e) => props.setBreed(e.target.value)}
            >
              <option hidden></option>
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
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            毛色
          </div>
          <select
            name="color"
            className="text-sm text-gray-700 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            onChange={(e) => props.setColor(e.target.value)}
          >
            <option hidden></option>
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

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            地域
          </div>
          <div className="checklist">
            <input
              id="北海道・東北"
              name="area"
              value="北海道・東北"
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
              value="関東"
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
              value="中部"
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
              value="近畿"
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
              value="中国・四国"
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
              value="九州・沖縄"
              type="checkbox"
              className="hidden w-full"
              onChange={props.handleArea}
            />
            <label htmlFor="九州・沖縄" className="filterCheckText">
              九州・沖縄
            </label>
          </div>

          <div className="mb-4 mt-8 ml-2 text-sm font-semibold text-gray-400 opacity-90">
            特徴
          </div>
          <div className="checklist">
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
          </div>

          {/* <div className="mb-3 text-xs font-medium text-mainGreen">
                  さらに表示
                </div> */}
          <button
            type="submit"
            className="mx-auto mt-7 focus:outline-none text-white text-base font-semibold py-2 px-5 rounded-md bg-gray-400 block w-44 hover:opacity-90 hover:shadow-lg"
          >
            検索
          </button>
        </div>
      </form>
    </div>
  );
}

export default Filter
