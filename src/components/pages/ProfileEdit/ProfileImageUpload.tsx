import React, { FC } from "react";

type Props = {
  image: string;
  setImage: (file: File) => void;
  label: string;
  src: string;
  rounded: string;
};

const ProfileImageUpload: FC<Props> = (props) => {
  const { image, setImage, label, src, rounded } = props;
  return (
    <div>
      <div className="text-xs text-gray-500 mb-2 ml-1">{label}</div>
      <div className="flex items-center mb-6">
        <div>
          <img
            className={`w-16 h-16 mr-10 object-cover ${rounded} sm:w-20 sm:h-20`}
            src={image ? URL.createObjectURL(image) : src}
            alt="uploaded"
          />
        </div>
        <input
          className="text-xs inline w-full text-gray-500 sm:text-base"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setImage(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;
