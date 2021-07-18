import Link from "next/link";

const Footer = (props) => {
  const { footerHeight } = props;

  return (
    <div>
      <footer
        className="w-full text-center bottom-0 shadow-md absolute py-4 bg-gray-50 mb-14 sm:mb-0"
        ref={footerHeight}
      >
        <img
          src="/hh-logo2.png"
          className="mx-auto object-cover h-10 w-auto pr-8 sm:h-14"
        />
        <div className="sm:flex sm:justify-center py-4 text-gray-900 space-y-2 sm:space-y-0">
          <Link href="/terms">
            <p className="mx-4 cursor-pointer fontSize-base">利用規約</p>
          </Link>
          <Link href="/privacyPolicy">
            <p className="mx-4 cursor-pointer fontSize-base">
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
      <div
        style={{
          height: footerHeight.current?.getBoundingClientRect().height + 40,
        }}
      ></div>
      {console.log(footerHeight.current?.getBoundingClientRect().height)}
    </div>
  );
};

export default Footer;
