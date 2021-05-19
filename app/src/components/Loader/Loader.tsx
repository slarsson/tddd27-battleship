import React from 'react';
import './loader.scss';

interface LoaderProps {
  loaderSize: string;
}

export const Loader = ({ loaderSize }: LoaderProps) => {
  return (
    <div>
      <div style={{ width: '20px', height: '20px' }}>
        <div className="loading">
          <div className="spinner" style={{ borderLeft: loaderSize, borderBottom: loaderSize }}></div>
        </div>
      </div>
    </div>
  );
};
