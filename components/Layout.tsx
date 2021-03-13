import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { GoBell } from "react-icons/go";

interface TITLE {
  title: string;
}

export const Layout: React.FC<TITLE> = ({ children, title = "happyhorse" }) => {
  return (
    <div className="min-h-screen box-border pb-10 relative">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="h-16 w-full ">
        <nav className="flex items-center h-16 max-w-5xl mx-auto">
          <div className="mr-auto pt-4">
            <Image
              src="/hh-logo2.png"
              className="object-cover"
              width={250}
              height={50}

            />
          </div>
          <div className="ml-auto flex items-center">
            <Link href="/show">
              <a>show</a>
            </Link>
            <GoBell className="mx-3 text-3xl text-gray-400" />
            <Image
              src="/flowers.jpg"
              className="object-cover rounded-full"
              width={40}
              height={40}
            />
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="h-12 w-full text-center bottom-0 border-t border-gray-200 absolute">
        <div className="py-3">©︎happy horse</div>
      </footer>
    </div>
  );
};
