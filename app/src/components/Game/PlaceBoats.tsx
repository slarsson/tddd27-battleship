import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import Board, { GridType } from '../Board/Board';
import Boats, { Boat } from '../Board/Boats';
import { boatsState, tileSizeState } from '../../components/Board/state';
import { gridActions } from '../../hooks/useGrid';
import { currentGameState } from '../../atoms/game';

const PlaceBoats = () => {
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const setBoats = useSetRecoilState<Boat[]>(boatsState);
  const tileSize = useRecoilValue<number>(tileSizeState);
  const boatHouse = useRef<HTMLDivElement | null>(null);
  const div = useRef<HTMLDivElement | null>(null);
  const grid = useRecoilValue(gridActions);
  const game = useRecoilValue(currentGameState);

  const tOut = useRef<any>();
  const gridRef = useRef<any>(grid); // TODO: måste gå att göra snyggare..

  useEffect(() => {
    gridRef.current = grid;
    grid.setBoats(game.boats);
  }, [grid]);

  const resize = () => {
    clearTimeout(tOut.current);
    tOut.current = setTimeout(() => {
      gridRef.current.random();
    }, 500);

    if (div.current) {
      if (div.current.clientWidth > 800) {
        setMaxWidth(Math.min(window.innerHeight * 0.4, div.current.clientWidth * 0.5) - 20);
      } else {
        setMaxWidth(Math.min(window.innerHeight * 0.5, div.current.clientWidth) - 20);
      }
    }
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div>
      <Boats></Boats>
      <div className="place-boats-container" ref={div}>
        <Board type={GridType.Drag} maxWidth={maxWidth}></Board>
        <button onClick={() => grid.random()}>RANDOM</button>
      </div>
    </div>
  );
};

export default PlaceBoats;
