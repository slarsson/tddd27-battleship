import React from 'react';
import './input.scss';
import { Loader } from '..';

interface InputProps {
  title: string;
  placeHolder: string;
  error: string;
  setError: (value: string) => void;
  setInputValue: (value: string) => void;
  buttonText: string;
  loading: boolean;
  onSubmit: () => void;
  forceUppercase?: boolean;
  value: string;
}

export const Input = ({
  title,
  placeHolder,
  error,
  setError,
  setInputValue,
  buttonText,
  loading,
  onSubmit,
  forceUppercase,
  value,
}: InputProps) => {
  return (
    <form>
      <div className="input-container">
        <label className="input-label">{title}</label>
        <div className="input-fields">
          <input
            value={value}
            autoComplete="off"
            className="input-field"
            id="playername-input"
            placeholder={placeHolder}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              if (forceUppercase != null && forceUppercase) {
                setInputValue(e.currentTarget.value.toUpperCase());
              } else {
                setInputValue(e.currentTarget.value);
              }
              setError('');
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
              <Loader size={'20px'} color={'#fff'} borderSize={'3px'} />
            ) : (
              buttonText
            )}
          </button>
        </div>
        <p>{error}</p>
      </div>
    </form>
  );
};
