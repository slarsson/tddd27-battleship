import React, { useState } from "react";
import { Input } from "..";

interface Player2Props {
    activeGameId: string,
}

export const SelectName = ({ activeGameId }: Player2Props) => {
  const [loading, setLoading] = useState(false);
  const [player2Name, setPlayer2Name] = useState("");
  const [dummyState, setDummyState] = useState(true); //TODO: remove and fix this

  const joinPlayer = async () => {
    setLoading(true);

    // check input
    if (!player2Name.match("^[A-Za-zåäö]+")) {
      alert("Var vänlig se till att namnet endast består av bokstäver A-Ö.");
      return;
    }

    // TODO: Check if playername already exists
    try {
        let url = "http://localhost:3000";
        let res = await fetch(url + "/join", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: player2Name,
            gameId: activeGameId
        }),
      });
      let data = await res.json();
      console.log(data);
      
      setLoading(false);
      //onSubmit(data);

    } catch (err) {
      setLoading(false);
      console.log("err...", err);
    }
  };

  return (
    <Input setToggler={setDummyState} placeHolder={"Player name"} setInputValue={setPlayer2Name} buttonText={"Join"} loading={loading} onSubmit={joinPlayer} />
  );
};
