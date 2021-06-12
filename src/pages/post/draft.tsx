import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { useRouter } from "next/router";
import { db, storage } from "../../firebase/firebase";
import { RiCloseCircleFill, RiImageAddFill } from "react-icons/ri";
import fetch from "node-fetch";
import {
  filterInitialValues,
  postInitialValues,
} from "../../utils/initialValues";
import { setPostStates } from "../../utils/states";
import RequiredMark from "../../components/atoms/RequiredMark";
import { generateFileName } from "../../functions/generateFileName";
import { NextPage } from "next";
import { Post } from "../../types/types";
import posting from "../../functions/post/posting";

const draft: NextPage = () => {
  const { user, currentUser } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [imagesURL, setImagesURL] = useState([]);
  const [previewsURL, setPreviewsURL] = useState([]);
  const [post, setPost] = useState<Post>(postInitialValues);
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [horseName, setHorseName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [age, setAge] = useState(null);
  const [height, setHeight] = useState(null);
  const [features, setFeatures] = useState(["empty"]);
  const [area, setArea] = useState("");
  const [price, setPrice] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser && router.query.pid) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("drafts")
        .doc(`${router.query.pid}`)
        .get()
        .then(async (snapshot) => {
          if (!snapshot.data()) return;
          await setPost(setPostStates(snapshot.data()));
          await setPreviewsURL(snapshot.data().images);
        });
    }
  }, [currentUser]);

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

  //image保存
  useEffect(() => {
    if (isDraft) {
      if (imagesURL.length === 0) return;
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("drafts")
        .doc(`${post.postID}`)
        .update({
          images: imagesURL,
        });
    } else {
      if (imagesURL.length === 0) return;
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .doc(`${post.postID}`)
        .update({
          images: imagesURL,
        });
    }
  }, [imagesURL]);

  const uploadImages = async (images) => {
    const urls: any = await Promise.all(
      images.map(async (image) => {
        const fileName = generateFileName(image);
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
    if ([...images, ...uploadImages].length <= 10) {
      setImages([...images, ...uploadImages]);
    } else {
      alert("画像は10枚までです。");
    }
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

  const deletePreview = (index) => {
    images.splice(index, 1);
    setImages(images);
    const imageURLs = images.map((image) => URL.createObjectURL(image));
    setPreviewsURL([...imageURLs]);
  };

  const deleteDraft = async (e) => {
    e.preventDefault();
    const result = window.confirm("本当に削除しますか？");
    if (result) {
      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("drafts")
        .doc(post.postID)
        .delete();

      await router.push("/post/draftList");
    }
  };

  return (
    <>
      <Layout title="draft">
        <form
          className="max-w-2xl mx-auto mt-16 px-2"
          onSubmit={(e) => {
            posting(
              e,
              isDraft,
              currentUser,
              user,
              post.postID,
              title,
              postText,
              horseName,
              category,
              breed,
              color,
              year,
              month,
              day,
              age,
              height,
              features,
              area,
              price,
              uploadImages,
              images
            );
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600 mb-3 ml-1">
              画像(10枚まで)
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
                    className="h-12 w-20 mb-4  object-cover sm:h-20 sm:w-32"
                  />
                  <div onClick={() => deletePreview(index)}>
                    <RiCloseCircleFill className="text-gray-500 text-2xl opacity-80 ml-auto -mt-3 cursor-pointer mb-4" />
                  </div>
                </div>
              ))}
          </div>

          <div className="formItemContainer">
            <label
              htmlFor="file"
              className="block w-40 mr-3 mb-8 focus:outline-none text-white text-base font-medium py-2.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-center text-center">
                <RiImageAddFill className="text-lg ml-1 sm:text-base" />
                <p className="ml-2.5 fontSize-base">画像を選択</p>
              </div>
            </label>
            <input
              id="file"
              name="images"
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              defaultValue={post?.images}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleImages(e);
              }}
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              タイトル
              <RequiredMark />
            </div>
            <input
              type="text"
              name="title"
              defaultValue={post?.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              className="inputText rounded-md"
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              本文
              <RequiredMark />
            </div>
            <textarea
              name="postText"
              defaultValue={post?.postText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPostText(e.target.value)
              }
              className="h-36 rounded-md inputText whitespace-pre"
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              馬の名前
              <RequiredMark />
            </div>
            <input
              type="text"
              name="horseName"
              defaultValue={post?.horseName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHorseName(e.target.value)
              }
              className="inputText rounded-md"
            />
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">
            カテゴリー
            <RequiredMark />
          </div>
          {post && (
            <select
              name="category"
              defaultValue={post?.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCategory(e.target.value)
              }
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm"
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setBreed(e.target.value)
              }
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm"
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setColor(e.target.value)
              }
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm"
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setYear(e.target.value)
              }
              className="mb-8 w-20 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 text-sm"
            />
            <div className="mr-6 ml-2 mb-8 text-sm">年</div>
            <input
              type="number"
              name="month"
              placeholder="1"
              defaultValue={post?.birth.month}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMonth(e.target.value)
              }
              className="appearance-none mb-8 w-16 rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 text-sm"
            />
            <div className="mr-6 ml-2 mb-8 text-sm">月</div>
            <input
              type="number"
              name="day"
              placeholder="10"
              defaultValue={post?.birth.day}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDay(e.target.value)
              }
              className="mb-8 w-16 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 text-sm"
            />
            <div className="mr-6 ml-2 mb-8 text-sm">日</div>
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">年齢</div>
          <input
            type="number"
            name="age"
            defaultValue={post?.age}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAge(e.target.value)
            }
            className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 text-sm"
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">
            身長（cm）
            <RequiredMark />
          </div>
          <input
            type="number"
            name="height"
            defaultValue={post?.height}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHeight(e.target.value)
            }
            className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 text-sm"
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">
            地域
            <RequiredMark />
          </div>
          {post && (
            <select
              name="area"
              defaultValue={post?.area}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setArea(e.target.value)
              }
              className="mb-8 w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm"
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(e.target.value)
              }
              className="mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 text-sm"
            />
          </div>

          <div className="text-center mb-20">
            <button
              type="submit"
              className="cursor-pointer bg-mainGreen text-white py-3 px-6 rounded-md w-full mt-4"
            >
              掲載する
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-white text-gray-500 border border-gray-500 py-3 px-6 rounded-md w-full mt-4 hover:text-white hover:bg-gray-500  ease-in-out duration-300"
              onClick={() => {
                setIsDraft(true);
              }}
            >
              下書き保存する
            </button>
            <button
              className="cursor-pointer bg-white text-gray-500 border border-gray-500 py-3 px-6 rounded-md w-full mt-4 hover:text-white hover:bg-gray-500  ease-in-out duration-300"
              onClick={(e) => {
                deleteDraft(e);
              }}
            >
              削除する
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default draft;
