import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../utils/firebase";
import firebase from "firebase/app";
import { Formik, Field, Form } from "formik";
import { RiCloseCircleFill } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import { filterInitialValues } from "../../utils/initialValues";
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface IMAGES {
  images: any;
}

interface IMAGESURL {
  imagesURL: any;
}
interface PREVIEWSURL {
  previewsURL: any;
}

interface MyFormValues {
  title: string;
  postText: string;
  horseName: string;
  category: string;
  breed: string;
  color: string;
  birth: { year: number; month: number; day: number };
  age: number;
  height: number;
  area: string;
  features: Array<string>;
  price: number;
}

const Post: React.FC = () => {
  const { user, currentUser } = useContext(AuthContext);
  const [images, setImages]: any = useState<IMAGES[]>([]);
  const [imagesURL, setImagesURL]: any = useState<IMAGESURL[]>([]);
  const [previewsURL, setPreviewsURL]: any = useState<PREVIEWSURL[]>([]);
  const [postId, setPostId] = useState("");
  const router = useRouter();

  const initialValues: MyFormValues = {
    title: "",
    postText: "",
    horseName: "",
    category: "",
    breed: "",
    color: "",
    birth: { year: null, month: null, day: null },
    age: null,
    height: null,
    area: "",
    features: [],
    price: null,
  };

  //posiID設定
  useEffect(() => {
    setPostId(uuidv4());
  }, []);

  //プレビューのURLセット
  useEffect(() => {
    if (images.length === 0) return;
    const imageURLs = images.map((image) => URL.createObjectURL(image));
    setPreviewsURL([...imageURLs]);
  }, [images]);

  //image保存
  useEffect(() => {
    if (imagesURL.length === 0) return;
    db.collection("users")
      .doc(`${currentUser.uid}`)
      .collection("posts")
      .doc(`${postId}`)
      .update({
        images: imagesURL,
      });
  }, [imagesURL]);

  const uploadImages = async (images) => {
    console.log(images);
    const urls: any = await Promise.all(
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
        await storage.ref(`posts/${postId}/${fileName}`).put(image);

        return await storage
          .ref(`posts/${postId}/${fileName}`)
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

  return (
    <Layout title="post">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: any) => {
          const setPost = async () => {
            await db
              .collection("users")
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
                horseName: values.horseName,
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
                sendMessageUser:[]
              });
          };

          const processAll = async () => {
            await setPost();
            await uploadImages(images);
          };

          await processAll();

          await router.push("/");
        }}
      >
        <Form className="max-w-2xl mx-auto mt-16 px-2">
          <div className="text-xs text-gray-600 mb-3 ml-1">画像</div>
          <div className="flex flex-wrap mb-2">
            {/* <DragDropContext onDragEnd={onDragEnd}>
            <Droppable> */}
            {previewsURL &&
              previewsURL.map((previewURL, index) => (
                // <Draggable>
                <div key={index} className="mr-6">
                  <img
                    src={previewURL}
                    className="h-24 w-32 mb-4  object-cover"
                  />
                  <div onClick={(e) => deletePreview(index)}>
                    <RiCloseCircleFill className="text-gray-500 text-2xl opacity-80 ml-auto -mt-3 cursor-pointer mb-4" />
                  </div>
                </div>
                // </Draggable>
              ))}
            {/* </Droppable>
          </DragDropContext> */}
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
          <Field
            id="file"
            name="images"
            type="file"
            accept="image/*"
            className="mb-8 hidden"
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

          <div className="text-xs text-gray-600 mb-1 ml-1">馬の名前</div>
          <Field
            type="text"
            name="horseName"
            className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">カテゴリー</div>
          <Field
            as="select"
            name="category"
            className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option hidden>選択してください</option>
            {filterInitialValues.category.map((element) => (
              <option value={`${element}`}>{`${element}`}</option>
            ))}
          </Field>

          <div className="text-xs text-gray-600 mb-1 ml-1">品種</div>
          <Field
            as="select"
            name="breed"
            className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option hidden>選択してください</option>
            {filterInitialValues.breed.map((element) => (
              <option value={`${element}`}>{`${element}`}</option>
            ))}
          </Field>

          <div className="text-xs text-gray-600 mb-1 ml-1">毛色</div>
          <Field
            as="select"
            name="color"
            className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option hidden>選択してください</option>
            {filterInitialValues.color.map((element) => (
              <option value={`${element}`}>{`${element}`}</option>
            ))}
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
            <option hidden>選択してください</option>
            {filterInitialValues.area.map((element) => (
              <option value={`${element}`}>{`${element}`}</option>
            ))}
          </Field>

          <div className="text-xs text-gray-600 mb-1 ml-1">特徴</div>
          <div className="flex flex-wrap">
            {filterInitialValues.features.map((element) => (
              <>
                <div className="mb-8 ml-4">
                  <label className="text-sm font-medium text-gray-800 cursor-pointer">
                    <Field
                      name="features"
                      value={`${element}`}
                      type="checkbox"
                      className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                    {`${element}`}
                  </label>
                </div>
              </>
            ))}
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
