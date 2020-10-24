import styles from "./styles.module.scss";
import Button from "../button";
import ContextMenu from "../contextMenu";
import UserIcon from "../../images/user.svg";
import { useGoogleLogout } from 'react-google-login';
import { parseCookies, destroyCookie} from 'nookies'
import { useContext, useState } from "react";
import { UserDispatchContext, UserStateContext } from "../../context/UserContext";
import { useRouter } from "next/router";
import * as APIService from "../../services/apis";
import * as MyCookies from "../../services/manage_cookie";

const Header = ({isLoginPage, isContextMenuOpen, toggleContextMenu, handleNavigation, closeContextMenu}) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENTID;
  const dispatch = useContext(UserDispatchContext);
  // const {token, userName} = useContext(UserStateContext);
  const {token, userName, userId} = parseCookies();
  const [hUserName] = useState(userName);
  const [hToken] = useState(token);
  const [hUserId] = useState(userId);
  console.log("Header: ", userName);
  const router = useRouter();

  const onFailure = () => {
    console.log('Handle failure cases');
    router.push("/login");
  };
 
  const onLogoutSuccess = (res) => {
    router.push("/login");
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  const logout = async () => {
    try{
      console.log("logout started")
      await APIService.Logout(hToken);

      MyCookies.ClearCookies(hUserId);

      // dispatch({ type: "LOGOUT"});
      const auth2 = window.gapi.auth2.getAuthInstance()
      if (auth2 != null) {
        console.log("google logout");
        auth2.signOut().then(
          auth2.disconnect().then(onLogoutSuccess)
        )
      }
      signOut();
      console.log("logout ended")

      // signOut();
    } catch ( err) {
      console.log("LOGOUT ERROR", err)
    }
  }
  const navigateAccount = () => handleNavigation("/account")
  const navigatePages = () => handleNavigation("/pages")
  return (
    <header className={styles.headerBar}>
      <div className={styles.logo}>
        <a href="/users" role="link" tabIndex="0">
          Read<span style={{ fontSize: "1.25rem" }}>with</span>me
        </a>
      </div>
      <nav className={styles.nav}>
        {!isLoginPage && <> 
          {hToken ? 
            <div>
              <div className={styles.user}>
                <p>{hUserName}</p>
                <span
                  role="button"
                  tabIndex="0"
                  onClick={toggleContextMenu}
                >
                  <img src={UserIcon} alt="User Icon" />
                </span>
              </div>
              {isContextMenuOpen && <ContextMenu
                menuItems={[
                  {
                    id: "pages",
                    label: "Profile",
                    action: navigatePages
                  },
                  {
                    id: "account",
                    label: "Account Settings",
                    action: navigateAccount
                  },
                  {
                    id: "signout",
                    label: "Logout",
                    action: () => logout(),
                  },
                ]}
                closeAction={closeContextMenu}
                isTopNavigation={true}
              />}
            </div> 
            : <Button href="/login">Login</Button>}
        </>}
      </nav>
    </header>
  );
};

export default Header;