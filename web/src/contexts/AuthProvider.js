import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children, initialUser = null }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("current_user")
      ? localStorage.getItem("current_user")
      : initialUser
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
    await fetch("http://localhost:5000/logout", {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(data);
            localStorage.removeItem("accessToken");
            if (explicit_call) {
              navigate("/");
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("accessToken");
      });
  };

  let updateToken = async () => {
    await fetch("http://localhost:5000/refresh", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        console.log(error);
      });
  };

  let getLoggedInUser = async () => {
    await fetch("http://localhost:5000/user", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            localStorage.setItem("current_user", data);
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
    accessToken: null,
    refreshToken: null,
    loginUser: loginUser,
    logoutUser: logoutUser,
    updateToken: updateToken,
  };

  useEffect(() => {
    //if (refreshToken !== null) {
    //updateToken();
    //}

    let fiveMinutes = 1000 * 60 * 5;

    let interval = setInterval(() => {
      //if (accessToken) {
      //updateToken();
      // }
    }, fiveMinutes);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
