import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "../molecules/LoginModal";

interface TITLE {
  title: string;
}

export const Layout: React.FC<TITLE> = ({ children, title = "happyhorse" }) => {
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [isOpenBottomNotification, setIsOpenBottomNotification] =
    useState(false);
  const [isOpenBottomMenu, setIsOpenBottomMenu] = useState(false);
  const [width, setWidth] = useState(null);
  const { currentUser, setCurrentUser, user, notifications, setNotifications } =
    useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);

  return (
    <div
      className={
        !(router.pathname === "/message/messages" && width < 640)
          ? "min-h-screen box-border pb-10 relative touchAction-none"
          : "min-h-screen box-border relative touchAction-none"
      }
      onClick={() => {
        setIsOpenMenu(false), setIsOpenNotification(false);
      }}
    >
      <Head>
        <title>{title}</title>
      </Head>

      {(isOpenBottomNotification || isOpenBottomMenu) && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
      {!(router.pathname === "/message/messages" && width < 640) && (
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
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
      )}

      {!currentUser && (
        <>
          <div className="hidden sm:block">
            <div className="h-12 pt-3.5 bg-mainGreen text-gray-50 text-center text-sm block">
              happy horseは、馬の売買が無料で簡単にできるプラットフォームです
            </div>
          </div>
          <div className="sm:hidden">
            <div className="h-10 pt-3.5 bg-mainGreen text-gray-50 text-center text-xs block">
              happy horseでは、馬の売買が無料で簡単にできます
            </div>
          </div>
        </>
      )}
      <LoginModal
        isLoginModalOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />
      <main className={"max-w-5xl mx-auto"}>{children}</main>
      {router.pathname !== "/message/messages" && (
        <>
          <Footer
            isOpenBottomNotification={isOpenBottomNotification}
            setIsOpenBottomNotification={setIsOpenBottomNotification}
            isOpenBottomMenu={isOpenBottomMenu}
            setIsOpenBottomMenu={setIsOpenBottomMenu}
            setIsOpenMenu={setIsOpenMenu}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            user={user}
            notifications={notifications}
            setNotifications={setNotifications}
            setIsLoginModalOpen={setIsLoginModalOpen}
          />
        </>
      )}
    </div>
  );
};
