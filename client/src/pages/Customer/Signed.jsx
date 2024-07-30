import { Heading } from "@chakra-ui/react";
import React from "react";
import { useLocation } from "react-router-dom";

export default function Signed() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");

  return (
    <div>
      <Heading>Thanks for signing that service agreement {name}</Heading>
    </div>
  );
}
