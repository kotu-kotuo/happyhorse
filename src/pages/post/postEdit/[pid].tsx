import { useState, useEffect, useContext, MouseEvent } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { Layout } from "../../../components/organisms/Layout";
import { useRouter } from "next/router";
import { db, storage } from "../../../firebase/firebase";
import firebase from "firebase/app";
import fetch from "node-fetch";
import { postInitialValues } from "../../../utils/initialValues";
import { setPostStates } from "../../../utils/states";
import { generateFileName } from "../../../functions/generateFileName";
import { NextPage } from "next";
import { Post } from "../../../types/types";
import deletePost from "../../../functions/post/deletePost";
import PostEditForm from "../../../components/organisms/PostEditForm";
import useRedirectLogin from "../../../hooks/useRedirectLogin";

const postEdit: NextPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [imagesURL, setImagesURL] = useState([]);
  const [previewsURL, setPreviewsURL] = useState([]);
  const [post, setPost] = useState<Post>(postInitialValues);
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [video1URL, setVideo1URL] = useState("");
  const [video1Title, setVideo1Title] = useState("");
  const [video2URL, setVideo2URL] = useState("");
  const [video2Title, setVideo2Title] = useState("");
  const [video3URL, setVideo3URL] = useState("");
  const [video3Title, setVideo3Title] = useState("");
  const [horseName, setHorseName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [age, setAge] = useState(null);
  const [height, setHeight] = useState(null);
  const [features, setFeatures] = useState([]);
  const [area, setArea] = useState("");
  const [price, setPrice] = useState(null);
  const router = useRouter();

  useRedirectLogin(currentUser);

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
      setVideo1URL(post.video1URL);
      setVideo1Title(post.video1Title);
      setVideo2URL(post.video2URL);
      setVideo2Title(post.video2Title);
      setVideo3URL(post.video3URL);
      setVideo3Title(post.video3Title);
      setHorseName(post.horseName);
      setCategory(post.category);
      setBreed(post.breed);
      setGender(post.gender);
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
    const urls = await Promise.all(
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

  const updateData = async () => {
    await db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("posts")
      .doc(`${post.postID}`)
      .update({
        title: title,
        postText: postText,
        video1URL: video1URL,
        video1Title: video1Title,
        video2URL: video2URL,
        video2Title: video2Title,
        video3URL: video3URL,
        video3Title: video3Title,
        horseName: horseName,
        category: category,
        breed: breed,
        gender: gender,
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

  return (
    <div>
      <Layout title="掲載編集フォーム | happy horse" index="noindex">
        {currentUser && (
          <form onSubmit={updatePost} className="max-w-2xl mx-auto mt-16 px-2">
            <PostEditForm
              previewsURL={previewsURL}
              setPreviewsURL={setPreviewsURL}
              post={post}
              images={images}
              setImages={setImages}
              setTitle={setTitle}
              setPostText={setPostText}
              setVideo1URL={setVideo1URL}
              setVideo1Title={setVideo1Title}
              setVideo2URL={setVideo2URL}
              setVideo2Title={setVideo2Title}
              setVideo3URL={setVideo3URL}
              setVideo3Title={setVideo3Title}
              setHorseName={setHorseName}
              setCategory={setCategory}
              setBreed={setBreed}
              setGender={setGender}
              setColor={setColor}
              setYear={setYear}
              setMonth={setMonth}
              setDay={setDay}
              setHeight={setHeight}
              setAge={setAge}
              setArea={setArea}
              setPrice={setPrice}
              features={features}
              setFeatures={setFeatures}
            />

            <div className="text-center mb-20">
              <button
                type="submit"
                className="cursor-pointer bg-mainGreen text-white py-3 px-6 rounded-md w-full mt-6  hover:opacity-90 hover:shadow-lg"
              >
                更新する
              </button>
              <button
                onClick={(
                  e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
                ) => {
                  deletePost(e, post, currentUser, router);
                }}
                className="postFormSubButton"
              >
                削除する
              </button>
            </div>
          </form>
        )}
      </Layout>
    </div>
  );
};

export default postEdit;
