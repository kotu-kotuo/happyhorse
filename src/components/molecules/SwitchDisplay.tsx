import React, { SetStateAction } from "react";
import { useRouter } from "next/router";
import { Dispatch } from "react";
import { FC } from "react";

type Props = {
  setIsLeftHidden: Dispatch<SetStateAction<boolean>>;
  setIsRightHidden: Dispatch<SetStateAction<boolean>>;
  title: string;
  textLeft: string;
  textRight: string;
};

const SwitchDisplay: FC<Props> = (props) => {
  const { setIsLeftHidden, setIsRightHidden, title, textLeft, textRight } =
    props;

  return (
    <>
      <h2 className="fontSize-xl text-center mt-8 mb-7 text-gray-900 sm:mb-10 sm:mt-12">
        {title}
      </h2>
      <div className="message-switch flex justify-around max-w-2xl mx-auto text-center items-center px-1">
        <input type="radio" name="switch" id="myPost" defaultChecked={true} />
        <label
          htmlFor="myPost"
          className="rounded-l-md cursor-pointer"
          onClick={() => {
            setIsLeftHidden(false);
            setIsRightHidden(true);
          }}
        >
          <p className="fontSize-base">{textLeft}</p>
        </label>
        <input type="radio" name="switch" id="sendMessagePost" />
        <label
          htmlFor="sendMessagePost"
          className="rounded-r-md cursor-pointer"
          onClick={() => {
            setIsLeftHidden(true);
            setIsRightHidden(false);
          }}
        >
          <p
            className={
              useRouter().pathname === "/reviews"
                ? "text-sm sm:text-base"
                : "text-xs my-0.5 sm:text-base"
            }
          >
            {textRight}
          </p>
        </label>
      </div>
    </>
  );
};

export default SwitchDisplay;
