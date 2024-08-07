import { Container, Flex } from "@chakra-ui/react";
import React from "react";
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";

import { NavLink } from "react-router-dom";

export default function SubMenu({ items }) {
  return (
    <Flex justifyContent="center" wrap="wrap" gap={2}>
      {items.map((item) => (
        <NavLink key={item.link} to={item.link}>
          <Container
            {...ButtonStyles}
            {...(item.highlight ? ButtonHighlightStyle : ButtonStyles)}
          >
            {item.label}
          </Container>
        </NavLink>
      ))}
    </Flex>
  );
}
