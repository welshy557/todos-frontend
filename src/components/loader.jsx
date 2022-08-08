import React from "react";
import { Grid } from "react-loader-spinner";
import "../index.css";
const LoaderComponent = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loader">
        <Grid color="#0045ad" height={100} width={200} />
      </div>
    )
  );
};

export default LoaderComponent;
