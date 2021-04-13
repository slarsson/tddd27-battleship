import React, { useState, useEffect, useRef  } from "react";
import "../styles/home.scss";
import battleship from "../assets/battleship.png";

const Home = () => {
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState("");
  const [createToggler, setCreateToggler] = useState(true);
  const [joinToggler, setJoinToggler] = useState(true);

  useEffect(() => {
    //console.log(playerName);
    //console.log(gameId);
    
  }, [playerName, gameId]);

  const handleCreate = () => {};

  const handleJoin = () => {};


  return (
    <div className="container">
      <div>
        <img src={battleship} className="img"></img>
        <h1 className="header">Battleship</h1>
      </div>

      <div className="button-container">
        <form className="form">
          {createToggler ? (
            <button
              className="form-button"
              onClick={() => setCreateToggler(!createToggler)}
            >
              Create game
            </button>
          ) : (
            <div className="input-container">
              <input
                className="input-field"
                placeholder="Player name"
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setPlayerName(e.currentTarget.value);
                }}
              ></input>
              <button
                className="submit-button"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleCreate();
                }}
              >
                Create
              </button>
            </div>
          )}
        </form>

        <form className="form">
          {joinToggler ? (
            <button
              className="form-button"
              onClick={() => setJoinToggler(!joinToggler)}
            >
              Join game
            </button>
          ) : (
            <div className="input-container">
              <input
                className="input-field"
                placeholder="Game id"
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setGameId(e.currentTarget.value);
                }}
              ></input>
              <button
                className="submit-button"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleJoin();
                }}
              >
                Join
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Home;

