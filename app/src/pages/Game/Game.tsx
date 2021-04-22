import React, { useState, useEffect } from "react";
import "./game.scss";
import { useRecoilState } from "recoil";
import { gameStates } from "../../atoms/game";
import { useParams } from "react-router-dom";
import { SelectName } from "../../components";

export const Game = () => {
  const [gameData, setGameData] = useRecoilState(gameStates);
  const [loading, setLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState(false); //TODO: fix dynamic views
  let { id }: any = useParams();
  let url = "http://localhost:3000";

  // useEffect check if gameId is available --> later localstorage
  useEffect(() => {
    if (!gameData[id]) {
      checkGame()
    } else { 
      // connect to game without nameinput
      console.log("gameID finns, pusha player");
    }
  }, []);
  
  const checkGame = async () => {
    setLoading(true);  

    try {
      let res = await fetch(url + "/available", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: id,
        }),
      });
      let data = await res.json();
      console.log("ok?", data);

      // Game exists
      if (data.ok) {
        setLoading(false);
        setGameStatus(true);
      } else {
        setLoading(false);
        alert("No game buddy");
      }
    } catch (e) {
      setLoading(false);
      console.log("err...", e);
    }
  }
  
  return (
    <div className="gameContainer">
      {gameStatus ? (
        <SelectName activeGameId={id} />
      ) : ""}
      
      {/* <h2>Game ID: {gameData[id].gameId}</h2>
      <p>Player 1: {gameData[id].token}</p>
      <p>Player 2..: </p>  */}
    </div>
  );
};
