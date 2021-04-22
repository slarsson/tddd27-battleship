import React from "react";
import "./loader.scss";

interface LoaderProps {
  loaderSize: string;
}

export const Loader =  ({ loaderSize } : LoaderProps) => {
  return (
    <div id="loading">
      <div className="spinner" style={{borderLeft: loaderSize, borderBottom:loaderSize}}> </div>
    </div>
  );
};
