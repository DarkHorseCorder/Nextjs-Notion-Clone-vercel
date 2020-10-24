import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { UserStateContext } from "../../context/UserContext";

import styles from "./styles.module.scss";
import GithubIcon from "../../images/github.svg";
import Header from "../header";

const Layout = ({ children }) => {
  const router = useRouter();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isLoginPage] = useState(router.pathname === "/login")

  const toggleContextMenu = () => {
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };

  const handleNavigation = (path) => {
    closeContextMenu();
    router.push(path);
  };

  return (
    <div id="layoutRoot">
      <Head>
        <title>Read with me</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <Header 
          isLoginPage={isLoginPage}
          isContextMenuOpen={isContextMenuOpen}
          toggleContextMenu={toggleContextMenu} 
          handleNavigation={handleNavigation} 
          closeContextMenu={closeContextMenu}/>
      <main className={styles.content}>{children}</main>
      <footer className={styles.footerBar}>
        <hr className={styles.hr} />
        <div className={styles.github}>
          <a
            href="https://github.com/sayemmh"
            rel="noopener noreferrer"
            role="link"
            tabIndex="0"
          >
            <img src={GithubIcon} alt="Github Icon" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
