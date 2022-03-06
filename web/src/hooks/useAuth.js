import { useContext, useDebugValue } from "react";
import AuthContext from "../contexts/AuthProvider";

const useAuth = () => {
  const { accessToken } = useContext(AuthContext);
  useDebugValue(accessToken, (accessToken) =>
    accessToken?.user ? "Logged In" : "Logged Out"
  );
  return useContext(AuthContext);
};

export default useAuth;
