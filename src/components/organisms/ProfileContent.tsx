import StarRatings from "react-star-ratings";
import Link from "next/link";

const ProfileContent = (props) => {
  const { user, currentUser } = props;

  return (
    <div>
      {user && currentUser && (
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
              {user.id === currentUser.uid && (
                <Link href="/profile-edit">
                  <a className="absolute bottom-0 right-10 border border-mainGreen rounded-md px-4 py-2 bg-white text-mainGreen ml-auto hover:bg-mainGreen hover:text-white ease-in-out duration-300">
                    編集
                  </a>
                </Link>
              )}
            </div>
            <div className="text-gray-900 font-semibold text-xl mt-3 mb-1 sm:mt-6 px-2 text-center">{`${user.username}`}</div>

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

            <div className="text-gray-900 sm:text-base text-sm mt-7 px-2 max-w-2xl mx-auto whitespace-pre-wrap">{`${user.profileText}`}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
