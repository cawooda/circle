import { Container, Image } from "@chakra-ui/react";
import React from "react";
import logo from "/logo.png";
import "./spinner.css";

export default function Splash() {
  return (
    <Container className="pendulum">
      <img src={logo} width="20px" alt="Loading..." />
    </Container>
  );
}
