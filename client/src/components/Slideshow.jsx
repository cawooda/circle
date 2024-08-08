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
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "rgba(255, 223, 89, 0.6)",
      }}
      direction="column"
    >
      <div>
        <Center gap={10}>
          <Image src={logo} width="25vw"></Image>
        </Center>

        <Center padding={30} gap={10}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent="center"
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
      </div>
    </Flex>
  );
};

export default Slideshow;
