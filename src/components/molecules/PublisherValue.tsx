import Link from "next/link";
import StarRatings from "react-star-ratings";

const PublisherValue = (props) => {
  const { post, postUser } = props;
  return post.deletedAccount === true ? (
    <div className="flex items-center">
      <div className="mr-2">
        <img
          src={post.avatar}
          className="min-w-10 min-h-10 w-10 h-10 object-cover rounded-full block"
        ></img>
      </div>
      <div>
        <div>{post.username}</div>
        <div className="-mt-0.5">
          <StarRatings
            numberOfStars={5}
            rating={
              (postUser.good * 5 + postUser.bad * 1) /
                (postUser.good + postUser.bad) || 0
            }
            starRatedColor="#FFD400"
            name="rating"
            starDimension="16px"
            starSpacing="0px"
          />
          <a className="fontSize-sm text-gray-500 reviewNumbersSize border-b border-gray-500 ml-1 pt-1 font-normal">
            {postUser.good + postUser.bad}
          </a>
        </div>
      </div>
    </div>
  ) : (
    <Link
      href={{
        pathname: "/profile",
        query: { uid: postUser.id },
      }}
    >
      <div className="flex items-center cursor-pointer">
        <div className="mr-2">
          <img
            src={post.avatar}
            className="min-w-10 min-h-10 w-10 h-10 object-cover rounded-full block"
          ></img>
        </div>
        <div>
          <div>{post.username}</div>
          <div className="-mt-0.5">
            <StarRatings
              numberOfStars={5}
              rating={
                (postUser.good * 5 + postUser.bad * 1) /
                  (postUser.good + postUser.bad) || 0
              }
              starRatedColor="#FFD400"
              name="rating"
              starDimension="16px"
              starSpacing="0px"
            />
            <a className="fontSize-sm text-gray-500 reviewNumbersSize border-b border-gray-500 ml-1 pt-1 font-normal">
              {postUser.good + postUser.bad}
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublisherValue;
