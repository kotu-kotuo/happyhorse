import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const Footer = (props) => {
  const { footerHeight, heightFooter } = props;
  const router = useRouter();

  return (
    <div>
      <footer
        className={`w-full text-center bottom-0 shadow-md absolute py-4 bg-gray-50 sm:mb-0 ${
          router.pathname === "/about" ? "mb-0" : "mb-12"
        }`}
        ref={footerHeight}
      >
        <Link href="/">
          <div className=" h-10 w-auto pr-8 sm:h-14">
            <Image
              src="/hh-logo2.png"
              className="mx-auto"
              width={192}
              height={48}
              alt="logo"
              objectFit="cover"
            />
          </div>
        </Link>
        <div className="sm:flex sm:justify-center py-4 text-gray-900">
          <Link href="/about">
            <p className="mx-4 cursor-pointer fontSize-base mb-2">
              happy horseについて
            </p>
          </Link>
          <Link href="/terms">
            <p className="mx-4 cursor-pointer fontSize-base mb-2">利用規約</p>
          </Link>
          <Link href="/privacyPolicy">
            <p className="mx-4 cursor-pointer fontSize-base mb-2">
              プライバシーポリシー
            </p>
          </Link>
          <a
            href="http://forms.gle/BFfdBksWNnexJ3pN8"
            target="_blank"
            rel="noreferrer noopener"
          >
            <p className="mx-4 cursor-pointer fontSize-base">お問い合わせ</p>
          </a>
        </div>
        <div className="pb-2 pt-1.5">©︎ happy horse</div>
      </footer>
      {heightFooter && (
        <>
          <div
            style={{
              height: heightFooter + 40,
            }}
            className="hidden sm:block"
          ></div>
          <div
            style={{
              height: heightFooter + 100,
            }}
            className="sm:hidden"
          ></div>
        </>
      )}
    </div>
  );
};

export default Footer;
