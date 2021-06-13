import React from "react";
import { confirmAlert } from "react-confirm-alert";
import { CgSmile, CgSmileNone } from "react-icons/cg";
import submitReview from "./submitReview";

const rating = (
  post,
  chatroom,
  messages,
  setMessages,
  currentUser,
  user,
  rateValue,
  reviewText,
  reviewsOnHold,
  setReviewsOnHold,
  messageReceiver,
  setRateValue,
  setReviewText
) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="custom-ui w-full">
          <form
            className="mx-auto p-2 max-w-2xl"
            onSubmit={() => {
              submitReview(
                post,
                chatroom,
                messages,
                setMessages,
                currentUser,
                user,
                rateValue,
                reviewText,
                reviewsOnHold,
                setReviewsOnHold,
                messageReceiver,
                onClose
              );
            }}
          >
            <div className="flex items-center justify-center mb-3">
              <label className="good-button mr-3">
                <input
                  type="radio"
                  value="good"
                  name="rate"
                  defaultChecked={true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setRateValue(e.target.value);
                  }}
                  className="hidden"
                />
                <div className="flex items-center">
                  <CgSmile className="text-3xl" />
                  <p className="text-lg">良い</p>
                </div>
              </label>

              <label className="bad-button ml-3">
                <input
                  type="radio"
                  value="bad"
                  name="rate"
                  onChange={(e) => {
                    setRateValue(e.target.value);
                  }}
                  className="hidden"
                />
                <div className="flex items-center">
                  <CgSmileNone className="text-3xl" />
                  <p className="text-lg">残念</p>
                </div>
              </label>
            </div>
            <textarea
              className="w-full h-36 appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="この度はありがとうございました！"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setReviewText(e.target.value);
              }}
            />
            <div className="text-right w-full block">
              <p className="text-xs text-gray-500 text-right ml-auto inline">
                ※お互いに評価が完了したのち反映されます
              </p>
            </div>

            <div className="flex justify-around mt-8">
              <button
                type="submit"
                className="focus:outline-none text-white text-base font-semibold py-1.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
              >
                評価を送信
              </button>
              <button
                onClick={onClose}
                className="focus:outline-none text-gray-500 text-base border border-gray-400 font-semibold py-1.5 px-5 rounded-md bg-white hover:opacity-90 hover:shadow-lg"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      );
    },
  });
};

export default rating;
