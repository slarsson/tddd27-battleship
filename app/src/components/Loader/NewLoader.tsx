import React from 'react';
import './loader.scss';

interface LoaderProps {
  size: string;
  color: string;
  borderSize: string;
  center?: boolean;
}

export const NewLoader = ({ size, color, borderSize, center }: LoaderProps) => {
  const arc = `${borderSize} solid ${color}`;

  return (
    <div className={center != null && center ? 'loading-container' : ''}>
      <div style={{ width: size, height: size }}>
        <div className="loadingx">
          <div className="spinnerx" style={{ borderLeft: arc, borderBottom: arc, borderWidth: borderSize }}></div>
        </div>
      </div>
    </div>
  );
};

export default NewLoader;
