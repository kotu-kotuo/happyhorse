import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "./Header";
import LoginModal from "../molecules/LoginModal";
import MobileMenuBar from "./MobileMenuBar";
import Footer from "./Footer";
import Meta from "../Meta";

type Props = {
  title: string;
  ogpURL?: string;
  description?: string;
  ogpImage?: string;
  index?: string;
};

export const Layout: React.FC<Props> = (props) => {
  const {
    children,
    title = "happy horse | 馬の売買プラットフォーム",
    ogpURL = "https://www.happyhorse.xyz/",
    description = "happy horse（ハッピーホース）では、主に乗馬・馬術、レクレーションの馬の売買ができます。馬の販売・購入をより便利に、より手軽に。素敵な出会いがありますように。HAPPY UMA LIFE! サラブレッドなどの品種や値段で検索可能。",
    ogpImage = "https://firebasestorage.googleapis.com/v0/b/happyhorse-prod.appspot.com/o/ogp-hh.png?alt=media&token=6a8c8771-2193-40a4-8f6b-920544654e05",
    index = "all",
  } = props;
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
  const footerHeight = useRef(null);
  const [heightFooter, setHeightFooter] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (footerHeight) {
      setHeightFooter(footerHeight.current?.clientHeight);
    }
  }, [footerHeight]);

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
      <Meta
        title={title}
        ogpURL={ogpURL}
        description={description}
        ogpImage={ogpImage}
        index={index}
      />

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
              <span className="border-b">
                <Link href="/about">happy horse</Link>
              </span>
              は、馬の売買が無料で簡単にできるプラットフォームです
            </div>
          </div>
          <div className="sm:hidden">
            <div className="h-10 pt-3.5 bg-mainGreen text-gray-50 text-center text-xs block">
              <span className="border-b">
                <Link href="/about">happy horse</Link>
              </span>
              では、馬の売買が無料で簡単にできます
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
          <MobileMenuBar
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

      {router.pathname !== "/" &&
        router.pathname !== "/login" &&
        router.pathname !== "/signup" &&
        router.pathname !== "/post/post" &&
        router.pathname !== "/post/draft" &&
        router.pathname !== "/post/postEdit/[pid]" &&
        router.pathname !== "/message/messages" &&
        router.pathname !== "/404" && (
          <Footer footerHeight={footerHeight} heightFooter={heightFooter} />
        )}
    </div>
  );
};
