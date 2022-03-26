export const getCookie = (cookie_name) => {
  return document.cookie.match("(^|;)\\s*" + cookie_name + "\\s*=\\s*([^;]+)");
};

export const getCookieValue = (cookie_name) => {
  return getCookie(cookie_name)
    .toString()
    .split("=")
    .pop() // cookie_name = value,,value
    .split(",,")
    .pop(); // now it's just 'value'
};

export const deleteCookie = (cookie_name) => {
  document.cookie = cookie_name + "=; Max-Age=0";
};
