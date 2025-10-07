import React from "react";
import Game from "./components/Game";
import "./game.css";

export default function App() {
  return (
    <div className="app-container">
      <h1 className="title">🎮 Tic Tac Toe</h1>
      <Game />
    </div>
  );
}
