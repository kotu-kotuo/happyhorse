import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { useRouter } from "next/router";
import { NextPage } from "next";
import editProfile from "../functions/editProfile";
import ProfileImageUpload from "components/pages/profileEdit/ProfileImageUpload";


const ProfileEdit: NextPage = () => {
  const { currentUser, user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState<any>("");
  const [cover, setCover] = useState<any>("");
  const [username, setUsername] = useState<string>("");
  const [profileText, setProfileText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setProfileText(user.profileText);
    }
  }, [user]);

  return (
    <Layout title="プロフィール編集">
      {currentUser && user && (
        <div className="my-20 px-2">
          <form
            className="mx-auto max-w-2xl"
            onSubmit={(e) => {
              editProfile(
                e,
                username,
                profileText,
                image,
                currentUser,
                cover,
                setUser,
                router
              );
            }}
          >
            <ProfileImageUpload
              image={image}
              setImage={setImage}
              label={"アバター画像"}
              src={user.avatar}
              rounded={"rounded-full"}
            />
            <ProfileImageUpload
              image={cover}
              setImage={setCover}
              label={"カバー画像"}
              src={user.cover}
              rounded={"rounded"}
            />
            <div className="text-xs text-gray-500 mb-1 ml-1">
              ユーザネーム(20字以内)
            </div>
            <input
              className="mb-6 rounded-md inputText"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
              defaultValue={user.username}
            />
            <div className="text-xs text-gray-500 mb-1 ml-1">
              プロフィール文
            </div>
            <div className="mb-7">
              <textarea
                className="h-40 rounded-md inputText"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setProfileText(e.target.value);
                }}
                defaultValue={user.profileText}
              />
              <div className="text-xs text-gray-500 text-right">
                {`${profileText.length}` + "/4000"}
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="buttonGreen">
                更新する
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default ProfileEdit;
