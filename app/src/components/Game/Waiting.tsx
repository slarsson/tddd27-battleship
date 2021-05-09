import React, { useRef } from 'react';

interface Props {
  gameId: string;
}

const Waiting = ({ gameId }: Props) => {
  const input = useRef<HTMLInputElement | null>(null);

  const copyInput = () => {
    if (input.current == null) return;
    console.log(input.current);
    input.current.select();
    document.execCommand('copy');
  };

  return (
    <div className="waiting-container">
      <div className="wait">Waiting for other player</div>
      <div className="gameid-container">
        <h2 className="gameid">Game ID</h2>
        <h2>{gameId}</h2>
        <div className="copy-container">
          <input ref={input} value={window.location.href} readOnly />
          <button onClick={copyInput}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Waiting;
