const ImageModal = (props) => {
  const { setIsOpenModal, image } = props;

  return (
    <div>
      <div
        className="absolute inset-0 bg-gray-500 z-40 bg-opacity-70"
        onClick={() => setIsOpenModal(false)}
      ></div>
      <img
        src={image}
        className="absolute inset-0  block rounded-lg z-50 opacity-100 mx-auto my-auto translate-x-1/2 translate-y-1/2 overflow-scroll"
        onClick={() => setIsOpenModal(false)}
      />
    </div>
  );
};

export default ImageModal;
