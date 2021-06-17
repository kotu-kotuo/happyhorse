import React from "react";
import { CgSmile, CgSmileNone } from "react-icons/cg";
import submitReview from "../../functions/message/submitReview";

const RatingModal = (props) => {
  const {
    isOpenRatingModal,
    setIsOpenRatingModal,
    setRateValue,
    setReviewText,
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
  } = props;
  return (
    <div>
      {isOpenRatingModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none transition-all duration-500 opacity-100 animate-fade-in">
            <div className="relative w-full mx-auto max-w-2xl px-2 sm:px-3">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*content*/}
                <form
                  className="mx-auto py-5 px-2 w-full sm:px-8"
                  onSubmit={(e) => {
                    submitReview(
                      e,
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
                      setIsOpenRatingModal
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
                        <CgSmile className="text-2xl" />
                        <p className="fontSize-base">良い</p>
                      </div>
                    </label>

                    <label className="bad-button ml-3">
                      <input
                        type="radio"
                        value="bad"
                        name="rate"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setRateValue(e.target.value);
                        }}
                        className="hidden"
                      />
                      <div className="flex items-center">
                        <CgSmileNone className="text-2xl" />
                        <p className="fontSize-base">残念</p>
                      </div>
                    </label>
                  </div>
                  <textarea
                    className="h-36 inputText rounded-md"
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
                      className="fontSize-base focus:outline-none text-white font-semibold py-1.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg"
                    >
                      評価を送信
                    </button>
                    <button
                      onClick={() => {
                        setIsOpenRatingModal(false);
                      }}
                      type="button"
                      className="fontSize-base focus:outline-none text-gray-500 border border-gray-400 font-semibold py-1.5 px-5 rounded-md bg-white hover:opacity-90 hover:shadow-lg"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            className={
              isOpenRatingModal
                ? "opacity-50 fixed inset-0 z-40 bg-white transition-all duration-1000 animate-fade-in"
                : "opacity-0 fixed inset-0 z-40 bg-black transition-all duration-1000 animate-fade-out"
            }
          ></div>
        </>
      ) : null}
    </div>
  );
};

export default RatingModal;
