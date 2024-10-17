import React from "react";

const ProviderLogo = ({ logoUrl }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <img
        src={logoUrl}
        alt="Provider Logo"
        style={{ width: "60px", height: "auto" }}
      />
    </div>
  );
};

export default ProviderLogo;
