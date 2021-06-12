import Link from 'next/link';
import { FaRegHeart } from 'react-icons/fa';

const PostListItem = (props) => {
  const {  post } = props;
  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`postShow/${post.postID}`}>
        <div className="mx-2 my-4 rounded-md shadow border-gray-500">
          <div className="flex">
            <div>
              <img
                src={post.images[0]}
                className="h-14 w-14 rounded-l-md mr-3 block object-cover sm:h-18 sm:w-28"
              />
            </div>
            <div className="px-3 py-1 max-w-3xl w-full">
              <div className="fontSize-base text-gray-900 mr-0.5 mt-1 mb-0 line-clamp-1 sm:mt-2 sm:mb-2">
                {post.title}
              </div>

              <div className="flex justify-start items-center w-full">
                <p className="fontSize-sm text-gray-500 mt-1 mb-1 line-clamp-1 sm:mt-0 sm:mb-0">
                  {`￥${post.price}`}
                </p>
                <div className="ml-5 mr-2 flex items-center">
                  <FaRegHeart className="text-gray-500 text-xs mr-1" />
                  <div className="text-gray-500 text-xs">
                    {post.likeUserIDs.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostListItem
