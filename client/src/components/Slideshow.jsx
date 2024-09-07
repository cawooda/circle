import {
  Box,
  Flex,
  Center,
  Container,
  Heading,
  Image,
  Button,
  Spacer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import "../components/styles/slideShowStyles.css";
import logo from "/logo.png";
import { ButtonHighlightStyle, ButtonStyles } from "./styles/ButtonStyle";
const Slideshow = ({ data, setSlideShow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSlideShow(false);
    }
  };

  return (
    <Flex
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "space-between",
        textAlign: "center",
        padding: "50px",
        gap: "30",
      }}
      direction="column"
    >
      <div>
        {currentIndex == 0 ? (
          <>
            <Center gap={10} marginBottom="10vh">
              <Image src={logo} width="25vw"></Image>
              <Heading>Circle Independent</Heading>
            </Center>
            <Center gap={10} paddingTop="20px">
              <Button
                onClick={handleNext}
                {...ButtonStyles}
                {...ButtonHighlightStyle}
              >
                Next
              </Button>
            </Center>
          </>
        ) : (
          <></>
        )}
        <Center padding={30} gap={10} marginBottom={`15vh`}>
          <Flex
            direction={{ base: "column" }}
            alignItems={currentIndex % 2 ? "end" : "start"}
          >
            <Heading
              key={data[currentIndex].title}
              className="fade-in"
              padding="20px"
            >
              {data[currentIndex].title}
            </Heading>

            <Box
              padding="20px"
              key={data[currentIndex].description}
              className="fade-in-slow"
            >
              {data[currentIndex].description}
            </Box>
          </Flex>
        </Center>

        {currentIndex !== 0 ? (
          <>
            <Center gap={10} marginTop="20vh">
              <Image src={logo} width="10vw"></Image>
              <Heading>Circle Independent</Heading>
            </Center>
            <Center gap={10} paddingTop="20px">
              <Button
                onClick={handleNext}
                {...ButtonStyles}
                {...ButtonHighlightStyle}
              >
                Next
              </Button>
            </Center>
          </>
        ) : (
          <></>
        )}
      </div>
    </Flex>
  );
};

export default Slideshow;
