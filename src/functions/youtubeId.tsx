const youtubeId = (url: string) => {
  const regex = /https\:\/\/youtu\.be\/([\w-]{11})/;
  const youtubeId = url.match(regex)[1];
  return youtubeId;
};

export default youtubeId;
