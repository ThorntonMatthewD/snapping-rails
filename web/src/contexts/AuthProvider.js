import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookieValue, deleteCookie } from "../util/cookies";

const AuthContext = createContext({});

export const AuthProvider = ({ children, initialUser = null }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("current_user")
      ? localStorage.getItem("current_user")
      : initialUser
  );

  let navigate = useNavigate();

  let loginUser = async (data) => {
    await fetch("http://localhost:8000/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          getLoggedInUser();
          navigate(`/`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //We have to clear out the cookies on the backend.
  let logoutUser = async (explicit_call) => {
    await fetch("http://localhost:8000/api/logout", {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookieValue("csrf_access_token"),
      },
    })
      .then(() => {
        removeUser();

        if (explicit_call) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        // Go ahead and remove user anyways upon error.
        removeUser();
      });
  };

  let updateToken = async () => {
    await fetch("http://localhost:8000/api/refresh", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookieValue("csrf_access_token"),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            getLoggedInUser();
          });
        } else {
          logoutUser();
        }
      })
      .catch((error) => {
        logoutUser();
        console.log(error);
      });
  };

  let getLoggedInUser = async () => {
    await fetch("http://localhost:8000/api/user", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookieValue("csrf_access_token"),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setUser(data.user_info);
            localStorage.setItem("current_user", data.user_info);
          });
        } else {
          logoutUser();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeUser = () => {
    deleteCookie("csrf_access_token");
    deleteCookie("access_token_cookie");

    deleteCookie("refresh_token_cookie");
    deleteCookie("csrf_refresh_token");

    setUser(null);
    localStorage.removeItem("current_user");
  };

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    updateToken: updateToken,
  };

  useEffect(() => {
    if (user) {
      updateToken();
    }

    let fiveMinutes = 1000 * 60 * 5;

    let interval = setInterval(() => {
      if (user) {
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
