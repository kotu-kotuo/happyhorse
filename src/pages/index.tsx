import { useState, useEffect } from "react";
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
  price: string;
  createdAt: string;
  updatedAt: string;
  likeUserIDs: Array<string>;
  isAvairable: boolean;
  pv: number;
}

export default function Index() {
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
      price: "",
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

  const clickPost = (e) => {
    const pid = e.currentTarget.getAttribute("data-id");
    router.push({
      pathname: `/post/postShow/${pid}`,
    });
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

  const filterPost = (e) => {
    e.preventDefault();
    console.log(category);
    console.log(area);
    console.log(feature);
    console.log(breed);
    console.log(color);
    console.log(priceMin);
    console.log(priceMax);
  };

  return (
    <div>
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
            <Posts posts={posts} clickPost={clickPost} />
            <Pagination />
          </div>
        </div>
      </Layout>
    </div>
  );
}
