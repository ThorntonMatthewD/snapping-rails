import { useState } from "react";
import dayjs from "dayjs";
import useAuth from "../hooks/useAuth";

const useFetch = (endpoint, refetchData, reqType, authRequired, body) => {
  let { accessToken, user, updateToken } = useAuth();

  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = "http://localhost:5000";

  const generateHeaders = () => {
    let reqHeaders = {
      "Content-Type": "application/json",
    };

    if (authRequired) {
      if (accessToken !== null) {
        if (dayjs.unix(user.exp).diff(dayjs()) < 1) {
          reqHeaders["Authorization"] = "Bearer " + accessToken;
        } else {
          updateToken().then(() => {
            reqHeaders["Authorization"] = "Bearer " + accessToken;
          });
        }
      } else {
        updateToken().then(() => {
          reqHeaders["Authorization"] = "Bearer " + accessToken;
        });
      }
    }

    return reqHeaders;
  };

  let reqBody = body !== null ? JSON.stringify(body) : null;

  const performRequest = (dispatch) => {
    const abortCont = new AbortController();
    setIsPending(true);

    setTimeout(() => {
      fetch(baseURL + endpoint, {
        signal: abortCont.signal,
        method: reqType,
        headers: generateHeaders(),
        body: reqBody,
      })
        .then((res) => {
          if (!res.ok) {
            // error coming back from server
            throw Error("could not fetch the data for that resource");
          }
          return res.json();
        })
        .then((data) => {
          setIsPending(false);
          setData(data);
          setError(null);
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("fetch aborted");
          } else {
            // auto catches network / connection error
            setIsPending(false);
            setError(err.message);
          }
        });
    }, 1000);

    // abort the fetch
    return () => abortCont.abort();
  };

  return { data, isPending, error, performRequest };
};

export default useFetch;
