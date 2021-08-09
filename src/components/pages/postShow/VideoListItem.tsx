import React, { FC } from "react";
import youtubeId from "../../../functions/youtubeId";

type Props = {
  videoURL: string;
  videoTitle: string;
};

const VideoListItem: FC<Props> = (props) => {
  const { videoURL, videoTitle } = props;

  return (
    <div>
      {videoURL && (
        <>
          <div className="mb-6 mt-14 relative w-full pt-image">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${youtubeId(videoURL)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 h-full w-full"
            ></iframe>
          </div>
          <div className="mx-4 sm:mx-0">
            <div className="fontSize-base text-gray-700 mt-4 font-semibold">
              {videoTitle}
            </div>
            <div className="border-b shadow-xs my-6"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoListItem;
