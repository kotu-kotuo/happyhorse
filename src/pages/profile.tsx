import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

const Profile = () => {
  const { currentUser, user } = useContext(AuthContext);
  const router = useRouter();

  return (
    <Layout title="profile">
      <div className="mb-32">
        <img
          className="sm:w-full sm:h-80 h-40 w-screen object-cover sm:rounded-b-3xl"
          src={user.cover}
          alt="cover"
        />
        <div className="max-w-3xl mx-auto">
          {currentUser && (
            <div className="flex flex-end mt-4 mr-6 ">
              <Link href="/profile-edit">
                <a className="border border-mainGreen rounded-md px-4 py-2 bg-white text-mainGreen ml-auto hover:bg-mainGreen hover:text-white ease-in-out duration-300">
                  編集
                </a>
              </Link>
            </div>
          )}

          <div className="flex justify-center">
            <img
              className="rounded-full object-cover sm:h-32 sm:w-32 h-20 w-20 border-2 border-white sm:-mt-32 -mt-24"
              src={user.avatar}
              alt="avatar"
            />
          </div>
          <div className="text-gray-900 font-semibold text-xl mt-3 sm:mt-6 px-2 text-center">{`${user.username}`}</div>

          <div className="text-gray-900 sm:text-base text-sm mt-7 px-2 max-w-2xl mx-auto whitespace-pre-wrap">{`${user.profileText}`}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
