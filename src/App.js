
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if ( calculateWinner(squares) || squares[i] ) {
      return;
    }
    const nextSquares = squares.slice();
    if ( xIsNext ) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "0";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if ( winner ) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "0")
  }

  const rowList = [
    {id:1, row:[0, 1, 2]},
    {id:2, row:[3, 4, 5]},
    {id:3, row:[6, 7, 8]}
  ];
  const renderBoard = rowList.map(item => {
    return <div className="board-row">
      {
        squares.map((square, index)=>{
          if (item.row.includes(index)) {
            return <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
          }
        })
      }
    </div>
  })



  return (
    <>
      <div className="status">{status}</div>
      {renderBoard}
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    let toggleButton = document.getElementsByClassName('toggle-order')[0];
    console.log(toggleButton);
    if (toggleButton.value == "Descending") {
      toggleButton.value="Ascending";
    } else if (toggleButton.value == "Ascending") {
      toggleButton.value="Descending";
    }

  }

  const moves = history.map((squares, move) => {
    let description;
    let historyListItem;
    if ( move > 0 && move != currentMove) {
      description = "Go to move #" + move;
      historyListItem = <button onClick={() => jumpTo(move)}>{description}</button>;
    } else if ( move === currentMove) {
      description = "You are at move #" + move;
      historyListItem = description;
    } else {
      description = "Go to game start";
      historyListItem = <button onClick={() => jumpTo(move)}>{description}</button>;
    }
    

    return (
      <li key={move}>
        {historyListItem}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {moves}
        </ol>
        <button className="toggle-order" value="Descending" onClick={toggleSort}>Change Move Order</button>
      </div>
    </div>
  )
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
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[b] === squares[a] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
} 