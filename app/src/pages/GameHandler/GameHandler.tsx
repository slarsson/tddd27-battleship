import React, { useState, useEffect } from "react";
import "./gameHandler.scss";
import { useRecoilValue } from "recoil";
import { currentGameState } from "../../atoms/game";
import { useParams } from "react-router-dom";
import { Game, Loader, SelectName } from "../../components";

export const GameHandler = () => {
  const currentGame = useRecoilValue(currentGameState);
  const [loading, setLoading] = useState(false);
  const [gameExist, setGameExist] = useState(false);
  let { id }: any = useParams();
  let url = "http://localhost:3000";

  console.log(currentGame);
  
  useEffect(() => {
    if (currentGame !== null) { 
      setLoading(true);
    } else { 
      console.log("här?");
      checkGame()
    }
  }, [currentGame]);
  
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
        // toggle name-input field
        setGameExist(true);
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
      {currentGame != null ? (
        <Game />
      ) : (
      gameExist ? (
         <SelectName activeGameId={id} />
      ) : (
        <Loader loaderSize={"3px solid #1D4ED8"} />
      )  
      )}
    </div>
  );
};
