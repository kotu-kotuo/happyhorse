const getAge = (birth) => {
  //今日
  var today = new Date();

  //今年の誕生日
  var thisYearsBirthday = new Date(
    today.getFullYear(),
    birth.month - 1,
    birth.day
  );

  //年齢
  var age = today.getFullYear() - birth.year;

  if (today < thisYearsBirthday) {
    //今年まだ誕生日が来ていない
    age--;
  }

  return age;
};

export default getAge;
