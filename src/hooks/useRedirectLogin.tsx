import { useEffect } from "react";
import { useRouter } from "next/router";

const useRedirectLogin = (currentUser) => {
  const router = useRouter();
  useEffect(() => {
    if (currentUser === undefined) return;
    if (currentUser === null) router.push("/login");
  }, [currentUser]);
};

export default useRedirectLogin;
