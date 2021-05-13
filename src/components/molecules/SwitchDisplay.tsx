import React from "react";

const SwitchDisplay = (props) => {
  return (
    <>
      <h2 className="text-center mt-10 mb-10 text-xl text-gray-900">
        {props.title}
      </h2>
      <div className="message-switch flex justify-around max-w-2xl mx-auto text-center items-center">
        <input type="radio" name="switch" id="myPost" defaultChecked={true} />
        <label
          htmlFor="myPost"
          className="rounded-l-md cursor-pointer"
          onClick={() => {
            props.setIsLeftHidden(false);
            props.setIsRightHidden(true);
          }}
        >
          {props.textLeft}
        </label>
        <input type="radio" name="switch" id="sendMessagePost" />
        <label
          htmlFor="sendMessagePost"
          className="rounded-r-md cursor-pointer"
          onClick={() => {
            props.setIsLeftHidden(true);
            props.setIsRightHidden(false);
          }}
        >
          {props.textRight}
        </label>
      </div>
    </>
  );
};

export default SwitchDisplay;
