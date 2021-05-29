import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { db } from "../utils/firebase";
import { useRouter } from "next/router";
import Posts from "../components/organisms/Posts";
import Pagination from "../components/molecules/Pagination";
import Filter from "../components/organisms/Filter";
import { filterInitialValues, postInitialValues } from "../utils/initialValues";
import * as Types from "../types/types";
import { setPostStates } from "../utils/states";
import { clickHeart } from "../functions/utils";
import { BsFilterRight } from "react-icons/bs";

export default function Index() {
  const { currentUser, user, setUser, notifications } = useContext(AuthContext);
  const router = useRouter();
  const [filteredPosts, setFilteredPosts] = useState<Types.Post[]>([
    postInitialValues,
  ]);
  const [posts, setPosts] = useState<Types.Post[]>([postInitialValues]);
  const [category, setCategory] = useState(filterInitialValues.category);
  const [area, setArea] = useState(filterInitialValues.area);
  const [feature, setFeature] = useState(filterInitialValues.features);
  const [priceMin, setPriceMin] = useState(filterInitialValues.priceMin);
  const [priceMax, setPriceMax] = useState(filterInitialValues.priceMax);
  const [ageMin, setAgeMin] = useState(filterInitialValues.ageMin);
  const [ageMax, setAgeMax] = useState(filterInitialValues.ageMax);
  const [heightMin, setHeightMin] = useState(filterInitialValues.heightMin);
  const [heightMax, setHeightMax] = useState(filterInitialValues.heightMax);
  const [breed, setBreed] = useState(filterInitialValues.breed);
  const [color, setColor] = useState(filterInitialValues.color);
  const [handle, setHandle] = useState("OFF");
  const [width, setWidth] = useState(null);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  //postsをセット
  useEffect(() => {
    db.collectionGroup("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setFilteredPosts(snapshot.docs.map((doc) => setPostStates(doc.data())));
        setPosts(snapshot.docs.map((doc) => setPostStates(doc.data())));
      });
  }, []);

  useEffect(() => {
    if (process.browser) {
      setWidth(window.innerWidth);
    }
  }, []);

  //filter初期値セット
  useEffect(() => {
    if (currentUser) {
      db.collection("users")
        .doc(`${currentUser.uid}`)
        .collection("filters")
        .doc(`${currentUser.uid}`)
        .get()
        .then((snapshot) => {
          setCategory(snapshot.data().category);
          setPriceMin(snapshot.data().priceMin);
          setPriceMax(snapshot.data().priceMax);
          setAgeMin(snapshot.data().ageMin);
          setAgeMax(snapshot.data().ageMax);
          setHeightMin(snapshot.data().heightMin);
          setHeightMax(snapshot.data().heightMax);
          setBreed(snapshot.data().breed);
          setColor(snapshot.data().color);
          setArea(snapshot.data().area);
          setFeature(snapshot.data().feature);

          setHandle("0N");
        });
    }
  }, [currentUser]);

  //filteredPostsをセットして表示
  useEffect(() => {
    if (
      posts &&
      currentUser &&
      !(
        category === filterInitialValues.category &&
        priceMin === filterInitialValues.priceMin &&
        priceMax === filterInitialValues.priceMax &&
        ageMin === filterInitialValues.ageMin &&
        ageMax === filterInitialValues.ageMax &&
        heightMin === filterInitialValues.heightMin &&
        heightMax === filterInitialValues.heightMax &&
        area === filterInitialValues.area &&
        feature === filterInitialValues.features
      )
    ) {
      const filteredArray = posts.filter(
        (post) =>
          category.includes(post.category) &&
          post.price >= priceMin &&
          post.price <= priceMax &&
          post.age >= ageMin &&
          post.age <= ageMax &&
          post.height >= heightMin &&
          post.height <= heightMax &&
          breed.includes(post.breed) &&
          color.includes(post.color) &&
          area.includes(post.area)
      );

      const filteredFeaturesPosts = feature.map((element) =>
        posts.filter((post) => post.features.includes(element))
      );
      const filteredDouble = []
        .concat(...filteredFeaturesPosts)
        .filter((value, index, self) => self.indexOf(value) === index);

      const filteredPostsToSet = filteredArray
        .concat(filteredDouble)
        .filter(
          (value, index, self) =>
            self.indexOf(value) === index && self.lastIndexOf(value) !== index
        );

      setFilteredPosts(filteredPostsToSet);
    }
  }, [handle]);

  //filter条件が選択された後に空になった時、初期値をセットする
  useEffect(() => {
    if (category.length === 0) {
      setCategory(filterInitialValues.category);
    }
  }, [category]);

  useEffect(() => {
    if (!priceMin) {
      setPriceMin(filterInitialValues.priceMin);
    }
  }, [priceMin]);

  useEffect(() => {
    if (!priceMax) {
      setPriceMax(filterInitialValues.priceMax);
    }
  }, [priceMax]);

  useEffect(() => {
    if (!ageMin) {
      setAgeMin(filterInitialValues.ageMin);
    }
  }, [ageMin]);

  useEffect(() => {
    if (!ageMax) {
      setAgeMax(filterInitialValues.ageMax);
    }
  }, [ageMax]);

  useEffect(() => {
    if (!heightMin) {
      setHeightMin(filterInitialValues.heightMin);
    }
  }, [heightMin]);

  useEffect(() => {
    if (!heightMax) {
      setHeightMax(filterInitialValues.heightMax);
    }
  }, [heightMax]);

  useEffect(() => {
    if (area.length === 0) {
      setArea(filterInitialValues.area);
    }
  }, [area]);

  useEffect(() => {
    if (feature[0] === "empty") {
      setFeature(filterInitialValues.features);
    }
  }, [feature]);

  //詳細画面に遷移
  const clickPost = (e) => {
    const pid = e.currentTarget.getAttribute("data-id");
    router.push({
      pathname: `/post/postShow/${pid}`,
    });
  };

  //filterの条件が変更されたら値をセット
  const handleCategory = (e) => {
    if (e.target.checked === true) {
      if (category.length === filterInitialValues.category.length) {
        setCategory([e.target.value]);
      } else {
        setCategory([e.target.value, ...category]);
      }
    } else {
      const filterArray = category.filter(
        (category) => category !== e.target.value
      );
      setCategory([...filterArray]);
    }
  };

  const handleBreed = (e) => {
    if (e.target.value === "allBreed") {
      setBreed(filterInitialValues.breed);
    } else {
      setBreed([e.target.value]);
    }
  };

  const handleColor = (e) => {
    if (e.target.value === "allColor") {
      setColor(filterInitialValues.color);
    } else {
      setColor([e.target.value]);
    }
  };

  const handleArea = (e) => {
    if (e.target.checked === true) {
      const array = e.target.value.split(",");
      if (area.length === 47) {
        setArea([...array]);
      } else {
        setArea([...array, ...area]);
      }
    } else {
      const array = e.target.value.split(",");
      const filterArray = area.filter((area) => !array.includes(area));
      setArea([...filterArray]);
    }
  };

  const handleFeature = (e) => {
    if (e.target.checked === true) {
      if (feature.length === filterInitialValues.features.length) {
        setFeature([e.target.value, "empty"]);
      } else {
        setFeature([e.target.value, ...feature]);
      }
    } else {
      const filterArray = feature.filter(
        (feature) => feature !== e.target.value
      );
      setFeature([...filterArray]);
    }
  };

  //検索が押されたときの処理
  const filterPost = async (e) => {
    e.preventDefault();

    if (width < 1024) {
      setIsOpenFilter(false);
    }

    if (!currentUser) {
      router.push("login");
    } else {
      await db
        .collection("users")
        .doc(`${currentUser.uid}`)
        .collection("filters")
        .doc(`${currentUser.uid}`)
        .update({
          category: category,
          priceMin: priceMin,
          priceMax: priceMax,
          ageMin: ageMin,
          ageMax: ageMax,
          heightMin: heightMin,
          heightMax: heightMax,
          breed: breed,
          color: color,
          area: area,
          feature: feature,
        });

      const filteredArray = posts.filter(
        (post) =>
          category.includes(post.category) &&
          post.price >= priceMin &&
          post.price <= priceMax &&
          post.age >= ageMin &&
          post.age <= ageMax &&
          post.height >= heightMin &&
          post.height <= heightMax &&
          breed.includes(post.breed) &&
          color.includes(post.color) &&
          area.includes(post.area)
      );

      const filteredFeaturesPosts = feature.map((element) =>
        posts.filter((post) => post.features.includes(element))
      );
      const filteredDouble = []
        .concat(...filteredFeaturesPosts)
        .filter((value, index, self) => self.indexOf(value) === index);

      const filteredPostsToSet = filteredArray
        .concat(filteredDouble)
        .filter(
          (value, index, self) =>
            self.indexOf(value) === index && self.lastIndexOf(value) !== index
        );

      await setFilteredPosts(filteredPostsToSet);
    }
  };

  //クリアが押されたとき
  const filterClear = () => {
    setCategory(filterInitialValues.category);
    setPriceMin(filterInitialValues.priceMin);
    setPriceMax(filterInitialValues.priceMax);
    setAgeMin(filterInitialValues.ageMin);
    setAgeMax(filterInitialValues.ageMax);
    setHeightMin(filterInitialValues.heightMin);
    setHeightMax(filterInitialValues.heightMax);
    setBreed(filterInitialValues.breed);
    setColor(filterInitialValues.color);
    setArea(filterInitialValues.area);
    setFeature(filterInitialValues.features);
  };

  return (
    <div>
      {console.log(width)}
      <Layout title="index">
        <div className="flex px-3 my-4 md:mt-10 lg:mt-24 lg:mb-20">
          {width >= 1024 && (
            <div className="w-1/3 pr-8">
              <Filter
                filterPost={filterPost}
                handleCategory={handleCategory}
                handleBreed={handleBreed}
                handleColor={handleColor}
                handleArea={handleArea}
                handleFeature={handleFeature}
                setPriceMin={setPriceMin}
                setPriceMax={setPriceMax}
                setAgeMin={setAgeMin}
                setAgeMax={setAgeMax}
                setHeightMin={setHeightMin}
                setHeightMax={setHeightMax}
                setBreed={setBreed}
                setColor={setColor}
                category={category}
                priceMin={priceMin}
                priceMax={priceMax}
                ageMin={ageMin}
                ageMax={ageMax}
                heightMin={heightMin}
                heightMax={heightMax}
                breed={breed}
                color={color}
                area={area}
                feature={feature}
                filterClear={filterClear}
              />
            </div>
          )}
          <div className="w-full max-w-2xl mx-auto lg:w-2/3">
            {width < 1024 && (
              <>
                <div
                  className="ml-auto mb-3 shadow-md border border-gray-50 rounded-lg w-28"
                  onClick={() => {
                    setIsOpenFilter(!isOpenFilter);
                  }}
                >
                  <div className="flex items-center text-gray-600 text-sm py-1 pl-3 pr-2">
                    <BsFilterRight className="text-xl" />
                    <p className="whitespace-nowrap ml-1">絞り込み</p>
                  </div>
                </div>
                {isOpenFilter && (
                  <div className="mb-4 ">
                    <Filter
                      filterPost={filterPost}
                      handleCategory={handleCategory}
                      handleBreed={handleBreed}
                      handleColor={handleColor}
                      handleArea={handleArea}
                      handleFeature={handleFeature}
                      setPriceMin={setPriceMin}
                      setPriceMax={setPriceMax}
                      setAgeMin={setAgeMin}
                      setAgeMax={setAgeMax}
                      setHeightMin={setHeightMin}
                      setHeightMax={setHeightMax}
                      setBreed={setBreed}
                      setColor={setColor}
                      category={category}
                      priceMin={priceMin}
                      priceMax={priceMax}
                      ageMin={ageMin}
                      ageMax={ageMax}
                      heightMin={heightMin}
                      heightMax={heightMax}
                      breed={breed}
                      color={color}
                      area={area}
                      feature={feature}
                      filterClear={filterClear}
                    />
                  </div>
                )}
              </>
            )}
            {currentUser && filteredPosts.length === 0 ? (
              <div className="delay-1000 animate-fade-in-down">
                ご希望の馬は掲載されていませんでした。。
              </div>
            ) : (
              <Posts
                posts={filteredPosts}
                clickPost={clickPost}
                clickHeart={clickHeart}
                currentUser={currentUser}
                user={user}
                setUser={setUser}
                router={router}
                db={db}
                notifications={notifications}
                width={width}
              />
            )}

            <Pagination />
          </div>
        </div>
      </Layout>
    </div>
  );
}
