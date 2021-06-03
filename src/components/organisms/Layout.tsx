import { useState, useContext, useEffect } from "react";
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
  const [isOpenBottomMenu, setIsOpenBottomMenu] = useState(false);
  const [width, setWidth] = useState(null);
  const {
    currentUser,
    setCurrentUser,
    user,
    notifications,
    setNotifications,
  } = useContext(AuthContext);

  useEffect(() => {
    if (process.browser) {
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
        <link rel="icon" href="/favicon.ico" />
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
          />
        </>
      )}
    </div>
  );
};
