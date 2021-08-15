import { FC } from "react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  image: string;
};

const ImageModal: FC<Props> = (props) => {
  const { setIsOpenModal, image } = props;

  return (
    <div>
      <div
        className="absolute inset-0 bg-gray-500 z-40 bg-opacity-70 flex justify-center align-middle "
        onClick={() => setIsOpenModal(false)}
      >
        <img
          src={image}
          className="rounded-lg z-50 opacity-100 mx-auto my-auto overflow-scroll"
          onClick={() => setIsOpenModal(false)}
        />
      </div>
    </div>
  );
};

export default ImageModal;
