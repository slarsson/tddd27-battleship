import React from "react";
import "./button.scss"

interface ButtonProps {
    text: string;
    setToggler: (value: boolean) => void;
    toggler: boolean;
}

export const Button = ({ text, setToggler, toggler } : ButtonProps) => {
  return (
    <button
        className="form-button"
        onClick={() => setToggler(!toggler)}
    >
        {text}
    </button>
  );
};
