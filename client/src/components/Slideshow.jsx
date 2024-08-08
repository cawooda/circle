import React, { useState } from "react";

const Slideshow = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Optionally handle the end of the slideshow, e.g., reset to the start or call an onEnd callback
      console.log("End of slideshow");
    }
  };

  return (
    <div
      onClick={handleNext}
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div>
        <h1>{data[currentIndex].title}</h1>
        <p>{data[currentIndex].description}</p>
      </div>
    </div>
  );
};

export default Slideshow;
