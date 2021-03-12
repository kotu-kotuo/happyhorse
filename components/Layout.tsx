import Head from "next/head";
import Link from "next/link";

interface TITLE {
  title: string;
}

const Layout: React.FC<TITLE> = ({ children, title = "home" }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        header
        <Link href="/index-page">
          <a>index</a>
        </Link>
        <Link href="/show-page">
          <a>show</a>
        </Link>
      </header>
      <main>{children}</main>
      <footer>footer</footer>
    </div>
  );
};

export default Layout;
