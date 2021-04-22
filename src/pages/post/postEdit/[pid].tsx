import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { useRouter } from "next/router";
import { db, storage } from "../../../utils/firebase";
import firebase from "firebase/app";
import { RiCloseCircleFill } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import fetch from "node-fetch";

interface IMAGES {
  images: any;
}

interface IMAGESURL {
  imagesURL: any;
}
interface PREVIEWSURL {
  previewsURL: any;
}

const postEdit = () => {
  const { currentUser } = useContext(AuthContext);
  const [images, setImages]: any = useState<IMAGES[]>([]);
  const [imagesURL, setImagesURL]: any = useState<IMAGESURL[]>([]);
  const [previewsURL, setPreviewsURL]: any = useState<PREVIEWSURL[]>([]);
  const [post, setPost]: any = useState(null);
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [horseName, setHorseName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [features, setFeatures] = useState([]);
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setData();
    }
  }, [currentUser]);

  const setData = async () => {
    if (currentUser) {
      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .doc(`${router.query.pid}`)
        .onSnapshot(async (snapshot) => {
          await setPost({
            postID: snapshot.data().postID,
            userID: snapshot.data().userID,
            username: snapshot.data().username,
            avatar: snapshot.data().avatar,
            images: snapshot.data().images,
            title: snapshot.data().title,
            postText: snapshot.data().postText,
            horseName: snapshot.data().horseName,
            category: snapshot.data().category,
            breed: snapshot.data().breed,
            color: snapshot.data().color,
            birth: {
              year: snapshot.data().birth.year,
              month: snapshot.data().birth.month,
              day: snapshot.data().birth.day,
            },
            age: snapshot.data().age,
            height: snapshot.data().height,
            area: snapshot.data().area,
            features: snapshot.data().features,
            price: snapshot.data().price,
            createdAt: snapshot.data().createdAt,
            updatedAt: snapshot.data().updatedAt,
            likeUserIDs: snapshot.data().likeUserIDs,
            isAvairable: snapshot.data().isAvairable,
          });
          await setPreviewsURL(snapshot.data().images);
        });
    }
  };

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setPostText(post.postText);
      setHorseName(post.horseName);
      setCategory(post.category);
      setBreed(post.breed);
      setColor(post.color);
      setYear(post.birth.year);
      setMonth(post.birth.month);
      setDay(post.birth.day);
      setAge(post.age);
      setHeight(post.height);
      setFeatures(post.features);
      setArea(post.area);
      setPrice(post.price);
      urlToFile(post);
    }
  }, [post]);

  // URL to File
  const urlToFile = async (post) => {
    if (post) {
      const imageFiles = await Promise.all(
        post.images.map((image) => {
          return fetch(image).then((res) => res.blob());
        })
      );
      setImages([...imageFiles]);
    }
  };

  //プレビューのURLセット
  useEffect(() => {
    if (images.length === 0) return;
    const imageURLs = images.map((image) => URL.createObjectURL(image));
    setPreviewsURL([...imageURLs]);
  }, [images]);

  // imageアップデート
  useEffect(() => {
    if (imagesURL.length === 0) return;
    db.collection("users")
      .doc(`${currentUser.uid}`)
      .collection("posts")
      .doc(`${post.postID}`)
      .update({
        images: imagesURL,
      });
  }, [imagesURL]);

  const uploadImages = async () => {
    console.log(images);
    const urls = await Promise.all(
      images.map(async (image) => {
        const S =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N = 16;
        const randomChar = Array.from(
          crypto.getRandomValues(new Uint32Array(N))
        )
          .map((n) => S[n % S.length])
          .join("");
        const fileName = randomChar + "_" + image.size;
        await storage.ref(`posts/${post.postID}/${fileName}`).put(image);

        return await storage
          .ref(`posts/${post.postID}/${fileName}`)
          .getDownloadURL();
      })
    );
    await setImagesURL([...urls]);
  };

  const handleImages = (e) => {
    const uploadImages = e.target.files;
    setImages([...images, ...uploadImages]);
  };

  const deletePreview = (index) => {
    images.splice(index, 1);
    setImages(images);
    const imageURLs = images.map((image) => URL.createObjectURL(image));
    setPreviewsURL([...imageURLs]);
  };

  const updateData = async () => {
    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("posts")
      .doc(`${post.postID}`)
      .update({
        title: title,
        postText: postText,
        horseName: horseName,
        category: category,
        breed: breed,
        color: color,
        birth: {
          year: year,
          month: month,
          day: day,
        },
        age: age,
        height: height,
        features: features,
        area: area,
        price: price,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  const updatePost = async (e) => {
    e.preventDefault();

    const processAll = async () => {
      await updateData();
      await uploadImages();
    };

    await processAll();

    await router.push({
      pathname: `/post/postShow/${post.postID}`,
    });
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handlePostText = (e) => {
    setPostText(e.target.value);
  };
  const handleHorseName = (e) => {
    setHorseName(e.target.value);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleBreed = (e) => {
    setBreed(e.target.value);
  };
  const handleColor = (e) => {
    setColor(e.target.value);
  };
  const handleYear = (e) => {
    setYear(e.target.value);
  };
  const handleMonth = (e) => {
    setMonth(e.target.value);
  };
  const handleDay = (e) => {
    setDay(e.target.value);
  };
  const handleAge = (e) => {
    setAge(e.target.value);
  };
  const handleHeight = (e) => {
    setHeight(e.target.value);
  };
  const handleFeatures = (e) => {
    if (e.target.checked === true) {
      setFeatures([e.target.value, ...features]);
    } else {
      const filterArray = features.filter(
        (feature) => feature !== e.target.value
      );
      setFeatures([...filterArray]);
    }
  };
  const handleArea = (e) => {
    setArea(e.target.value);
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  return (
    <div>
      <Layout title="postEdit">
        <>
          {console.log(images)}
          <form onSubmit={updatePost} className="max-w-2xl mx-auto mt-16 px-2">
            <div className="text-xs text-gray-600 mb-3 ml-1">画像</div>
            <div className="flex flex-wrap mb-2">
              {previewsURL &&
                previewsURL.map((previewURL, index) => (
                  <div key={index} className="mr-6">
                    <img
                      src={previewURL}
                      className="h-24 w-32 mb-4  object-cover"
                    />
                    <div onClick={(e) => deletePreview(index)}>
                      <RiCloseCircleFill className="text-gray-500 text-2xl opacity-80 ml-auto -mt-3 cursor-pointer mb-4" />
                    </div>
                  </div>
                ))}
            </div>
            <label
              htmlFor="file"
              className="block w-40 mr-3 mb-8 focus:outline-none text-white text-base font-medium py-2.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-center text-center">
                <RiImageAddFill className="text-lg ml-1" />
                <p className="ml-2.5">画像を選択</p>
              </div>
            </label>

            <input
              id="file"
              name="images"
              type="file"
              accept="image/*"
              className="mb-8 hidden"
              multiple
              defaultValue={post?.images}
              onChange={(e) => {
                handleImages(e);
              }}
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">タイトル</div>
            <input
              type="text"
              name="title"
              defaultValue={post?.title}
              onChange={handleTitle}
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">本文</div>
            <textarea
              name="postText"
              defaultValue={post?.postText}
              onChange={handlePostText}
              className="mb-8 w-full h-36 appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm whitespace-pre"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">馬の名前</div>
            <input
              type="text"
              name="horseName"
              defaultValue={post?.horseName}
              onChange={handleHorseName}
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">カテゴリー</div>
            {post && (
              <select
                name="category"
                defaultValue={post?.category}
                onChange={handleCategory}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option hidden>選択してください</option>
                <option value="障害馬">障害馬</option>
                <option value="馬場馬">馬場馬</option>
                <option value="総合馬">総合馬</option>
                <option value="レクレーション">レクレーション</option>
              </select>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">品種</div>
            {post && (
              <select
                name="breed"
                defaultValue={post?.breed}
                onChange={handleBreed}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option hidden>選択してください</option>
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
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">毛色</div>
            {post && (
              <select
                name="color"
                defaultValue={post?.color}
                onChange={handleColor}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option hidden>選択してください</option>
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
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">生年月日</div>
            <div className="flex items-center">
              <input
                type="number"
                name="year"
                placeholder="2010"
                defaultValue={post?.birth.year}
                onChange={handleYear}
                className="mb-8 w-20 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
              <div className="mr-6 ml-2 mb-8 text-sm">年</div>
              <input
                type="number"
                name="month"
                placeholder="1"
                defaultValue={post?.birth.month}
                onChange={handleMonth}
                className="appearance-none mb-8 w-16 rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
              <div className="mr-6 ml-2 mb-8 text-sm">月</div>
              <input
                type="number"
                name="day"
                placeholder="10"
                defaultValue={post?.birth.day}
                onChange={handleDay}
                className="mb-8 w-16 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
              <div className="mr-6 ml-2 mb-8 text-sm">日</div>
            </div>

            <div className="text-xs text-gray-600 mb-1 ml-1">年齢</div>
            <input
              type="number"
              name="age"
              defaultValue={post?.age}
              onChange={handleAge}
              className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">身長（cm）</div>
            <input
              type="number"
              name="height"
              defaultValue={post?.height}
              onChange={handleHeight}
              className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">地域</div>
            {post && (
              <select
                name="area"
                defaultValue={post?.area}
                onChange={handleArea}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <optgroup label="北海道・東北">
                  <option hidden>選択してください</option>
                  <option value="北海道">北海道</option>
                  <option value="青森県">青森県</option>
                  <option value="秋田県">秋田県</option>
                  <option value="岩手県">岩手県</option>
                  <option value="山形県">山形県</option>
                  <option value="宮城県">宮城県</option>
                  <option value="福島県">福島県</option>
                </optgroup>
                <optgroup label="甲信越・北陸">
                  <option value="山梨県">山梨県</option>
                  <option value="長野県">長野県</option>
                  <option value="新潟県">新潟県</option>
                  <option value="富山県">富山県</option>
                  <option value="石川県">石川県</option>
                  <option value="福井県">福井県</option>
                </optgroup>
                <optgroup label="関東">
                  <option value="茨城県">茨城県</option>
                  <option value="栃木県">栃木県</option>
                  <option value="群馬県">群馬県</option>
                  <option value="埼玉県">埼玉県</option>
                  <option value="千葉県">千葉県</option>
                  <option value="東京都">東京都</option>
                  <option value="神奈川県">神奈川県</option>
                </optgroup>
                <optgroup label="東海">
                  <option value="愛知県">愛知県</option>
                  <option value="静岡県">静岡県</option>
                  <option value="岐阜県">岐阜県</option>
                  <option value="三重県">三重県</option>
                </optgroup>
                <optgroup label="関西">
                  <option value="大阪府">大阪府</option>
                  <option value="兵庫県">兵庫県</option>
                  <option value="京都府">京都府</option>
                  <option value="滋賀県">滋賀県</option>
                  <option value="奈良県">奈良県</option>
                  <option value="和歌山県">和歌山県</option>
                </optgroup>
                <optgroup label="中国">
                  <option value="岡山県">岡山県</option>
                  <option value="広島県">広島県</option>
                  <option value="鳥取県">鳥取県</option>
                  <option value="島根県">島根県</option>
                  <option value="山口県">山口県</option>
                </optgroup>
                <optgroup label="四国">
                  <option value="徳島県">徳島県</option>
                  <option value="香川県">香川県</option>
                  <option value="愛媛県">愛媛県</option>
                  <option value="高知県">高知県</option>
                </optgroup>
                <optgroup label="九州・沖縄">
                  <option value="福岡県">福岡県</option>
                  <option value="佐賀県">佐賀県</option>
                  <option value="長崎県">長崎県</option>
                  <option value="熊本県">熊本県</option>
                  <option value="大分県">大分県</option>
                  <option value="宮崎県">宮崎県</option>
                  <option value="鹿児島県">鹿児島県</option>
                  <option value="沖縄県">沖縄県</option>
                </optgroup>
              </select>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">特徴</div>
            {post && (
              <div className="flex flex-wrap">
                <div className="mb-8 ml-3">
                  <label className="text-sm font-medium text-gray-800 cursor-pointer">
                    <input
                      name="features"
                      value="おとなしい"
                      type="checkbox"
                      defaultChecked={
                        post?.features.includes("おとなしい") ? true : false
                      }
                      onClick={handleFeatures}
                      className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                    おとなしい
                  </label>
                </div>
                <div className="mb-8 ml-4">
                  <label className="text-sm font-medium text-gray-800 cursor-pointer">
                    <input
                      name="features"
                      value="120cm以上飛べます"
                      type="checkbox"
                      defaultChecked={
                        post?.features.includes("120cm以上飛べます")
                          ? true
                          : false
                      }
                      onClick={handleFeatures}
                      className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                    120cm以上飛べます
                  </label>
                </div>
                <div className="mb-8 ml-4">
                  <label className="text-sm font-medium text-gray-800 cursor-pointer">
                    <input
                      name="features"
                      value="蹴り癖なし"
                      type="checkbox"
                      defaultChecked={
                        post?.features.includes("蹴り癖なし") ? true : false
                      }
                      onClick={handleFeatures}
                      className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                    蹴り癖なし
                  </label>
                </div>
                <div className="mb-8 ml-4">
                  <label className="text-sm font-medium text-gray-800 cursor-pointer">
                    <input
                      name="features"
                      value="噛み癖なし"
                      type="checkbox"
                      defaultChecked={
                        post?.features.includes("噛み癖なし") ? true : false
                      }
                      onClick={handleFeatures}
                      className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                    噛み癖なし
                  </label>
                </div>
                <div className="mb-8 ml-4">
                  <label className="text-sm font-medium text-gray-800 cursor-pointer">
                    <input
                      name="features"
                      value="初心者OK"
                      type="checkbox"
                      defaultChecked={
                        post?.features.includes("初心者OK") ? true : false
                      }
                      onClick={handleFeatures}
                      className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                    初心者OK
                  </label>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-3">値段</div>
            <div className="flex">
              <div className="text-gray-500 text-xl mt-1.5">￥</div>
              <input
                type="number"
                name="price"
                defaultValue={post?.price}
                onChange={handlePrice}
                className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="cursor-pointer bg-mainGreen text-white py-3 px-6 rounded-md w-full mt-4 mb-20"
              >
                更新する
              </button>
            </div>
          </form>
        </>
      </Layout>
    </div>
  );
};

export default postEdit;
