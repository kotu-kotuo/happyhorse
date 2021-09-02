import StarRatings from "react-star-ratings";
import Link from "next/link";
import { User } from "../../../types/types";
import { FC } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import { FaLink, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

type Props = {
  user: User;
  currentUser;
};

const ProfileContent: FC<Props> = (props) => {
  const { user, currentUser } = props;

  const defaultCenter = { lat: user?.location?.lat, lng: user?.location?.lng };
  const defaultOptions = { scrollwheel: false };
  const RegularMap = withScriptjs(
    withGoogleMap((props: any) => (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={defaultCenter}
        defaultOptions={defaultOptions}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    ))
  );
  const loadingElementStyle = { height: "100%" };
  const containerElementStyle = { height: "300px" };
  const mapElementStyle = { height: "100%" };

  return (
    <div>
      {user && (
        <div className="mb-32">
          <img
            src={user.cover}
            className="sm:w-full sm:min-h-[320px] sm:h-80 h-40 w-screen object-cover sm:rounded-b-3xl"
            width={1024}
            height={320}
            alt="cover"
          />
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center relative">
              <div className="sm:h-32 sm:w-32 h-20 w-20 sm:-mt-16 -mt-10 border-2 border-white rounded-full">
                {user.avatar && (
                  <Image
                    className="rounded-full"
                    src={user.avatar}
                    alt="avatar"
                    width={128}
                    height={128}
                    objectFit="cover"
                  />
                )}
              </div>
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

            <div className="text-gray-900 sm:text-base text-sm mt-7 px-4 max-w-2xl mx-auto whitespace-pre-wrap sm:mt-10">{`${user.profileText}`}</div>
            <div className=" px-4 max-w-2xl mx-auto">
              {user.siteURL && (
                <div className="flex items-center my-10 sm:my-12">
                  <FaLink className="text-2xl text-gray-500 min-w-[20px]" />
                  <a
                    href={user.siteURL}
                    className="text-blue-500 border-b border-blue-500 cursor-pointer hover:opacity-80 ml-4 line-clamp-1 fontSize-base"
                    target="_blank"
                  >
                    {user.siteURL}
                  </a>
                </div>
              )}
              {user.address && (
                <div className="flex items-center my-10 sm:my-12 -ml-1">
                  <FaMapMarkerAlt className="text-2xl text-gray-500 min-w-[20px] ml-0.5" />
                  <div className="ml-4 fontSize-base">{user.address}</div>
                </div>
              )}
            </div>
          </div>
          {user.address && (
            <div className="mt-10 w-full h-48 sm:h-60">
              <RegularMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
                loadingElement={<div style={loadingElementStyle} />}
                containerElement={<div style={containerElementStyle} />}
                mapElement={<div style={mapElementStyle} />}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
