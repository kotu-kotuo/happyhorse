import { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";

interface TITLE {
  title: string;
}

export const Layout: React.FC<TITLE> = ({ children, title = "happyhorse" }) => {
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [isOpenBottomNotification, setIsOpenBottomNotification] = useState(
    false
  );
  const [isOpenBottomMenu, setisOpenBottomMenu] = useState(false);
  const {
    currentUser,
    setCurrentUser,
    user,
    notifications,
    setNotifications,
  } = useContext(AuthContext);

  return (
    <div
      className="min-h-screen box-border pb-10 relative touchAction-none"
      onClick={() => {
        setIsOpenMenu(false), setIsOpenNotification(false);
      }}
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isOpenBottomNotification && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}

      <Header
        user={user}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isOpenMenu={isOpenMenu}
        setIsOpenMenu={setIsOpenMenu}
        notifications={notifications}
        setNotifications={setNotifications}
        isOpenNotification={isOpenNotification}
        setIsOpenNotification={setIsOpenNotification}
      />

      {!currentUser && (
        <div className="h-12 pt-3.5 bg-mainGreen text-gray-50 text-center text-sm block">
          happy horseは、馬の売買が無料で簡単にできるプラットフォームです
        </div>
      )}

      <main className={"max-w-5xl mx-auto"}>{children}</main>
      {router.pathname !== "/message/messages" && (
        <>
          <Footer
            isOpenBottomNotification={isOpenBottomNotification}
            setIsOpenBottomNotification={setIsOpenBottomNotification}
            isOpenBottomMenu={isOpenBottomMenu}
            setisOpenBottomMenu={setisOpenBottomMenu}
            currentUser={currentUser}
            user={user}
            notifications={notifications}
          />
        </>
      )}
    </div>
  );
};
