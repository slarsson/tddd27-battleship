import React from "react";

import Board from './../../components/Game/Board';

export const Test = () => {
  return (
    <div style={{display: 'flex'}}>
      TEST ROUTE
      <Board></Board>

      <div style={{marginLeft: '50px'}}></div>

      <Board></Board>
    </div>
  )
}

