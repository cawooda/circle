import React from "react";

import AuthService from "../utils/auth";

import { useParams } from "react-router-dom";

export default function AuthReset() {
  let { authLinkNumber } = useParams();
  return <div></div>;
}
