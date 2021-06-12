import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../firebase/firebase";
import { RiCloseCircleFill, RiImageAddFill } from "react-icons/ri";
import { filterInitialValues } from "../../utils/initialValues";
import { generateFileName } from "../../functions/generateFileName";
import RequiredMark from "../../components/atoms/RequiredMark";
import { NextPage } from "next";
import posting from "../../functions/post/posting";
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Post: NextPage = () => {
  const { user, currentUser } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [imagesURL, setImagesURL] = useState([]);
  const [previewsURL, setPreviewsURL] = useState([]);
  const [postId, setPostId] = useState("");
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
  const [features, setFeatures] = useState(["empty"]);
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [isDraft, setIsDraft] = useState(false);

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
    if (isDraft) {
      if (imagesURL.length === 0) return;
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("drafts")
        .doc(`${postId}`)
        .update({
          images: imagesURL,
        });
    } else {
      if (imagesURL.length === 0) return;
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("posts")
        .doc(`${postId}`)
        .update({
          images: imagesURL,
        });
    }
  }, [imagesURL]);

  const uploadImages = async (images) => {
    const urls: any = await Promise.all(
      images.map(async (image) => {
        const fileName = generateFileName(image);
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
    if ([...images, ...uploadImages].length <= 10) {
      setImages([...images, ...uploadImages]);
    } else {
      alert("画像は10枚までです。");
    }
  };

  const handleFeature = (e) => {
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

  return (
    <>
      <Layout title="post">
        <form
          className="max-w-2xl mx-auto mt-16 px-2"
          onSubmit={(e) => {
            posting(
              e,
              isDraft,
              currentUser,
              user,
              postId,
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
            {/* <DragDropContext onDragEnd={onDragEnd}>
            <Droppable> */}
            {previewsURL &&
              previewsURL.map((previewURL, index) => (
                // <Draggable>
                <div key={index} className="mr-6">
                  <img
                    src={previewURL}
                    className="h-12 w-20 mb-4  object-cover sm:h-20 sm:w-32"
                  />
                  <div onClick={() => deletePreview(index)}>
                    <RiCloseCircleFill className="text-gray-500 text-2xl opacity-80 ml-auto -mt-3 cursor-pointer mb-4" />
                  </div>
                </div>
                // </Draggable>
              ))}
            {/* </Droppable>
          </DragDropContext> */}
          </div>
          <div className="formItemContainer">
            <label
              htmlFor="file"
              className="block w-40 mr-3 mb-8 focus:outline-none text-white py-2.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-center text-center">
                <RiImageAddFill className="text-lg ml-2 sm:text-base" />
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
              required
              className="inputText rounded-md"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
              }}
            />
            <div className="text-xs text-gray-500 text-right">
              {`${title.length}` + "/40"}
            </div>
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              本文
              <RequiredMark />
            </div>
            <textarea
              name="postText"
              className="inputText rounded-md h-36"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPostText(e.target.value);
              }}
            />
            <div className="text-xs text-gray-500 text-right">
              {`${postText.length}` + "/2000"}
            </div>
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              馬の名前
              <RequiredMark />
            </div>
            <input
              type="text"
              name="horseName"
              className="inputText rounded-md"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setHorseName(e.target.value);
              }}
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              カテゴリー
              <RequiredMark />
            </div>
            <select
              name="category"
              className="inputText rounded-md"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setCategory(e.target.value);
              }}
            >
              <option hidden>選択してください</option>
              {filterInitialValues.category.map((element, index) => (
                <option value={`${element}`} key={index}>{`${element}`}</option>
              ))}
            </select>
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              品種
              <RequiredMark />
            </div>
            <select
              name="breed"
              className="inputText rounded-md"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setBreed(e.target.value);
              }}
            >
              <option hidden>選択してください</option>
              {filterInitialValues.breed.map((element, index) => (
                <option value={`${element}`} key={index}>{`${element}`}</option>
              ))}
            </select>
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              毛色
              <RequiredMark />
            </div>
            <select
              name="color"
              className="inputText rounded-md"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setColor(e.target.value);
              }}
            >
              <option hidden>選択してください</option>
              {filterInitialValues.color.map((element, index) => (
                <option value={`${element}`} key={index}>{`${element}`}</option>
              ))}
            </select>
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              生年月日
              <RequiredMark />
            </div>
            <div className="flex items-center">
              <input
                type="number"
                name="year"
                placeholder="2010"
                min="1970"
                className="inputFormNumber w-20"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setYear(e.target.value);
                }}
              />
              <div className="mr-6 ml-2 text-sm">年</div>
              <input
                type="number"
                name="month"
                placeholder="1"
                min="1"
                max="12"
                className="inputFormNumber w-16"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMonth(e.target.value);
                }}
              />
              <div className="mr-6 ml-2 text-sm">月</div>
              <input
                type="number"
                name="day"
                placeholder="10"
                min="1"
                max="31"
                className="inputFormNumber w-16"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDay(e.target.value);
                }}
              />
              <div className="mr-6 ml-2 text-sm">日</div>
            </div>
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              年齢
              <RequiredMark />
            </div>
            <input
              type="number"
              name="age"
              min="0"
              max="100"
              className="inputFormNumber w-full"
              onChange={(e) => {
                setAge(e.target.value);
              }}
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              身長（cm）
              <RequiredMark />
            </div>
            <input
              type="number"
              name="height"
              min="0"
              max="1000"
              className="inputFormNumber w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setHeight(e.target.value);
              }}
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              地域
              <RequiredMark />
            </div>
            <select
              name="area"
              className="inputText rounded-md"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setArea(e.target.value);
              }}
            >
              <option hidden>選択してください</option>
              {filterInitialValues.area.map((element, index) => (
                <option value={`${element}`} key={index}>{`${element}`}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">特徴</div>
          <div className="flex flex-wrap mb-4">
            {filterInitialValues.features.map((element, index) => (
              <div key={index}>
                <div className="mb-4 ml-4" hidden={element === "empty"}>
                  <label className="text-sm font-medium text-gray-800 cursor-pointer">
                    <input
                      name="features"
                      value={`${element}`}
                      type="checkbox"
                      className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                      onChange={handleFeature}
                    />
                    {`${element}`}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-3">
              値段
              <RequiredMark />
            </div>
            <div className="flex">
              <div className="text-gray-500 text-xl mt-1.5">￥</div>
              <input
                type="number"
                name="price"
                min="0"
                className="inputFormNumber w-full"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPrice(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="cursor-pointer bg-mainGreen text-white py-3 px-6 rounded-md w-full mt-4"
            >
              掲載する
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-white text-gray-500 border border-gray-500 py-3 px-6 rounded-md w-full mt-4 mb-20 hover:text-white hover:bg-gray-500  ease-in-out duration-300"
              onClick={() => {
                setIsDraft(true);
              }}
            >
              下書き保存する
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default Post;
