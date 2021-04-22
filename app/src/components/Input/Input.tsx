import React, { RefObject, useEffect, useRef } from "react";
import "./input.scss"
import { Loader } from "..";

interface InputProps {
    setToggler: (value: boolean) => void;
    placeHolder: string;
    setInputValue: (value: string) => void;
    buttonText: string;
    loading: boolean;
    onSubmit: () => void;
}

export const Input = ({ setToggler, placeHolder, setInputValue, buttonText, loading, onSubmit }: InputProps) => {

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target)) {
          setToggler(true);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div className="input-container" ref={wrapperRef}>
      <input
        className="input-field"
        placeholder={placeHolder}
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setInputValue(e.currentTarget.value);
        }}
      ></input>
      <button
        className="submit-button"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {loading ? (
          <div style={{ width: "20px", height: "20px" }}>
            <Loader loaderSize={"3px solid #1D4ED8"} />
          </div>
        ) : (
            buttonText
        )}
      </button>
    </div>
  );
};
