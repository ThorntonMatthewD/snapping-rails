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
            setUser(null);
            localStorage.removeItem("current_user");
            if (explicit_call) {
              navigate("/");
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
        localStorage.removeItem("current_user");
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
