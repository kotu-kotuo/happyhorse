import { db } from "../firebase/firebase";
import getAge from "./getAge";

const filtering = (currentUser, posts) => {
  if (currentUser) {
    return db
      .collection("users")
      .doc(`${currentUser.uid}`)
      .collection("filters")
      .doc(`${currentUser.uid}`)
      .get()
      .then((snapshot) => {
        const {
          showOnlyAvailable,
          category,
          priceMin,
          priceMax,
          ageMin,
          ageMax,
          heightMin,
          heightMax,
          breed,
          gender,
          color,
          area,
          feature,
        } = snapshot.data();

        const filteredArray = posts
          .filter(
            (post) =>
              category.includes(post.category) &&
              post.price >= priceMin &&
              post.price <= priceMax &&
              getAge(post.birth) >= ageMin &&
              getAge(post.birth) <= ageMax &&
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

        return filteredPostsToSet;
      });
  }
};

export default filtering;
