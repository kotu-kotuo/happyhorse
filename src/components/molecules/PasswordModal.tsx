import deleteAccountData from "../../functions/deleteAccountData";
import ButtonIndigo from "../atoms/ButtonIndigo";

const PasswordModal = (props) => {
  const { setPassword, password, currentUser, router } = props;

  return (
    <div>
      <form>
        <p className="text-gray-900 text-sm text-center mb-6">
          登録しているパスワードを入力してください。
        </p>
        <input
          type="password"
          autoComplete="current-password"
          required
          className="appearance-none relative block w-full px-3 py-2 mb-6 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="パスワード"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <div>
          <div
            onClick={() => {
              deleteAccountData(currentUser, password, router);
            }}
          >
            <ButtonIndigo label={"送信する"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordModal;
