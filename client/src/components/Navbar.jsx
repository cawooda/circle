import React from "react";
import { Button, Flex, HStack, Spacer, Stack, Avatar } from "@chakra-ui/react";

import { ButtonStyles } from "./ButtonStyle";

export default function Navbar() {
  return (
    <Flex as="nav" alignItems="center" maxHeight="100px" bg="yellow.400">
      {/* justify aligns to x direction alignItems aligns items to y direction */}

      <Spacer />
      <HStack spacing="10px">
        <Stack direction="column">
          <Avatar src="https://bit.ly/broken-link" />
        </Stack>
        <Button {...ButtonStyles}>Logout</Button>
      </HStack>
    </Flex>
  );
}
