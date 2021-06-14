const alertMessage = (
  images,
  postText,
  horseName,
  category,
  breed,
  gender,
  color,
  year,
  month,
  day,
  age,
  height,
  price,
  area
) => {
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
  if (gender.length === 0) {
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

export default alertMessage;
