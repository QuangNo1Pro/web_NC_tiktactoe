import React, { useState } from "react";

function Square({ value, onClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "winning" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onClick, winningLine }) {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onClick(i)}
      isWinning={winningLine && winningLine.includes(i)}
    />
  );

  // Dùng 2 vòng lặp
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const cols = [];
    for (let col = 0; col < 3; col++) {
      cols.push(renderSquare(row * 3 + col));
    }
    boardRows.push(
      <div key={row} className="board-row">
        {cols}
      </div>
    );
  }

  return <div>{boardRows}</div>;
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAsc, setIsAsc] = useState(true);

  const current = history[stepNumber];
  const winnerInfo = calculateWinner(current.squares);
  const winner = winnerInfo ? winnerInfo.winner : null;

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const currentSquares = newHistory[newHistory.length - 1].squares.slice();
    if (winner || currentSquares[i]) return;

    currentSquares[i] = xIsNext ? "X" : "O";
    setHistory(
      newHistory.concat([{ squares: currentSquares, location: getRowCol(i) }])
    );
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const moves = history.map((step, move) => {
    const desc = move
      ? `Đi tới bước #${move} (${step.location})`
      : "Bắt đầu trò chơi";
    return (
      <li key={move}>
        {move === stepNumber ? (
          <span className="current-move">👉 Bạn đang ở bước #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{desc}</button>
        )}
      </li>
    );
  });

  if (!isAsc) moves.reverse();

  const status = winner
    ? `🎉 Người thắng: ${winner}`
    : stepNumber === 9
    ? "🤝 Hòa rồi!"
    : `Lượt kế: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={handleClick}
          winningLine={winnerInfo ? winnerInfo.line : null}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button className="sort-btn" onClick={() => setIsAsc(!isAsc)}>
          Sắp xếp: {isAsc ? "⬆️ Tăng dần" : "⬇️ Giảm dần"}
        </button>
        <button
          className="restart-btn"
          onClick={() => {
            setHistory([{ squares: Array(9).fill(null) }]);
            setStepNumber(0);
            setXIsNext(true);
          }}
        >
          🔁 Chơi lại
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function getRowCol(index) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return `${row}, ${col}`;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
