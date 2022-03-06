import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  let [accessToken, setAccessToken] = useState(null);
  let [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
      ? localStorage.getItem("refreshToken")
      : null
  );
  let [user, setUser] = useState(() =>
    accessToken ? jwt_decode(accessToken) : null
  );

  let navigate = useNavigate();

  let loginUser = (data) => {
    console.log(data);
    fetch("http://localhost:5000/token", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refresh_token);
        navigate(`/`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let logoutUser = () => {
    setAccessToken(null);

    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    navigate(`/`);
  };

  let contextData = {
    user: user,
    accessToken: accessToken,
    refreshToken: refreshToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
