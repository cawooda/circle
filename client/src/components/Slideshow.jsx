import { Box, Flex, Center, Heading, Image, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import "../components/styles/slideShowStyles.css";
import logo from "/logo.png";
import { ButtonHighlightStyle, ButtonStyles } from "./styles/ButtonStyle";

const Slideshow = ({ data, setSlideShow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return <Box>No data available</Box>;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < data.length ? prevIndex + 1 : setSlideShow(false)
    );
  };
  if (currentIndex == data.length) {
    setSlideShow(false);
    return null;
  }
  return (
    <Flex
      onClick={handleNext}
      direction="column"
      height="100vh"
      justify="space-between"
      textAlign="center"
      p={20}
      gap={8}
    >
      {/* Display logo and heading on the first slide */}
      {currentIndex === 0 && (
        <Center gap={6} marginBottom="10vh">
          <Image src={logo} width="25vw" />
          <Heading>Circle Independent</Heading>
        </Center>
      )}

      {/* Slide Content */}
      <Center padding={10} gap={6} marginBottom="15vh">
        <Flex
          direction="column"
          alignItems={currentIndex % 2 === 0 ? "start" : "end"}
        >
          <Heading key={data[currentIndex].title} className="fade-in" p={5}>
            {data[currentIndex].title}
          </Heading>
          <Box
            key={data[currentIndex].description}
            fontSize="xl"
            p={4}
            className="fade-in-slow"
          >
            {data[currentIndex].description}
          </Box>
        </Flex>
      </Center>
      {/* display button on last slide */}
      {currentIndex == data.length - 1 && (
        <Button
          {...ButtonStyles}
          {...ButtonHighlightStyle}
          gap={6}
          marginBottom="10vh"
        >
          Start
        </Button>
      )}

      {currentIndex !== 0 && (
        <Flex
          wrap="wrap"
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
        >
          <Center gap={[4, 10]} mt="20vh" flexDirection={["column", "row"]}>
            <Image src={logo} width={["30vw", "10vw"]} />
            <Heading textAlign="center">Circle Independent</Heading>
          </Center>
        </Flex>
      )}
    </Flex>
  );
};

export default Slideshow;
