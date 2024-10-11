import { Center, Heading, Flex, Button } from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ButtonStyles } from "../../components/styles/ButtonStyle";

export default function Signed() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");

  return (
    <div>
      <Center height="100vh">
        <div>
          <Flex justify="center" align="center">
            <Heading>
              Thank you {name ? name : ""}, that service agreement is on its
              way...
            </Heading>
            <br />
          </Flex>
          <Button {...ButtonStyles} fontSize={30}>
            <a style={{ textDecoration: "none", padding: "12px" }} href="/">
              Circle Independent
            </a>
          </Button>
        </div>
      </Center>
    </div>
  );
}
