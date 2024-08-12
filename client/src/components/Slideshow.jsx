import {
  Box,
  Flex,
  Center,
  Container,
  Heading,
  Image,
  Spacer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import "../components/styles/slideShowStyles.css";
import logo from "/logo.png";
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
      onClick={handleNext}
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "rgba(255, 223, 89, 0.6)",
      }}
      direction="column"
    >
      <div>
        {currentIndex == 0 ? (
          <Center gap={10} marginBottom="20vh">
            <Image src={logo} width="25vw"></Image>
            <Heading>Circle Independent</Heading>
          </Center>
        ) : (
          <></>
        )}
        <Center padding={30} gap={10} marginBottom={`${currentIndex * 10}vh`}>
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems={currentIndex % 2 ? "end" : "start"}
          >
            <Heading key={data[currentIndex].title} className="fade-in">
              {data[currentIndex].title}
            </Heading>

            <Box
              paddingTop="20px"
              alignSelf="right"
              width="50%"
              key={data[currentIndex].description}
              className="fade-in-slow"
            >
              {data[currentIndex].description}
            </Box>
          </Flex>
        </Center>
        {currentIndex !== 0 ? (
          <Center gap={10} marginTop="20vh">
            <Image src={logo} width="10vw"></Image>
            <Heading>Circle Independent</Heading>
          </Center>
        ) : (
          <></>
        )}
      </div>
    </Flex>
  );
};

export default Slideshow;
