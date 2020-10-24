import Notice from "../components/notice";
import * as APIService from "../services/apis"

const ActivateAccountPage = ({ activated, message }) => {
  const noticeType = activated ? "SUCCESS" : "ERROR";

  return (
    <>
      <h1 className="pageHeading">Activate Account</h1>
      <Notice status={noticeType}>{message}</Notice>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const myCookies = nookies.get(context)
  const { token } = myCookies;
  try {
    const activationToken = context.query.token;
    if (!activationToken) {
      throw new Error("Missing activation code.");
    }

    const response = await APIService.UsersActivate(token, "POST", JSON.stringify({
      activationToken: activationToken,
    }))
    const data = await response.json();

    if (data.errCode) {
      throw new Error(data.message);
    } else {
      return { props: { activated: true, message: data.message } };
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        activated: false,
        message: err.message || "The activation process failed.",
      },
    };
  }
};

export default ActivateAccountPage;
