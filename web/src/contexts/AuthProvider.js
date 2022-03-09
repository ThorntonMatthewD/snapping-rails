import { createContext, useState, useEffect } from "react";
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

  let loginUser = async (data) => {
    await fetch("http://localhost:5000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setAccessToken(data["access_token"]);
            setUser(jwt_decode(data["access_token"]));
            localStorage.setItem("refreshToken", data["refresh_token"]);
            navigate(`/`);
          });
        }
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
    localStorage.removeItem("refreshToken");
    navigate(`/`);
  };

  let updateToken = async () => {
    await fetch("http://localhost:5000/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + refreshToken,
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setAccessToken(data["access_token"]);
            setUser(jwt_decode(data["access_token"]));
            localStorage.setItem("refreshToken", data["refresh_token"]);
          });
        } else {
          logoutUser();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let contextData = {
    user: user,
    accessToken: accessToken,
    refreshToken: refreshToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
    updateToken: updateToken,
  };

  useEffect(() => {
    if (refreshToken !== null) {
      updateToken();
    }

    let fiveMinutes = 1000 * 60 * 5;

    let interval = setInterval(() => {
      if (accessToken) {
        updateToken();
      }
    }, fiveMinutes);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
