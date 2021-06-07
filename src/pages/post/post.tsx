import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Layout } from "../../components/organisms/Layout";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../utils/firebase";
import firebase from "firebase/app";
import { RiCloseCircleFill } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import { filterInitialValues } from "../../utils/initialValues";
import { generateFileName } from "../../functions/utils";
import { RequiredMark } from "../../components/atoms/Atoms";
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

const Post: React.FC = () => {
  const { user, currentUser } = useContext(AuthContext);
  const [images, setImages]: any = useState<IMAGES[]>([]);
  const [imagesURL, setImagesURL]: any = useState<IMAGESURL[]>([]);
  const [previewsURL, setPreviewsURL]: any = useState<PREVIEWSURL[]>([]);
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
  const router = useRouter();

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

  const posting = async (e) => {
    e.preventDefault();
    if (isDraft) {
      const setPost = async () => {
        await db
          .collection("users")
          .doc(`${currentUser.uid}`)
          .collection("drafts")
          .doc(`${postId}`)
          .set({
            postID: postId,
            userID: currentUser.uid,
            username: user.username,
            avatar: user.avatar,
            images: [],
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
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: "",
            likeUserIDs: [],
            isAvairable: true,
            pv: 0,
            sendMessageUserIDs: [],
            messageUpdatedAt: "",
            latestMessage: "",
            clientUserID: "",
            ratingCompleted: false,
            deletedAccount: false,
          });
      };

      const processAll = async () => {
        await setPost();
        await uploadImages(images);
      };

      await processAll();

      await router.push("/");
    } else {
      if (
        images.length !== 0 &&
        postText &&
        horseName &&
        horseName.length <= 20 &&
        category &&
        breed &&
        color &&
        year &&
        month &&
        day &&
        age &&
        height &&
        area &&
        price
      ) {
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
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: "",
              likeUserIDs: [],
              isAvairable: true,
              pv: 0,
              sendMessageUserIDs: [],
              messageUpdatedAt: "",
              latestMessage: "",
              clientUserID: "",
            });
        };

        const processAll = async () => {
          await setPost();
          await uploadImages(images);
        };

        await processAll();

        await router.push("/");
      } else {
        alertMessage();
      }
    }
  };

  const alertMessage = () => {
    if (images.length === 0) {
      alert("画像を選択してください");
    }
    if (postText.length == 0) {
      alert("本文を記入してください");
    }
    if (horseName.length === 0) {
      ("馬の名前を記入してください");
    }
    if (horseName.length > 20) {
      alert("馬の名前は20字まででお願いします");
    }
    if (category.length === 0) {
      alert("カテゴリーを選択してください");
    }
    if (breed.length === 0) {
      alert("品種を選択してください");
    }
    if (color.length === 0) {
      alert("毛色を選択してください");
    }
    if (year.length === 0) {
      alert("生年月日を記入してください");
    }
    if (month.length === 0) {
      alert("生年月日を記入してください");
    }
    if (day.length === 0) {
      alert("生年月日を記入してください");
    }
    if (age.length === 0) {
      alert("年齢を記入してください");
    }
    if (height.length === 0) {
      alert("身長を記入してください");
    }
    if (price.length === 0) {
      alert("値段を記入してください");
    }
    if (area.length === 0) {
      alert("地域を選択してください");
    }
    return;
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
        <form className="max-w-2xl mx-auto mt-16 px-2" onSubmit={posting}>
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
              <RiImageAddFill className="text-lg ml-1 sm:text-base" />
              <p className="ml-2.5 fontSize-base">画像を選択</p>
            </div>
          </label>
          <input
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

          <div className="text-xs text-gray-600 mb-1 ml-1">
            タイトル
            <RequiredMark />
          </div>
          <div className="mb-8">
            <input
              type="text"
              name="title"
              required
              className="text-sm md:text-base w-full appearance-none relative block px-3 py-2 placeholder-gray-500 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <div className="text-xs text-gray-500 text-right">
              {`${title.length}` + "/40"}
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">
            本文
            <RequiredMark />
          </div>
          <div className="mb-8">
            <textarea
              name="postText"
              className="text-sm md:text-base w-full appearance-none relative block px-3 py-2 placeholder-gray-500 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 h-36"
              onChange={(e) => {
                setPostText(e.target.value);
              }}
            />
            <div className="text-xs text-gray-500 text-right">
              {`${postText.length}` + "/2000"}
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">
            馬の名前
            <RequiredMark />
          </div>
          <input
            type="text"
            name="horseName"
            className="mb-8 text-sm md:text-base w-full appearance-none relative block px-3 py-2 placeholder-gray-500 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
            onChange={(e) => {
              setHorseName(e.target.value);
            }}
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">
            カテゴリー
            <RequiredMark />
          </div>
          <select
            name="category"
            className="postSelect"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option hidden>選択してください</option>
            {filterInitialValues.category.map((element, index) => (
              <option value={`${element}`} key={index}>{`${element}`}</option>
            ))}
          </select>

          <div className="text-xs text-gray-600 mb-1 ml-1">
            品種
            <RequiredMark />
          </div>
          <select
            name="breed"
            className="postSelect"
            onChange={(e) => {
              setBreed(e.target.value);
            }}
          >
            <option hidden>選択してください</option>
            {filterInitialValues.breed.map((element, index) => (
              <option value={`${element}`} key={index}>{`${element}`}</option>
            ))}
          </select>

          <div className="text-xs text-gray-600 mb-1 ml-1">
            毛色
            <RequiredMark />
          </div>
          <select
            name="color"
            className="postSelect"
            onChange={(e) => {
              setColor(e.target.value);
            }}
          >
            <option hidden>選択してください</option>
            {filterInitialValues.color.map((element, index) => (
              <option value={`${element}`} key={index}>{`${element}`}</option>
            ))}
          </select>

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
              className="text-sm md:text-base mb-8 w-20 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10"
              onChange={(e) => {
                setYear(e.target.value);
              }}
            />
            <div className="mr-6 ml-2 mb-8 text-sm">年</div>
            <input
              type="number"
              name="month"
              placeholder="1"
              min="1"
              max="12"
              className="text-sm md:text-base appearance-none mb-8 w-16 rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => {
                setMonth(e.target.value);
              }}
            />
            <div className="mr-6 ml-2 mb-8 text-sm">月</div>
            <input
              type="number"
              name="day"
              placeholder="10"
              min="1"
              max="31"
              className="text-sm md:text-base mb-8 w-16 appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => {
                setDay(e.target.value);
              }}
            />
            <div className="mr-6 ml-2 mb-8 text-sm">日</div>
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">
            年齢
            <RequiredMark />
          </div>
          <input
            type="number"
            name="age"
            min="0"
            max="100"
            className="text-sm md:text-base mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            onChange={(e) => {
              setAge(e.target.value);
            }}
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">
            身長（cm）
            <RequiredMark />
          </div>
          <input
            type="number"
            name="height"
            min="0"
            max="1000"
            className="text-sm md:text-base mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
            onChange={(e) => {
              setHeight(e.target.value);
            }}
          />

          <div className="text-xs text-gray-600 mb-1 ml-1">
            地域
            <RequiredMark />
          </div>
          <select
            name="area"
            className="postSelect"
            onChange={(e) => {
              setArea(e.target.value);
            }}
          >
            <option hidden>選択してください</option>
            {filterInitialValues.area.map((element, index) => (
              <option value={`${element}`} key={index}>{`${element}`}</option>
            ))}
          </select>

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
              className="text-sm md:text-base mb-8 w-full appearance-none rounded-none relative block px-3 py-2 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:border-indigo-500 focus:ring-0 focus:z-10 sm:text-sm"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
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
