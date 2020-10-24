
const SERVER_BASE_URL = `${process.env.NEXT_PUBLIC_API}/`

const PAGES                 = 'pages/';
const PAGES_URL             = 'pages/url';
const PAGES_POSTPAGE        = "pages/postpage";
const PAGES_IMAGES          = "pages/images?pageId=";

const SAVE_BIO_TEXT         = "users/saveBioText";
const USERS_FOLLOW          = "users/follow";
const USERS_ACCOUNT         = "users/account";
const USERS_ACCOUNT_WITH_ID = "users/account?userId=";
const USERS_ACCOUNT_INBOX   = "users/account/inbox";
const USERS_LIST            = "users/getUserList";
const USERS_ACTIVATE        = "users/activate";
const USERS_LOGOUT          = "users/logout";
const GOOGLE_LOGIN          = "users/googlogin";
const RESET_TOKEN           = "users/resetToken";
const USER_LOGIN            = "users/login";
const USER_SIGNUP           = "users/signup";

const generateToken = token => ("Bearer " + token)
const generateHeader = token => token ? ({
  "Content-Type": "application/json",
        'Accept': 'application/json',
  credentials: "include",
  "Authorization": generateToken(token)
}) : ({
  "Content-Type": "application/json",
  'Accept': 'application/json',
}) 
const generateRequest = ({token, method, formData}) => {
  return formData ? ({
      method,
      headers: generateHeader(token ? token : null),
      body: formData
    }) : ({
      method: method,
      headers: generateHeader(token ? token : null),
    })
}

/*---------- APIs for pages ------------*/
export const PageInfo = (pid, token, method, formData=null) => fetch(
  SERVER_BASE_URL + PAGES + pid,
  generateRequest({token, method, formData})
);

export const GetPages = (token, method, formData = null) => fetch(
  SERVER_BASE_URL + PAGES,
  generateRequest({token, method, formData})
)

export const PagesUrl = (formData, method) => fetch(
  SERVER_BASE_URL + PAGES_URL,
  generateRequest({method, formData})
)

export const PageImgUpload = (formData, pageId) => fetch(
  SERVER_BASE_URL + PAGES_IMAGES + pageId,
  generateRequest({method:"POST", formData})
)

export const PagesPostPage = (token, formData, method) => fetch(
  SERVER_BASE_URL + PAGES_POSTPAGE,
  generateRequest({method, formData, token})
)

/*---------- APIs for users ------------*/
export const SaveBioText = (formData) => {
  return fetch(
  SERVER_BASE_URL + SAVE_BIO_TEXT,
  generateRequest({method:"POST", formData})
)}

export const UserFollow = ( formData) => fetch(
  SERVER_BASE_URL + USERS_FOLLOW,
  generateRequest({ method:"POST", formData})
)

export const GetUserList = (token) => fetch(
  SERVER_BASE_URL + USERS_LIST,
  generateRequest({token, method:"GET"})
)

export const GetUserAccount = (uid, token) => fetch(
  SERVER_BASE_URL + USERS_ACCOUNT_WITH_ID + uid,
  generateRequest({token, method:"GET"})
)

export const UserAccount = (token, method, formData = null) => fetch(
  SERVER_BASE_URL + USERS_ACCOUNT,
  formData ? generateRequest({token, method, formData}) : generateRequest({token, method})
)

export const UserAccountInbox = (token, method, formData) => fetch(
  SERVER_BASE_URL + USERS_ACCOUNT_INBOX,
  generateRequest({token, method, formData})
)

export const UsersActivate = (token, method, formData) => fetch(
  SERVER_BASE_URL + USERS_ACTIVATE,
  generateRequest({token, method, formData})
)

export const Googlogin = (method, formData) => fetch(
  SERVER_BASE_URL + GOOGLE_LOGIN,
  generateRequest({method, formData})
)

export const Login = (formData) => fetch(
  SERVER_BASE_URL + USER_LOGIN,
  generateRequest({method:"POST", formData})
)

export const Logout = (token) => fetch(
  SERVER_BASE_URL + USERS_LOGOUT,
  generateRequest({token, method:"POST"})
)

export const ResetToken = (token, formData) => fetch(
  SERVER_BASE_URL + RESET_TOKEN,
  generateRequest({token, method:"POST", formData})
)

export const UserSignUp = (method, formData) => fetch(
  SERVER_BASE_URL + USER_SIGNUP,
  generateRequest({method, formData})
)