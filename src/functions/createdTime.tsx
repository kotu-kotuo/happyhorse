const createdTime = (time) => {
  const Time = new Date(time?.seconds * 1000);
  return Time.toLocaleDateString();
};
export default createdTime;
