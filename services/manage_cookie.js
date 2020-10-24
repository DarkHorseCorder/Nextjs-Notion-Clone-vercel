import { parseCookies, setCookie, destroyCookie } from 'nookies'

const cookieConfig = path => ({
  httpOnly: false,
  maxAge: 30 * 24 * 60 * 60,
  path,
})

export const ClearCookies = (userId) => {
  destroyCookie(null, 'token', cookieConfig("/"));
  destroyCookie(null, 'userId', cookieConfig("/"));
  destroyCookie(null, 'userName', cookieConfig("/"));

  
  destroyCookie(null, 'token', cookieConfig("/" + userId));
  destroyCookie(null, 'userId', cookieConfig("/" + userId));
  destroyCookie(null, 'userName', cookieConfig("/" + userId));

  destroyCookie(null, 'token', cookieConfig("/" + userId + "/notes"));
  destroyCookie(null, 'userId', cookieConfig("/" + userId + "/notes"));
  destroyCookie(null, 'userName', cookieConfig("/" + userId + "/notes"));

  destroyCookie(null, 'token', cookieConfig("/user/" + userId));
  destroyCookie(null, 'userId', cookieConfig("/user/" + userId));
  destroyCookie(null, 'userName', cookieConfig("/user/" + userId));

  destroyCookie(null, 'token', cookieConfig("/" + userId + "/rlists"));
  destroyCookie(null, 'userId', cookieConfig("/" + userId + "/rlists"));
  destroyCookie(null, 'userName', cookieConfig("/" + userId + "/rlists"));

  destroyCookie(null, 'token', cookieConfig("/account"));
  destroyCookie(null, 'userId', cookieConfig("/account"));
  destroyCookie(null, 'userName', cookieConfig("/account"));

  destroyCookie(null, 'token', cookieConfig("/activateAccount"));
  destroyCookie(null, 'userId', cookieConfig("/activateAccount"));
  destroyCookie(null, 'userName', cookieConfig("/activateAccount"));

  destroyCookie(null, 'token', cookieConfig("/forgotPassword"));
  destroyCookie(null, 'userId', cookieConfig("/forgotPassword"));
  destroyCookie(null, 'userName', cookieConfig("/forgotPassword"));

  destroyCookie(null, 'token', cookieConfig("/login"));
  destroyCookie(null, 'userId', cookieConfig("/login"));
  destroyCookie(null, 'userName', cookieConfig("/login"));

  destroyCookie(null, 'token', cookieConfig("/pages"));
  destroyCookie(null, 'userId', cookieConfig("/pages"));
  destroyCookie(null, 'userName', cookieConfig("/pages"));

  destroyCookie(null, 'token', cookieConfig("/pages2"));
  destroyCookie(null, 'userId', cookieConfig("/pages2"));
  destroyCookie(null, 'userName', cookieConfig("/pages2"));

  destroyCookie(null, 'token', cookieConfig("/signup"));
  destroyCookie(null, 'userId', cookieConfig("/signup"));
  destroyCookie(null, 'userName', cookieConfig("/signup"));

  destroyCookie(null, 'token', cookieConfig("/users"));
  destroyCookie(null, 'userId', cookieConfig("/users"));
  destroyCookie(null, 'userName', cookieConfig("/users"));

  destroyCookie(null, 'token', cookieConfig("/resetPassword"));
  destroyCookie(null, 'userId', cookieConfig("/resetPassword"));
  destroyCookie(null, 'userName', cookieConfig("/resetPassword"));
}

export const setCookiePAge = (data, pId) => {
  setCookie(null, 'token', data.token, cookieConfig("/p/" + pId));
  setCookie(null, 'userId', data.userId, cookieConfig("/p/" + pId));
  setCookie(null, 'userName', data.userName, cookieConfig("/p/" + pId));
}

export const setCookieWithPath = (data, userId) => {
  setCookie(null, 'token', data.token, cookieConfig("/"));
  setCookie(null, 'userId', data.userId, cookieConfig("/"));
  setCookie(null, 'userName', data.userName, cookieConfig("/"));

  setCookie(null, 'token', data.token, cookieConfig("/" + userId));
  setCookie(null, 'userId', data.userId, cookieConfig("/" + userId));
  setCookie(null, 'userName', data.userName, cookieConfig("/" + userId));

  setCookie(null, 'token', data.token, cookieConfig("/" + userId + "/notes"));
  setCookie(null, 'userId', data.userId, cookieConfig("/" + userId + "/notes"));
  setCookie(null, 'userName', data.userName, cookieConfig("/" + userId + "/notes"));

  setCookie(null, 'token', data.token, cookieConfig("/user/" + userId));
  setCookie(null, 'userId', data.userId, cookieConfig("/user/" + userId));
  setCookie(null, 'userName', data.userName, cookieConfig("/user/" + userId));

  setCookie(null, 'token', data.token, cookieConfig("/" + userId + "/rlists"));
  setCookie(null, 'userId', data.userId, cookieConfig("/" + userId + "/rlists"));
  setCookie(null, 'userName', data.userName, cookieConfig("/" + userId + "/rlists"));

  setCookie(null, 'token', data.token, cookieConfig("/account"));
  setCookie(null, 'userId', data.userId, cookieConfig("/account"));
  setCookie(null, 'userName', data.userName, cookieConfig("/account"));

  setCookie(null, 'token', data.token, cookieConfig("/activateAccount"));
  setCookie(null, 'userId', data.userId, cookieConfig("/activateAccount"));
  setCookie(null, 'userName', data.userName, cookieConfig("/activateAccount"));

  setCookie(null, 'token', data.token, cookieConfig("/forgotPassword"));
  setCookie(null, 'userId', data.userId, cookieConfig("/forgotPassword"));
  setCookie(null, 'userName', data.userName, cookieConfig("/forgotPassword"));

  setCookie(null, 'token', data.token, cookieConfig("/login"));
  setCookie(null, 'userId', data.userId, cookieConfig("/login"));
  setCookie(null, 'userName', data.userName, cookieConfig("/login"));

  setCookie(null, 'token', data.token, cookieConfig("/pages"));
  setCookie(null, 'userId', data.userId, cookieConfig("/pages"));
  setCookie(null, 'userName', data.userName, cookieConfig("/pages"));

  setCookie(null, 'token', data.token, cookieConfig("/pages2"));
  setCookie(null, 'userId', data.userId, cookieConfig("/pages2"));
  setCookie(null, 'userName', data.userName, cookieConfig("/pages2"));

  setCookie(null, 'token', data.token, cookieConfig("/signup"));
  setCookie(null, 'userId', data.userId, cookieConfig("/signup"));
  setCookie(null, 'userName', data.userName, cookieConfig("/signup"));

  setCookie(null, 'token', data.token, cookieConfig("/users"));
  setCookie(null, 'userId', data.userId, cookieConfig("/users"));
  setCookie(null, 'userName', data.userName, cookieConfig("/users"));

  setCookie(null, 'token', data.token, cookieConfig("/resetPassword"));
  setCookie(null, 'userId', data.userId, cookieConfig("/resetPassword"));
  setCookie(null, 'userName', data.userName, cookieConfig("/resetPassword"));
}