import React from 'react'

const ImageModal = (props) => {
  return (
    <div>
      <div
        className="absolute top-0 bottom-0 left-0 right-0 bg-gray-500 z-40 bg-opacity-70"
        onClick={() => props.setIsOpenModal(false)}
      ></div>
      <img
        src={props.image}
        className="absolute top-0 bottom-0 left-0 right-0  block rounded-lg z-50 opacity-100 mx-auto my-auto translate-x-1/2 translate-y-1/2 overflow-scroll"
        onClick={() => props.setIsOpenModal(false)}
      />
      {console.log("コンポ", props.image)}
    </div>
  );
}

export default ImageModal
