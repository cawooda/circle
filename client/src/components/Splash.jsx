import { Container, Image } from "@chakra-ui/react";
import React from "react";
import logo from "/logo.png";
import "./spinner.css";

export default function Splash() {
  return (
    <Container>
      <img src={logo} alt="Loading..." className="pendulum" />
    </Container>
  );
}
