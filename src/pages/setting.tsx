import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";
import { PageTitle } from "../components/atoms/Atoms";
import { Layout } from "../components/organisms/Layout";

const setting = () => {

  const deleteAccount = () => {
    const result = window.confirm("本当に退会しますか？")
  }
  return (
    <div>
      <Layout title="setting">
        <div className="max-w-2xl mx-auto">
          <PageTitle title="設定" />
          <ul className="mt-12">
            <div className="border-b cursor-pointer" onClick={deleteAccount}>
              <div className="px-4 py-4 hover:bg-gray-100 flex items-center">
                <p className="text-sm font-medium text-gray-800 leading-none">
                  退会する
                </p>
                <IoChevronForwardOutline className="text-gray-400 text-lg ml-auto" />
              </div>
            </div>
          </ul>
        </div>
      </Layout>
    </div>
  );
};

export default setting;
