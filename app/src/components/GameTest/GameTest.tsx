import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentGameState } from "../../atoms/game";
import "./gametest.scss";
import { StateUpdate, GameState } from '../../../../interfaces'

export const GameTest = () => {
    const currentGame = useRecoilValue(currentGameState);
    const [state, setState] = useState<StateUpdate>()
    
    useEffect(() => {
        if(currentGame !== null) {
            console.log("connect to ws...");

            // connect to ws
            let socket = new WebSocket('ws://localhost:3000');
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    type: 'connect',
                    gameId: currentGame.gameId,
                    token: currentGame.token,
                }));

                setTimeout(() => {
                    socket.send(JSON.stringify({
                        type: 'status',
                        gameId: currentGame.gameId,
                        token: currentGame.token,
                    }))
                }, 1000)
            }

            socket.onmessage = (msg: MessageEvent) => {
                console.log(msg.data);
                setState(msg.data)
            }   

        } else {
            console.log("could not connect to ws..");
        }
    }, [])
    
    console.log(state);
    console.log(state?.mode);
    
    
    return (
        <>
            {state?.mode !== GameState.AddBoats ? (
                <div className="content">
                <h2>Waiting for player to join...</h2>
                <div className="gameid">
                    <p>Game ID: {currentGame?.gameId}</p>
                    <button className="button">Copy</button>
                </div>

                {/* setToggler, placeHolder, setInputValue, buttonText, loading, onSubmit */}
                </div>
            ) : (
                <div>
                    <h2>In game...</h2>
                    <p>Game: {currentGame?.gameId}</p>
                    <p>Player: {currentGame?.token}</p>
                </div>
            )
            }
        </>
    )
}