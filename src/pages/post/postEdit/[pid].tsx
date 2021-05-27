import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { useRouter } from "next/router";
import { db, storage } from "../../../utils/firebase";
import firebase from "firebase/app";
import { RiCloseCircleFill } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import fetch from "node-fetch";
import { filterInitialValues } from "../../../utils/initialValues";
import { setPostStates } from "../../../utils/states";
import { RequiredMark } from "../../../components/atoms/Atoms";

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
          if (!snapshot) return;
          await setPost(setPostStates(snapshot?.data()));
          await setPreviewsURL(snapshot?.data()?.images);
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

  const deletePost = async (e) => {
    e.preventDefault();
    if (post.clientUserID) {
      alert("取引の途中で記事は削除できません。");
      return;
    }
    const result = window.confirm("本当に削除しますか？");
    if (result) {
      await Promise.all(
        post.likeUserIDs.map(async (likeUserID) => {
          await db
            .collection("users")
            .doc(`${likeUserID}`)
            .update({
              likePostIDs: firebase.firestore.FieldValue.arrayRemove(
                `${post.postID}`
              ),
            });

          await db
            .collection("users")
            .doc(`${likeUserID}`)
            .collection("notifications")
            .add({
              postID: post.postID,
              postUserID: post.userID,
              sendUserID: post.userID,
              receiveUserID: likeUserID,
              sendMessageUserID: "",
              image: post.images[0],
              avatar: "",
              text: `お気に入りにした「${post.title}」が削除されました。`,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              checked: false,
              toMessage: false,
              toProfile: false,
              noLink: true,
            });

          await db
            .collection("users")
            .doc(`${likeUserID}`)
            .collection("likePosts")
            .where("postID", "==", post.postID)
            .get()
            .then(
              async (snapshot) =>
                await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()))
            );
        })
      );

      await db
        .collectionGroup("messages")
        .where("postID", "==", post.postID)
        .get()
        .then(
          async (snapshot) =>
            await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()))
        );

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .doc(post.postID)
        .collection("chatrooms")
        .get()
        .then(
          async (snapshot) =>
            await Promise.all(
              snapshot.docs.map((doc) => {
                db.collection("users")
                  .doc(`${currentUser.uid}`)
                  .collection("posts")
                  .doc(post.postID)
                  .collection("chatrooms")
                  .doc(`${doc.id}`)
                  .collection("messages")
                  .get()
                  .then(
                    async (snapshot) =>
                      await Promise.all(
                        snapshot.docs.map((document) =>
                          db
                            .collection("users")
                            .doc(`${currentUser.uid}`)
                            .collection("posts")
                            .doc(post.postID)
                            .collection("chatrooms")
                            .doc(`${doc.id}`)
                            .collection("messages")
                            .doc(`${document.id}`)
                            .delete()
                        )
                      )
                  );
                doc.ref.delete();
              })
            )
        );

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .doc(post.postID)
        .delete();

      await router.push("/");
    }
  };

  return (
    <div>
      <Layout title="postEdit">
        <>
          {console.log(images)}
          <form onSubmit={updatePost} className="max-w-2xl mx-auto mt-16 px-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600 mb-3 ml-1">
                画像
                <RequiredMark />
              </div>
              <div className="text-xs text-gray-600 mb-3 mr-1">
                <RequiredMark />
                は必須項目です
              </div>
            </div>
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

            <div className="text-xs text-gray-600 mb-1 ml-1">
              タイトル
              <RequiredMark />
            </div>
            <input
              type="text"
              name="title"
              defaultValue={post?.title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">
              本文
              <RequiredMark />
            </div>
            <textarea
              name="postText"
              defaultValue={post?.postText}
              onChange={(e) => setPostText(e.target.value)}
              className="mb-8 w-full h-36 appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm whitespace-pre"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">
              馬の名前
              <RequiredMark />
            </div>
            <input
              type="text"
              name="horseName"
              defaultValue={post?.horseName}
              onChange={(e) => setHorseName(e.target.value)}
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">
              カテゴリー
              <RequiredMark />
            </div>
            {post && (
              <select
                name="category"
                defaultValue={post?.category}
                onChange={(e) => setCategory(e.target.value)}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.category.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">
              品種
              <RequiredMark />
            </div>
            {post && (
              <select
                name="breed"
                defaultValue={post?.breed}
                onChange={(e) => setBreed(e.target.value)}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.breed.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">
              毛色
              <RequiredMark />
            </div>
            {post && (
              <select
                name="color"
                defaultValue={post?.color}
                onChange={(e) => setColor(e.target.value)}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.color.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">
              生年月日
              <RequiredMark />
            </div>
            <div className="flex items-center">
              <input
                type="number"
                name="year"
                placeholder="2010"
                defaultValue={post?.birth.year}
                onChange={(e) => setYear(e.target.value)}
                className="mb-8 w-20 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
              <div className="mr-6 ml-2 mb-8 text-sm">年</div>
              <input
                type="number"
                name="month"
                placeholder="1"
                defaultValue={post?.birth.month}
                onChange={(e) => setMonth(e.target.value)}
                className="appearance-none mb-8 w-16 rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
              <div className="mr-6 ml-2 mb-8 text-sm">月</div>
              <input
                type="number"
                name="day"
                placeholder="10"
                defaultValue={post?.birth.day}
                onChange={(e) => setDay(e.target.value)}
                className="mb-8 w-16 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
              <div className="mr-6 ml-2 mb-8 text-sm">日</div>
            </div>

            <div className="text-xs text-gray-600 mb-1 ml-1">年齢</div>
            <input
              type="number"
              name="age"
              defaultValue={post?.age}
              onChange={(e) => setAge(e.target.value)}
              className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">
              身長（cm）
              <RequiredMark />
            </div>
            <input
              type="number"
              name="height"
              defaultValue={post?.height}
              onChange={(e) => setHeight(e.target.value)}
              className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            />

            <div className="text-xs text-gray-600 mb-1 ml-1">
              地域
              <RequiredMark />
            </div>
            {post && (
              <select
                name="area"
                defaultValue={post?.area}
                onChange={(e) => setArea(e.target.value)}
                className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.area.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-1">特徴</div>
            {post && (
              <div className="flex flex-wrap">
                {filterInitialValues.features.map((element) => (
                  <>
                    <div className="mb-8 ml-4" hidden={element === "empty"}>
                      <label className="text-sm font-medium text-gray-800 cursor-pointer">
                        <input
                          name="features"
                          value={`${element}`}
                          type="checkbox"
                          defaultChecked={
                            post?.features.includes(`${element}`) ? true : false
                          }
                          onClick={handleFeatures}
                          className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                        />
                        {`${element}`}
                      </label>
                    </div>
                  </>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-600 mb-1 ml-3">
              値段
              <RequiredMark />
            </div>
            <div className="flex">
              <div className="text-gray-500 text-xl mt-1.5">￥</div>
              <input
                type="number"
                name="price"
                defaultValue={post?.price}
                onChange={(e) => setPrice(e.target.value)}
                className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              />
            </div>

            <div className="text-center mb-20">
              <button
                type="submit"
                className="cursor-pointer bg-mainGreen text-white py-3 px-6 rounded-md w-full mt-6  hover:opacity-90 hover:shadow-lg"
              >
                更新する
              </button>
              <button
                onClick={deletePost}
                className="cursor-pointer bg-white text-gray-500 border border-gray-500 py-3 px-6 rounded-md w-full mt-4 hover:text-white hover:bg-gray-500  ease-in-out duration-300"
              >
                削除する
              </button>
            </div>
          </form>
        </>
      </Layout>
    </div>
  );
};

export default postEdit;
