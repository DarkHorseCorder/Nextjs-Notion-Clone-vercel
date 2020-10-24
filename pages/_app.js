import App from "next/app";
import UserProvider from "../context/UserContext";
import Layout from "../components/layout";
import 'bootstrap/dist/css/bootstrap.css'
import "typeface-nunito-sans";
import "typeface-roboto";
import "../shared/global.scss";

const MyApp = ({ Component, pageProps}) => {
  return (
    <UserProvider >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
};

MyApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context);
  return { ...appProps};
};

export default MyApp;
