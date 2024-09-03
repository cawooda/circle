import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/auth";

import { useParams } from "react-router-dom";

export default function UserVerify() {
  const navigate = useNavigate();
  let { authLinkNumber } = useParams();
  const handleCodeSubmit = async (code) => {
    try {
      const response = await AuthService.verifySmsCode(code);

      if (response.user) {
        navigate("/");
      } else {
        throw new Error("Invalid code");
      }
    } catch (error) {
      throw error;
    }
  };
  handleCodeSubmit(authLinkNumber);
  return <div>{authLinkNumber}</div>;
}