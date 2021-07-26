const alertMessage = (
  images: string[],
  title: string,
  postText: string,
  video1Title: string,
  video2Title: string,
  video3Title: string,
  horseName: string,
  category: string,
  breed: string,
  gender: string,
  color: string,
  year: number,
  month: number,
  day: number,
  age: number,
  height: number,
  price: number,
  area: string
) => {
  if (images.length === 0) {
    alert("画像を選択してください");
  }
  if (postText.length > 2000) {
    alert("本文は2000字以内でお願いします");
  }
  if (title.length > 20) {
    alert("タイトルは20字以内でお願いします");
  }
  if (postText.length == 0) {
    alert("本文を記入してください");
  }
  if (video1Title.length > 40) {
    alert("動画のタイトルは40字以内でお願いします");
  }
  if (video2Title.length > 40) {
    alert("動画のタイトルは40字以内でお願いします");
  }
  if (video3Title.length > 40) {
    alert("動画のタイトルは40字以内でお願いします");
  }
  if (horseName.length === 0) {
    alert("馬の名前を記入してください");
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
  if (!year) {
    alert("生年月日を記入してください");
  }
  if (!month) {
    alert("生年月日を記入してください");
  }
  if (!day) {
    alert("生年月日を記入してください");
  }
  if (!age) {
    alert("年齢を記入してください");
  }
  if (!height) {
    alert("身長を記入してください");
  }
  if (!price) {
    alert("値段を記入してください");
  }
  if (area.length === 0) {
    alert("地域を選択してください");
  }
  return;
};

export default alertMessage;
