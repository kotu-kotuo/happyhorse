import Link from "next/link";
import { FaYenSign } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHorse } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

const Posts = (props) => {
  return (
    <div>
      {props.posts.map((post) => (
        <div key={post.postID} className="border-b border-gray-300 pb-6 mb-16">
          {/* <Link href={`${post.postID}`}> */}
          <div
            className="flex mb-5 z-0"
            data-id={post.postID}
            onClick={props.clickPost}
          >
            <div className="w-2/3">
              <div className="pb-image w-full h-0 relative">
                <img
                  src={post.images[0] ? post.images[0] : "/no-image.png"}
                  className="object-cover outline-none w-full h-full cursor-pointer absolute"
                />
              </div>
            </div>
            <div className="w-1/3">
              <div className="pb-image w-full h-0 relative">
                <img
                  src={post.images[1] ? post.images[1] : "/no-image.png"}
                  className="object-cover outline-none w-full h-full cursor-pointer absolute"
                />
              </div>
              <div className="pb-image w-full h-0 relative">
                <img
                  src={post.images[2] ? post.images[2] : "/no-image.png"}
                  className="object-cover outline-none w-full h-full cursor-pointer absolute"
                />
              </div>
            </div>
          </div>
          {/* </Link> */}
          <div className="flex items-center ml-2">
            {post.category === "障害馬" && (
              <div className="border rounded-full border-red-700 text-red-700 text-sm px-4 py-0.5  font-semibold">
                {post.category}
              </div>
            )}
            {post.category === "馬場馬" && (
              <div className="border rounded-full border-blue-900 text-blue-900 text-sm px-4 py-0.5  font-semibold">
                {post.category}
              </div>
            )}
            {post.category === "総合馬" && (
              <div className="border rounded-full border-green-800 text-green-800 text-sm px-4 py-0.5  font-semibold">
                {post.category}
              </div>
            )}
            {post.category === "レクレーション" && (
              <div className="border rounded-full border-yellow-300 text-yellow-300 text-sm px-4 py-0.5  font-semibold">
                {post.category}
              </div>
            )}

            <FaYenSign className="text-gray-400 text-xl ml-4 " />
            <div className="text-gray-900 ml-1">{post.price}円</div>

            <FaHorse className="text-gray-400 text-xl ml-6" />
            <div className="text-gray-900 ml-2">{post.breed}</div>

            <FaMapMarkerAlt className="text-gray-400 text-xl ml-5 " />
            <div className="text-gray-900 ml-1.5">{post.area}</div>
          </div>
          <Link href={`${post.postID}`}>
            <div className="cursor-pointer">
              <h2 className="index-title">{post.title}</h2>
            </div>
          </Link>
          <p className="index-postText">{post.postText}</p>
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center ml-1">
              <img
                src={post.avatar}
                className="object-cover cursor-pointer rounded-full w-12 h-12"
              />
              <p className="text-gray-900 ml-3">{post.username}</p>
            </div>
            <div className="flex items-center">
              <FaRegHeart className="text-3xl text-gray-900" />
              <p className="text-gray-900 ml-3 mr-1">お気に入り</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
