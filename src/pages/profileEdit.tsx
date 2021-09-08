import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { Layout } from "../components/organisms/Layout";
import { NextRouter, useRouter } from "next/router";
import { NextPage } from "next";
import editProfile from "../functions/editProfile";
import ProfileImageUpload from "../components/pages/ProfileEdit/ProfileImageUpload";
import useRedirectLogin from "../hooks/useRedirectLogin";

const profileEdit: NextPage = () => {
  const { currentUser, user, setUser } = useContext(AuthContext);
  const [image, setImage] = useState<any>("");
  const [cover, setCover] = useState<any>("");
  const [username, setUsername] = useState<string>("");
  const [profileText, setProfileText] = useState<string>("");
  const [siteURL, setSiteURL] = useState("");
  const [address, setAddress] = useState("");
  const router: NextRouter = useRouter();

  useRedirectLogin(currentUser);

  useEffect(() => {
    if (user) {
      setProfileText(user.profileText);
    }
  }, [user]);

  return (
    <Layout title="プロフィール編集 | happy horse" index="noindex">
      {currentUser && user && (
        <div className="my-20 px-2">
          <form
            className="mx-auto max-w-2xl"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              editProfile(
                e,
                username,
                profileText,
                siteURL,
                address,
                image,
                currentUser,
                cover,
                setUser,
                router
              );
            }}
          >
            {console.log(address)}
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
            <div className="mb-6">
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

            <div className="text-base sm:text-lg text-gray-700 mt-9 mb-7 border-b border-gray-700 inline-block">
              掲載者用（任意）
            </div>
            <div className="text-xs text-gray-500 mb-1 ml-1">webサイトURL</div>
            <input
              className="mb-6 rounded-md inputText"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSiteURL(e.target.value);
              }}
              defaultValue={user.siteURL}
            />
            <div className="text-xs text-gray-500 mb-1 ml-1">住所</div>
            <input
              className="mb-14 rounded-md inputText"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAddress(e.target.value);
              }}
              defaultValue={user.address}
            />
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

export default profileEdit;
