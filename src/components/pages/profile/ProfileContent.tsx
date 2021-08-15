import StarRatings from "react-star-ratings";
import Link from "next/link";
import { User } from "../../../types/types";
import { FC } from "react";

type Props = {
  user: User;
  currentUser;
};

const ProfileContent: FC<Props> = (props) => {
  const { user, currentUser } = props;

  return (
    <div>
      {user && (
        <div className="mb-32">
          <img
            className="sm:w-full sm:h-80 h-40 w-screen object-cover sm:rounded-b-3xl"
            src={user.cover}
            alt="cover"
          />
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center relative">
              <img
                className="rounded-full object-cover sm:h-32 sm:w-32 h-20 w-20 border-2 border-white sm:-mt-16 -mt-10"
                src={user.avatar}
                alt="avatar"
              />
              {user.id === currentUser?.uid && (
                <Link href="/profileEdit">
                  <a className="absolute bottom-0 right-7 border border-mainGreen rounded-md px-3 py-1 bg-white text-mainGreen ml-auto hover:bg-mainGreen hover:text-white ease-in-out duration-300 sm:px-4 sm:py-2 sm:right-10">
                    編集
                  </a>
                </Link>
              )}
            </div>
            <div className="text-base text-gray-900 font-bold sm:font-semibold mt-3 mb-1 sm:mt-6 px-2 text-center sm:text-lg">{`${user.username}`}</div>

            <Link
              href={{
                pathname: "/reviews",
                query: {
                  uid: user.id,
                },
              }}
            >
              <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                <div>
                  <StarRatings
                    numberOfStars={5}
                    rating={
                      (user.good * 5 + user.bad * 1) / (user.good + user.bad) ||
                      0
                    }
                    starRatedColor="#FFD400"
                    name="rating"
                    starDimension="16px"
                    starSpacing="0px"
                  />
                </div>
                <a className="text-gray-500 reviewNumbersSize border-b border-gray-500  ml-1 pt-1">
                  {user.good + user.bad}
                </a>
              </div>
            </Link>

            <div className="text-gray-900 sm:text-base text-sm mt-7 px-4 max-w-2xl mx-auto whitespace-pre-wrap">{`${user.profileText}`}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
