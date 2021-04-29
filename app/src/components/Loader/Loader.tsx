import React from "react";
import "./loader.scss";

interface LoaderProps {
  loaderSize: string;
}

export const Loader =  ({ loaderSize } : LoaderProps) => {
  return (
    <div style={{ width: "20px", height: "20px" }}>
      <div id="loading">
        <div className="spinner" style={{borderLeft: loaderSize, borderBottom:loaderSize}}> </div>
      </div>
    </div>
  );
};
