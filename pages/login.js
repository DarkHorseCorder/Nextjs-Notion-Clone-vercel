import { useState, useContext } from "react";
import { useRouter } from "next/router";

import { UserDispatchContext } from "../context/UserContext";
import Notice from "../components/notice";
import Input from "../components/input";
import { useGoogleLogin } from 'react-google-login';
import TwitterLogin from "react-twitter-login";
import { Box, ButtonGroup, Button } from "@material-ui/core"
import { Google as GoogleIcon } from "mdi-material-ui";
import * as MyCookies from "../services/manage_cookie"
import * as APIService from "../services/apis"

const form = {
  id: "login",
  inputs: [
    {
      id: "email",
      type: "email",
      label: "E-Mail Address",
      required: true,
      value: "",
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Login",
  },
  button: {
    type: "button",
    label: "Forgot password ?",
  },
};

const twitterHandler = (err, data) => {
  console.log(err, data);
};

const LoginPage = () => {
  const RESET_NOTICE = { type: "", message: "" };
  const [notice, setNotice] = useState(RESET_NOTICE);
  const dispatch = useContext(UserDispatchContext);
  const router = useRouter();

  const values = {};
  form.inputs.forEach((input) => (values[input.id] = input.value));
  const [formData, setFormData] = useState(values);

  const handleInputChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENTID;

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  const onSuccess = async res => {
    const response = await APIService.Googlogin("POST",JSON.stringify({
      email: res.profileObj.email,
      uid: res.profileObj.googleId,
      name: res.profileObj.name
    }) )
    const data = await response.json();

    if (data.errCode) {
      setNotice({ type: "ERROR", message: data.message });
    } else {
      dispatch({ 
        type: "LOGIN", 
        token: data.token,
        userName: data.userName,
        userId: data.userId });
      MyCookies.setCookieWithPath(data, "/" + data.userId);

      router.push("/" + data.userId); //redirect to [user_id] page
    }
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'offline',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
   
    try {
      const response = await APIService.Login(JSON.stringify({
        email: formData.email,
        password: formData.password,
      }) )
      
      const data = await response.json();
      if (data.errCode) {
        setNotice({ type: "ERROR", message: data.message });
      } else {
        dispatch({ 
          type: "LOGIN", 
          token: data.token,
          userId: data.userId, 
          userName: data.userName });
        MyCookies.setCookieWithPath(data, "/" + data.userId);
        router.push("/" + data.userId);
      }
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    router.push("/forgotPassword");
  };

  return (
    <div className="container text-center">
      <h1 className="pageHeading">Login</h1>
      <form id={form.id} onSubmit={handleSubmit}>
        {form.inputs.map((input, key) => {
          return (
            <Input
              key={key}
              formId={form.id}
              id={input.id}
              type={input.type}
              label={input.label}
              required={input.required}
              value={formData[input.id]}
              setValue={(value) => handleInputChange(input.id, value)}
            />
          );
        })}
        {notice.message && (
          <Notice status={notice.type} mini>
            {notice.message}
          </Notice>
        )}
        <button type={form.submitButton.type}>{form.submitButton.label}</button>
        <button type={form.button.type} onClick={handlePasswordReset}>
          {form.button.label}
        </button>
      </form>

      <div>
        <div className="social m-3">
          <ButtonGroup
            halfwidth="true"
            orientation="vertical"
            variant="outlined"
          >
            <Button
              key={"google.com"}
              startIcon={<GoogleIcon/>}
              onClick={signIn}
            >
              {"Sign in with Google"}
            </Button>
          </ButtonGroup>
        </div>

        <div className="social m-3">
          <TwitterLogin
            authCallback={twitterHandler}
            consumerKey={"CONSUMER_KEY"}
            consumerSecret={"CONSUMER_SECRET"}
          />
        </div>
      </div>
      <p>
        Don't have an account yet?{" "}
        <a href="/signup" rel="noreferrer noopener">
          <strong>Sign up here.</strong>
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
