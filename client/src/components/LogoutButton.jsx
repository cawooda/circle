import React from "react";
import { Button } from "@chakra-ui/react";
import {
  ButtonStyles,
  ButtonHighlightStyle,
} from "../components/styles/ButtonStyle";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/auth";

export default function LogoutButton() {
  const navigate = useNavigate();
  return (
    <Button
      {...ButtonStyles}
      onClick={() => {
        AuthService.logout();
        navigate("/login");
      }}
    >
      Logout
    </Button>
  );
}
