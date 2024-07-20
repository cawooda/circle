import React from "react";
import { Button, Flex, HStack, Spacer, Stack, Avatar } from "@chakra-ui/react";

import { ButtonStyles } from "./ButtonStyle";

export default function Navbar() {
  return (
    <Flex
      as="nav"
      p="10px"
      alignItems="center"
      maxHeight="100px"
      bg="yellow.400"
    >
      {/* justify aligns to x direction alignItems aligns items to y direction */}

      <Spacer />
      <HStack spacing="10px">
        <Stack direction="column">
          <Avatar src="https://bit.ly/broken-link" />
        </Stack>
        <Button {...ButtonStyles}>Logout</Button>
      </HStack>
    </Flex>

    // <Flex bg="gray.200" justify="space-between" wrap="wrap" gap="2px">
    //   <Box w="150px" bg="red">
    //     1
    //   </Box>
    //   <Box w="150px" bg="green">
    //     2
    //   </Box>
    //   <Box w="150px" bg="blue" flexGrow="1">
    //     3
    //   </Box>
    //   <Box w="150px" bg="yellow" flexGrow="2">
    //     4
    //   </Box>
    // </Flex>
  );
}
