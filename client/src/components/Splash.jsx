import { Container, Image } from "@chakra-ui/react";
import React from "react";
import splashImg from "./LOADING.gif";

export default function Splash({ visible }) {
  if (!visible) {
    return null; // Don't render the component if not visible
  }

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        background: "#fff",
        zIndex: 9999,
      }}
    >
      <Container
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Image height={100} src={splashImg} />
      </Container>
    </div>
  );
}
