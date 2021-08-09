import React, { FC } from "react";
import VideoListItem from "./VideoListItem";

type Props = {
  video1URL: string;
  video1Title: string;
  video2URL: string;
  video2Title: string;
  video3URL: string;
  video3Title: string;
};

const VideoList: FC<Props> = (props) => {
  const {
    video1URL,
    video1Title,
    video2URL,
    video2Title,
    video3URL,
    video3Title,
  } = props;
  return (
    <div className="pt-4 -mx-4 sm:mx-0">
      <VideoListItem videoURL={video1URL} videoTitle={video1Title} />
      <VideoListItem videoURL={video2URL} videoTitle={video2Title} />
      <VideoListItem videoURL={video3URL} videoTitle={video3Title} />
    </div>
  );
};

export default VideoList;
