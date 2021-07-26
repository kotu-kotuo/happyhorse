import React, { Dispatch, FC, SetStateAction } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { IoChevronDownOutline } from "react-icons/io5";
import { RiYoutubeLine } from "react-icons/ri";

type Props = {
  setVideo1URL: Dispatch<SetStateAction<string>>;
  setVideo1Title: Dispatch<SetStateAction<string>>;
  setVideo2URL: Dispatch<SetStateAction<string>>;
  setVideo2Title: Dispatch<SetStateAction<string>>;
  setVideo3URL: Dispatch<SetStateAction<string>>;
  setVideo3Title: Dispatch<SetStateAction<string>>;
};

const AttachVideo: FC<Props> = (props) => {
  const {
    setVideo1URL,
    setVideo1Title,
    setVideo2URL,
    setVideo2Title,
    setVideo3URL,
    setVideo3Title,
  } = props;

  return (
    <div className="w-full">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm text-left text-white bg-mainGreen rounded-md hover:opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <div className="flex items-center">
                <RiYoutubeLine className="text-2xl" />
                <span className="ml-1">YouTube動画</span>
              </div>
              <IoChevronDownOutline
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-white`}
              />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-100 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel
                className="pt-4 pb-2 text-sm text-gray-500"
                static
              >
                <div className="flex w-full mb-6">
                  <div className="my-auto text-lg mr-3 bg-white border-2 border-gray-500 rounded-md px-2 sm:text-xl">
                    1
                  </div>
                  <div className="w-full">
                    <div className="postFormLabel">URL</div>
                    <input
                      type="text"
                      name="url"
                      className="inputText rounded-md mb-2"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideo1URL(e.target.value);
                      }}
                    />
                    <div className="postFormLabel">タイトル（40字以内）</div>
                    <input
                      type="text"
                      name="videoTitle"
                      className="inputText rounded-md"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideo1Title(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex w-full mb-6">
                  <div className="my-auto text-lg mr-3 bg-white border-2 border-gray-500 rounded-md px-2 sm:text-xl">
                    2
                  </div>
                  <div className="w-full">
                    <div className="postFormLabel">URL</div>
                    <input
                      type="text"
                      name="url"
                      className="inputText rounded-md mb-2"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideo2URL(e.target.value);
                      }}
                    />
                    <div className="postFormLabel">タイトル（40字以内）</div>
                    <input
                      type="text"
                      name="videoTitle"
                      className="inputText rounded-md"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideo2Title(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="my-auto text-lg mr-3 bg-white border-2 border-gray-500 rounded-md px-2 sm:text-xl">
                    3
                  </div>
                  <div className="w-full">
                    <div className="postFormLabel">URL</div>
                    <input
                      type="text"
                      name="url"
                      className="inputText rounded-md mb-2"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideo3URL(e.target.value);
                      }}
                    />
                    <div className="postFormLabel">タイトル（40字以内）</div>
                    <input
                      type="text"
                      name="videoTitle"
                      className="inputText rounded-md"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideo3Title(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default AttachVideo;
