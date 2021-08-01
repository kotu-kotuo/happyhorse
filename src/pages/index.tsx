import React, { useState, useEffect, useContext, ReactNode } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { db } from "../firebase/firebase";
import { useRouter } from "next/router";
import Posts from "../components/organisms/Posts";
import Pagination from "../components/molecules/Pagination";
import Filter from "../components/organisms/Filter";
import { filterInitialValues, postInitialValues } from "../utils/initialValues";
import clickHeart from "../functions/clickHeart";
import { BsFilterRight } from "react-icons/bs";
import { NextPage } from "next";
import { Post } from "../types/types";
import LoginModal from "../components/molecules/LoginModal";
import admin from "../firebase/admin";
import Meta from "../components/Meta";

const Index: NextPage = ({ posts }: any) => {
  const { currentUser, user, setUser, notifications } = useContext(AuthContext);
  const router = useRouter();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([
    postInitialValues,
  ]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(
    filterInitialValues.showOnlyAvailable
  );
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
  const [gender, setGender] = useState(filterInitialValues.gender);
  const [color, setColor] = useState(filterInitialValues.color);
  const [handle, setHandle] = useState("OFF");
  const [width, setWidth] = useState(null);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const metaImage = "/ogp-hh.png";

  //postsをセット
  useEffect(() => {
    setFilteredPosts(posts);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
          setShowOnlyAvailable(snapshot.data()?.showOnlyAvailable);
          setCategory(snapshot.data().category);
          setPriceMin(snapshot.data().priceMin);
          setPriceMax(snapshot.data().priceMax);
          setAgeMin(snapshot.data().ageMin);
          setAgeMax(snapshot.data().ageMax);
          setHeightMin(snapshot.data().heightMin);
          setHeightMax(snapshot.data().heightMax);
          setBreed(snapshot.data().breed);
          setGender(snapshot.data().gender);
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
        showOnlyAvailable === filterInitialValues.showOnlyAvailable &&
        category === filterInitialValues.category &&
        priceMin === filterInitialValues.priceMin &&
        priceMax === filterInitialValues.priceMax &&
        ageMin === filterInitialValues.ageMin &&
        ageMax === filterInitialValues.ageMax &&
        heightMin === filterInitialValues.heightMin &&
        heightMax === filterInitialValues.heightMax &&
        breed === filterInitialValues.breed &&
        gender === filterInitialValues.gender &&
        color === filterInitialValues.color &&
        area === filterInitialValues.area &&
        feature === filterInitialValues.features
      )
    ) {
      const filteredArray = posts
        .filter((post) =>
          category.includes(post.category) &&
          post.price >= priceMin &&
          post.price <= priceMax &&
          post.age >= ageMin &&
          post.age <= ageMax &&
          post.height >= heightMin &&
          post.height <= heightMax &&
          breed.includes(post.breed) &&
          gender
            ? gender.includes(post.gender)
            : true && color.includes(post.color) && area.includes(post.area)
        )
        .filter((post) =>
          showOnlyAvailable ? post.isAvairable === true : true
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

  //詳細画面に遷移
  const clickPost = (e) => {
    const pid = e.currentTarget.getAttribute("data-id");
    router.push({
      pathname: `/post/postShow/${pid}`,
    });
  };

  //検索が押されたときの処理
  const filterPost = async (e) => {
    e.preventDefault();

    if (width < 1024) {
      setIsOpenFilter(false);
    }

    if (!currentUser) {
      setIsLoginModalOpen(true);
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
          gender: gender,
          color: color,
          area: area,
          feature: feature,
        });

      const filteredArray = posts
        .filter(
          (post) =>
            category.includes(post.category) &&
            post.price >= priceMin &&
            post.price <= priceMax &&
            post.age >= ageMin &&
            post.age <= ageMax &&
            post.height >= heightMin &&
            post.height <= heightMax &&
            breed.includes(post.breed) &&
            gender.includes(post.gender) &&
            color.includes(post.color) &&
            area.includes(post.area)
        )
        .filter((post) =>
          showOnlyAvailable ? post.isAvairable === true : true
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
    setShowOnlyAvailable(filterInitialValues.showOnlyAvailable);
    setCategory(filterInitialValues.category);
    setPriceMin(filterInitialValues.priceMin);
    setPriceMax(filterInitialValues.priceMax);
    setAgeMin(filterInitialValues.ageMin);
    setAgeMax(filterInitialValues.ageMax);
    setHeightMin(filterInitialValues.heightMin);
    setHeightMax(filterInitialValues.heightMax);
    setBreed(filterInitialValues.breed);
    setGender(filterInitialValues.gender);
    setColor(filterInitialValues.color);
    setArea(filterInitialValues.area);
    setFeature(filterInitialValues.features);
  };

  return (
    <div>
      <Layout title="happy horse">
        <Meta
          metaTitle="happy horse"
          metaURL="https://www.happyhorse.xyz/"
          description="馬の売買プラットフォーム"
          metaImage="https://firebasestorage.googleapis.com/v0/b/happyhorse-prod.appspot.com/o/ogp-hh.png?alt=media&token=6a8c8771-2193-40a4-8f6b-920544654e05"
        />
        {console.log(posts)}
        {console.log(filteredPosts)}
        <LoginModal
          isLoginModalOpen={isLoginModalOpen}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
        <div className="flex px-2 my-4 md:px-3 md:mt-10 lg:mt-24 lg:mb-20">
          {width >= 1024 && (
            <div className="w-1/3 pr-8">
              <Filter
                filterPost={filterPost}
                setPriceMin={setPriceMin}
                setPriceMax={setPriceMax}
                setAgeMin={setAgeMin}
                setAgeMax={setAgeMax}
                setHeightMin={setHeightMin}
                setHeightMax={setHeightMax}
                setBreed={setBreed}
                setColor={setColor}
                category={category}
                setCategory={setCategory}
                priceMin={priceMin}
                priceMax={priceMax}
                ageMin={ageMin}
                ageMax={ageMax}
                heightMin={heightMin}
                heightMax={heightMax}
                breed={breed}
                gender={gender}
                setGender={setGender}
                color={color}
                area={area}
                setArea={setArea}
                feature={feature}
                setFeature={setFeature}
                showOnlyAvailable={showOnlyAvailable}
                setShowOnlyAvailable={setShowOnlyAvailable}
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
                  <div className="flex items-center text-gray-600 text-sm py-1 pl-3 pr-2 cursor-pointer hover:opacity-80">
                    <BsFilterRight className="text-xl" />
                    <p className="whitespace-nowrap ml-1">絞り込み</p>
                  </div>
                </div>
                {isOpenFilter && (
                  <div className="mb-4 ">
                    <Filter
                      filterPost={filterPost}
                      setPriceMin={setPriceMin}
                      setPriceMax={setPriceMax}
                      setAgeMin={setAgeMin}
                      setAgeMax={setAgeMax}
                      setHeightMin={setHeightMin}
                      setHeightMax={setHeightMax}
                      setBreed={setBreed}
                      setColor={setColor}
                      category={category}
                      setCategory={setCategory}
                      priceMin={priceMin}
                      priceMax={priceMax}
                      ageMin={ageMin}
                      ageMax={ageMax}
                      heightMin={heightMin}
                      heightMax={heightMax}
                      breed={breed}
                      gender={gender}
                      setGender={setGender}
                      color={color}
                      area={area}
                      setArea={setArea}
                      feature={feature}
                      setFeature={setFeature}
                      showOnlyAvailable={showOnlyAvailable}
                      setShowOnlyAvailable={setShowOnlyAvailable}
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
                posts={currentUser ? filteredPosts : posts}
                clickPost={clickPost}
                clickHeart={clickHeart}
                currentUser={currentUser}
                user={user}
                setUser={setUser}
                router={router}
                notifications={notifications}
                width={width}
                setIsLoginModalOpen={setIsLoginModalOpen}
              />
            )}

            {/* <Pagination /> */}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Index;

export async function getStaticProps() {
  const db = admin.firestore();

  const data: FirebaseFirestore.DocumentData[] = (
    await db.collectionGroup("posts").orderBy("createdAt", "desc").get()
  ).docs.map((doc) => doc.data());

  const posts = JSON.parse(JSON.stringify(data));

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}
