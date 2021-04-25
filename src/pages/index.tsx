import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import Link from "next/link";
import { db } from "../utils/firebase";
import { useRouter } from "next/router";
import Posts from "../components/organisms/Posts";
import Pagination from "../components/molecules/Pagination";
import Filter from "../components/organisms/Filter";

interface POST {
  postID: string;
  userID: string;
  username: string;
  avatar: string;
  images: Array<string>;
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
  price: number;
  createdAt: string;
  updatedAt: string;
  likeUserIDs: Array<string>;
  isAvairable: boolean;
  pv: number;
}

export default function Index() {
  const { currentUser, user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [posts, setPosts] = useState<POST[]>([
    {
      postID: "",
      userID: "",
      username: "",
      avatar: "",
      images: [],
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
      price: null,
      createdAt: "",
      updatedAt: "",
      likeUserIDs: [],
      isAvairable: null,
      pv: null,
    },
  ]);
  const [category, setCategory] = useState([]);
  const [area, setArea] = useState([]);
  const [feature, setFeature] = useState([]);
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [ageMin, setAgeMin] = useState(null);
  const [ageMax, setAgeMax] = useState(null);
  const [heightMin, setHeightMin] = useState(null);
  const [heightMax, setHeightMax] = useState(null);
  const [breed, setBreed] = useState(null);
  const [color, setColor] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    db.collectionGroup("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            postID: doc.data().postID,
            userID: doc.data().userID,
            username: doc.data().username,
            avatar: doc.data().avatar,
            images: doc.data().images,
            title: doc.data().title,
            postText: doc.data().postText,
            category: doc.data().category,
            breed: doc.data().breed,
            color: doc.data().color,
            birth: {
              year: doc.data().year,
              month: doc.data().month,
              day: doc.data().day,
            },
            age: doc.data().age,
            height: doc.data().height,
            area: doc.data().area,
            features: doc.data().features,
            price: doc.data().price,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            likeUserIDs: doc.data().likeUserIDs,
            isAvairable: doc.data().isAvairable,
            pv: doc.data().pv,
          }))
        );
      });
  }, []);

  //詳細画面に遷移
  const clickPost = (e) => {
    const pid = e.currentTarget.getAttribute("data-id");
    router.push({
      pathname: `/post/postShow/${pid}`,
    });
  };

  //いいね機能
  const clickHeart = async (e) => {
    const pid = e.currentTarget.getAttribute("data-id");
    if (user.likePostIDs.includes(`${pid}`)) {
      console.log("unlike");

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .update({
          likePostIDs: [...user.likePostIDs.filter((id) => id !== pid)],
        });

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });

      const posts = await db
        .collectionGroup("posts")
        .where("postID", "==", pid)
        .get();

      await posts.docs.forEach((snapshot) =>
        snapshot.ref.update({
          likeUserIDs: [
            ...snapshot
              .data()
              .likeUserIDs.filter((id) => id !== currentUser.uid),
          ],
        })
      );
    } else {
      console.log(user.likePostIDs);
      console.log("like");

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .update({
          likePostIDs: [pid, ...user.likePostIDs],
        });

      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });

      const posts = await db
        .collectionGroup("posts")
        .where("postID", "==", pid)
        .get();

      posts.docs.forEach((snapshot) =>
        snapshot.ref.update({
          likeUserIDs: [currentUser.uid, ...snapshot.data().likeUserIDs],
        })
      );
    }
  };

  const handleCategory = (e) => {
    if (e.target.checked === true) {
      setCategory([e.target.value, ...category]);
    } else {
      const filterArray = category.filter(
        (category) => category !== e.target.value
      );
      setCategory([...filterArray]);
    }
  };

  const handleArea = (e) => {
    if (e.target.checked === true) {
      setArea([e.target.value, ...area]);
    } else {
      const filterArray = area.filter((area) => area !== e.target.value);
      setArea([...filterArray]);
    }
  };

  const handleFeature = (e) => {
    if (e.target.checked === true) {
      setFeature([e.target.value, ...feature]);
    } else {
      const filterArray = feature.filter(
        (feature) => feature !== e.target.value
      );
      setFeature([...filterArray]);
    }
  };

  // const filterCategory = async () => {
  //   if (category === []) return;
  //   const filtered = await Promise.all(
  //     category.map(
  //       async (element) =>
  //         await posts.filter((post) => post.category.includes(element))
  //     )
  //   );
  //   await setFilteredPosts([...filtered]);
  // };

  // const filterPriceMin = async () => {
  //   if (!priceMin) return;
  //   const filtered = await filteredPosts.filter(
  //     (post) => post.price > priceMin
  //   );
  //   await setFilteredPosts([...filtered]);
  // };

  // useEffect(() => {
  //   if (!priceMin) return;

  // }, [priceMin]);

  const filterPost = async (e) => {
    e.preventDefault();

    const filtered = await posts.filter(
      (post) => post.price >= priceMin && post.price <= priceMax

      // post.breed === breed &&
      // post.age >= ageMin &&
      // post.age <= ageMax &&
      // post.height >= heightMin &&
      // post.height <= heightMax
    );

    await setFilteredPosts([...filtered]);
    // await filterCategory();
    // await filterPriceMin();
    console.log(area);
    console.log(feature);
    console.log(breed);
    console.log(color);
    console.log(priceMin);
    console.log(priceMax);

    await console.log(filteredPosts);
  };

  return (
    <div>
      {console.log(filteredPosts)}
      {console.log(priceMin)}
      {console.log(posts)}
      <Layout title="index">
        <div className="flex mt-24 mb-20">
          <div className="w-1/3 pr-8">
            <Filter
              filterPost={filterPost}
              handleCategory={handleCategory}
              setPriceMin={setPriceMin}
              setPriceMax={setPriceMax}
              setAgeMin={setAgeMin}
              setAgeMax={setAgeMax}
              setHeightMin={setHeightMin}
              setHeightMax={setHeightMax}
              setBreed={setBreed}
              setColor={setColor}
              handleArea={handleArea}
              handleFeature={handleFeature}
            />
          </div>
          <div className="w-2/3 ">
            <Posts
              posts={posts}
              clickPost={clickPost}
              clickHeart={clickHeart}
              currentUser={currentUser}
            />
            <Pagination />
          </div>
        </div>
      </Layout>
    </div>
  );
}
