import { useState, useContext } from "react";
import { useRouter } from "next/router";
import nookies from 'nookies'
import * as MyCookies from "../services/manage_cookie"
import { UserDispatchContext } from "../context/UserContext";
import Input from "../components/input";
import Notice from "../components/notice";
import * as APIService from "../services/apis"

const form = {
  id: "signup",
  inputs: [
    {
      id: "name",
      type: "text",
      label: "Name",
      required: true,
      value: "",
    },
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
    {
      id: "bio",
      type: "text",
      label: "Bio",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Sign up",
  },
};

const SignupPage = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
    try {
      const response = await APIService.UserSignUp(
        "POST", JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          bio: formData.bio,
        })
      )
      const data = await response.json();
      if (data.errCode) {
        setNotice({ type: "ERROR", message: data.message });
      } else {
        console.log(data);
        dispatch({ 
          type: "LOGIN", 
          token: data.token, 
          userName: data.userName, 
          userId: data.userId });
        MyCookies.setCookieWithPath(data, "/" + data.userId);
        setNotice({
          type: "SUCCESS",
          message:
            "Success! Check your inbox to confirm your email. You will now be redirected.",
        });
        // router.push("/" + data.userId);
      }
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  return (
    <>
      <h1 className="pageHeading">Signup</h1>
      <form id={form.id} method="post" onSubmit={handleSubmit}>
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
      </form>
      <p>Sign up to create private pages that exist forever.</p>
    </>
  );
};

export default SignupPage;
