import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../src/auth/AuthProvider";
import { Layout } from "../components/Layout";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../src/utils/firebase";
import firebase from "firebase/app";
import { Formik, Field, Form } from "formik";

interface IMAGES {
  images: any;
}

interface IMAGESURL {
  imagesURL: any;
}

interface MyFormValues {
  title: string;
  postText: string;
  category: string;
  breed: string;
  color: string;
  birth: { year: number; month: number; day: number };
  age: number;
  height: number;
  area: string;
  features: Array<string>;
  price: string;
}

const Post: React.FC = () => {
  const { user, currentUser } = useContext(AuthContext);
  const [images, setImages]: any = useState<IMAGES[]>([]);
  const [imagesURL, setImagesURL]: any = useState<IMAGESURL[]>([]);
  const router = useRouter();
  const postId = uuidv4();
  const initialValues: MyFormValues = {
    title: "",
    postText: "",
    category: "",
    breed: "",
    color: "",
    birth: { year: null, month: null, day: null },
    age: null,
    height: null,
    area: "",
    features: [],
    price: "",
  };

  useEffect(() => {
    if (images.length === 0) return;
    const imageURLs = images.map((image) =>
      URL.createObjectURL(image)
    );
    setImagesURL([...imageURLs]);
  }, [images]);

  const handleImages = async (e) => {
    const uploadImages = e.target.files;
    setImages([...images, ...uploadImages]);
    console.log(images);
  };

  return (
    <Layout title="post">
      <Formik
        initialValues={{
          initialValues,
        }}
        onSubmit={(values: any) => {
          console.log("submitsentou");
          console.log(values.image);
          db.collection("users")
            .doc(`${currentUser.uid}`)
            .collection("posts")
            .doc(`${postId}`)
            .set({
              postID: postId,
              userID: currentUser.uid,
              username: user.username,
              avatar: user.avatar,
              images: [],
              title: values.title,
              postText: values.postText,
              category: values.category,
              breed: values.breed,
              color: values.color,
              birth: {
                year: values.year,
                month: values.month,
                day: values.day,
              },
              age: values.age,
              height: values.height,
              features: values.features,
              area: values.area,
              price: values.price,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: "",
              likeUserIDs: [],
              isAvairable: true,
              pv: 0,
            });

          {
            images.map((image) => {
              const uploadTask = storage.ref(`posts/${postId}`).put(image);
              uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                () => {},
                (error) => {
                  console.log(error.message);
                },
                () => {
                  storage
                    .ref(`posts/${postId}`)
                    .getDownloadURL()
                    .then((url) => {
                      db.collection("users")
                        .doc(`${currentUser.uid}`)
                        .collection("posts")
                        .doc(`${postId}`)
                        .update({
                          images: url,
                        });
                    });
                }
              );
            });
          }
          router.push("/");
        }}
      >
        <Form className="max-w-2xl mx-auto mt-16 px-2">
          {imagesURL &&
            imagesURL.map((imageURL, index) => (
              <div key={index}>
                <img src={imageURL} className="h-24 w-32 mb-6  object-cover" />
              </div>
            ))}
          {console.log(imagesURL)}

          <Field
            name="images"
            type="file"
            accept="image/*"
            className="mb-8"
            multiple
            onChange={(e) => {
              handleImages(e);
            }}
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">タイトル</div>
          <Field
            type="text"
            name="title"
            className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">本文</div>
          <Field
            as="textarea"
            name="postText"
            className="mb-8 w-full h-36 appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">カテゴリー</div>
          <Field
            as="select"
            name="category"
            className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option hidden>選択してください</option>
            <option value="障害馬">障害馬</option>
            <option value="馬場馬">馬場馬</option>
            <option value="総合馬">総合馬</option>
            <option value="レクレーション">レクレーション</option>
          </Field>

          <div className="text-xs text-gray-600 mb-1 ml-1">品種</div>
          <Field
            as="select"
            name="breed"
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
            <option value="クリーブランド・ ベイ">クリーブランド・ ベイ</option>
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
          </Field>

          <div className="text-xs text-gray-600 mb-1 ml-1">毛色</div>
          <Field
            as="select"
            name="color"
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
          </Field>

          <div className="text-xs text-gray-600 mb-1 ml-1">生年月日</div>
          <div className="flex items-center">
            <Field
              type="number"
              name="year"
              placeholder="2010"
              className="mb-8 w-20 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />
            <div className="mr-6 ml-2 mb-8 text-sm">年</div>
            <Field
              type="number"
              name="month"
              placeholder="1"
              className="appearance-none mb-8 w-16 rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />
            <div className="mr-6 ml-2 mb-8 text-sm">月</div>
            <Field
              type="number"
              name="day"
              placeholder="10"
              className="mb-8 w-16 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />
            <div className="mr-6 ml-2 mb-8 text-sm">日</div>
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">年齢</div>
          <Field
            type="number"
            name="age"
            className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">身長（cm）</div>
          <Field
            type="number"
            name="height"
            className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">地域</div>
          <Field
            as="select"
            name="area"
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
          </Field>

          <div className="text-xs text-gray-600 mb-1 ml-1">特徴</div>
          <div className="flex flex-wrap">
            <div className="mb-8 ml-3">
              <label className="text-sm font-medium text-gray-800 cursor-pointer">
                <Field
                  name="features"
                  value="gentle"
                  type="checkbox"
                  className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                おとなしい
              </label>
            </div>
            <div className="mb-8 ml-4">
              <label className="text-sm font-medium text-gray-800 cursor-pointer">
                <Field
                  name="features"
                  value="120cm以上飛べます"
                  type="checkbox"
                  className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                120cm以上飛べます
              </label>
            </div>
            <div className="mb-8 ml-4">
              <label className="text-sm font-medium text-gray-800 cursor-pointer">
                <Field
                  name="features"
                  value="蹴り癖なし"
                  type="checkbox"
                  className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                蹴り癖なし
              </label>
            </div>
            <div className="mb-8 ml-4">
              <label className="text-sm font-medium text-gray-800 cursor-pointer">
                <Field
                  name="features"
                  value="噛み癖なし"
                  type="checkbox"
                  className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                噛み癖なし
              </label>
            </div>
            <div className="mb-8 ml-4">
              <label className="text-sm font-medium text-gray-800 cursor-pointer">
                <Field
                  name="features"
                  value="初心者OK"
                  type="checkbox"
                  className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                初心者OK
              </label>
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-3">値段</div>
          <div className="flex">
            <div className="text-gray-500 text-xl mt-1.5">￥</div>
            <Field
              type="number"
              name="price"
              className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="cursor-pointer bg-mainGreen text-white py-3 px-6 rounded-md w-full mt-4 mb-20"
            >
              投稿する
            </button>
          </div>
        </Form>
      </Formik>
    </Layout>
  );
};

export default Post;
