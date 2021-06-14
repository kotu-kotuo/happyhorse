import React from "react";
import { RiCloseCircleFill, RiImageAddFill } from "react-icons/ri";
import { filterInitialValues } from "../../utils/initialValues";
import RequiredMark from "../atoms/RequiredMark";

const PostEditForm = (props) => {
  const {
    previewsURL,
    setPreviewsURL,
    post,
    images,
    setImages,
    setTitle,
    setPostText,
    setHorseName,
    setCategory,
    setBreed,
    setColor,
    setYear,
    setMonth,
    setDay,
    setHeight,
    setAge,
    setArea,
    setPrice,
    features,
    setFeatures,
  } = props;

  const handleImages = (e) => {
    const uploadImages = e.target.files;
    if ([...images, ...uploadImages].length <= 10) {
      setImages([...images, ...uploadImages]);
    } else {
      alert("画像は10枚までです。");
    }
  };

  const deletePreview = (index) => {
    images.splice(index, 1);
    setImages(images);
    const imageURLs = images.map((image) => URL.createObjectURL(image));
    setPreviewsURL([...imageURLs]);
  };

  const handleFeatures = (e) => {
    if (e.target.checked === true) {
      setFeatures([e.target.value, ...features]);
    } else {
      const filterArray = features.filter(
        (feature) => feature !== e.target.value
      );
      setFeatures([...filterArray]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600 mb-3 ml-1">
          画像
          <RequiredMark />
        </div>
        <div className="text-xs text-gray-600 mb-3 mr-1">
          <RequiredMark />
          は必須項目です
        </div>
      </div>
      <div className="flex flex-wrap mb-2">
        {previewsURL &&
          previewsURL.map((previewURL, index) => (
            <div key={index} className="mr-6">
              <img
                src={previewURL}
                className="h-12 w-20 mb-4 object-cover sm:h-20 sm:w-32"
              />
              <div onClick={() => deletePreview(index)}>
                <RiCloseCircleFill className="text-gray-500 text-2xl opacity-80 ml-auto -mt-3 cursor-pointer mb-4" />
              </div>
            </div>
          ))}
      </div>
      <label
        htmlFor="file"
        className="block w-40 mr-3 mb-8 focus:outline-none text-white text-base font-medium py-2.5 px-5 rounded-md bg-mainGreen hover:opacity-90 hover:shadow-lg cursor-pointer"
      >
        <div className="flex items-center text-center">
          <RiImageAddFill className="text-lg ml-1 sm:text-base" />
          <p className="ml-2.5 fontSize-base">画像を選択</p>
        </div>
      </label>

      <input
        id="file"
        name="images"
        type="file"
        accept="image/*"
        className="mb-8 hidden"
        multiple
        defaultValue={post?.images}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleImages(e);
        }}
      />

      {post.postID && (
        <>
          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              タイトル
              <RequiredMark />
            </div>
            <input
              type="text"
              name="title"
              defaultValue={post?.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              className="inputText rounded-md"
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              本文
              <RequiredMark />
            </div>
            <textarea
              name="postText"
              defaultValue={post?.postText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPostText(e.target.value)
              }
              className="h-36 rounded-md inputText whitespace-pre"
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              馬の名前
              <RequiredMark />
            </div>
            <input
              type="text"
              name="horseName"
              defaultValue={post?.horseName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHorseName(e.target.value)
              }
              className="inputText rounded-md"
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              カテゴリー
              <RequiredMark />
            </div>
            {console.log(post)}
            {post && (
              <select
                name="category"
                defaultValue={post?.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCategory(e.target.value)
                }
                className="inputText rounded-md"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.category.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              品種
              <RequiredMark />
            </div>
            {post && (
              <select
                name="breed"
                defaultValue={post?.breed}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setBreed(e.target.value)
                }
                className="inputText rounded-md"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.breed.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              毛色
              <RequiredMark />
            </div>
            {post && (
              <select
                name="color"
                defaultValue={post?.color}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setColor(e.target.value)
                }
                className="inputText rounded-md"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.color.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              生年月日
              <RequiredMark />
            </div>
            <div className="flex items-center">
              <input
                type="number"
                name="year"
                placeholder="2010"
                defaultValue={post?.birth.year}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setYear(e.target.value)
                }
                className="inputFormNumber w-20"
              />
              <div className="mr-6 ml-2 text-sm">年</div>
              <input
                type="number"
                name="month"
                placeholder="1"
                defaultValue={post?.birth.month}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMonth(e.target.value)
                }
                className="inputFormNumber w-16"
              />
              <div className="mr-6 ml-2 text-sm">月</div>
              <input
                type="number"
                name="day"
                placeholder="10"
                defaultValue={post?.birth.day}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDay(e.target.value)
                }
                className="inputFormNumber w-16"
              />
              <div className="mr-6 ml-2 text-sm">日</div>
            </div>
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">年齢</div>
            <input
              type="number"
              name="age"
              defaultValue={post?.age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAge(e.target.value)
              }
              className="inputFormNumber w-full"
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              身長（cm）
              <RequiredMark />
            </div>
            <input
              type="number"
              name="height"
              defaultValue={post?.height}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHeight(e.target.value)
              }
              className="inputFormNumber w-full"
            />
          </div>

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-1">
              地域
              <RequiredMark />
            </div>
            {post && (
              <select
                name="area"
                defaultValue={post?.area}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setArea(e.target.value)
                }
                className="inputText rounded-md"
              >
                <option hidden>選択してください</option>
                {filterInitialValues.area.map((element) => (
                  <option value={`${element}`}>{`${element}`}</option>
                ))}
              </select>
            )}
          </div>

          <div className="text-xs text-gray-600 mb-1 ml-1">特徴</div>
          {post && (
            <div className="flex flex-wrap mb-6">
              {filterInitialValues.features.map((element) => (
                <>
                  <div className="mb-4 ml-4" hidden={element === "empty"}>
                    <label className="text-sm font-medium text-gray-800 cursor-pointer">
                      <input
                        name="features"
                        value={`${element}`}
                        type="checkbox"
                        defaultChecked={
                          post?.features.includes(`${element}`) ? true : false
                        }
                        onClick={handleFeatures}
                        className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                      />
                      {`${element}`}
                    </label>
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="formItemContainer">
            <div className="text-xs text-gray-600 mb-1 ml-3">
              値段
              <RequiredMark />
            </div>
            <div className="flex">
              <div className="text-gray-500 text-xl mt-1.5">￥</div>
              <input
                type="number"
                name="price"
                defaultValue={post?.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPrice(e.target.value)
                }
                className="inputFormNumber w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostEditForm;
