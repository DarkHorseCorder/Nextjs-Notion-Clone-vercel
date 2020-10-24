import React from "react";

// import { Facebook as FacebookIcon } from "mdi-material-ui";
// import { Github as GitHubIcon } from "mdi-material-ui";
import { Google as GoogleIcon } from "mdi-material-ui";
import { Twitter as TwitterIcon } from "mdi-material-ui";

const authProviders = [
  {
    id: "google.com",
    color: "#ea4335",
    icon: <GoogleIcon />,
    name: "Google",
  },
  {
    id: "twitter.com",
    color: "#1da1f2",
    icon: <TwitterIcon />,
    name: "Twitter",
  },
];

export default authProviders;
