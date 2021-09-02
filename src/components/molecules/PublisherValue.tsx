import Link from "next/link";
import { FC } from "react";
import StarRatings from "react-star-ratings";
import { Post, User } from "../../types/types";
import Image from "next/image";

type Props = {
  post: Post;
  postUser: User;
};

const PublisherValue: FC<Props> = (props) => {
  const { post, postUser } = props;
  return (
    <div>
      {postUser && post && (
        <div>
          {post.deletedAccount === true ? (
            <div className="flex items-center">
              <div className="mr-2">
                <div className="w-10 h-10">
                  {post.avatar && (
                    <Image
                      src={post.avatar}
                      className="rounded-full block"
                      width={40}
                      height={40}
                      alt="avatar"
                      objectFit="cover"
                    />
                  )}
                </div>
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
                  <div className="w-10 h-10">
                    {post.avatar && (
                      <Image
                        src={post.avatar}
                        className="rounded-full block"
                        width={40}
                        height={40}
                        alt="avatar"
                        objectFit="cover"
                      />
                    )}
                  </div>
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
          )}
        </div>
      )}
    </div>
  );
};

export default PublisherValue;
