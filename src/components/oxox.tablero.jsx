import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const Oxox = ({ socket, roomId }) => {
  const [board, setBoard] = useState(Array(3).fill(Array(3).fill("")));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on("updateBoard", (newBoard) => {
        setBoard(newBoard);
      });
  
      socket.on("updatePlayer", (newPlayerIndex) => {
        setCurrentPlayerIndex(newPlayerIndex);
      });
  
      socket.on("gameOver", (result) => {
        setWinner(result);
      });
  
      socket.on("resetGame", () => {
        setBoard(Array(3).fill(Array(3).fill("")));
        setCurrentPlayerIndex(null);
        setWinner(null);
      });
  
      socket.on("startGame", ({ board, currentPlayerIndex }) => {
        setBoard(board);
        setCurrentPlayerIndex(currentPlayerIndex);
      });
    }
  }, [socket]);

  const handleClick = (row, col) => {
    if (!board[row][col] && !winner && socket && currentPlayerIndex !== null) {
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = currentPlayerIndex === 0 ? "X" : "O";
      setBoard(newBoard);

      socket.emit("makeMove", { roomId, move: newBoard });

      // Verificar si hay un ganador después de cada movimiento
      if (checkWinner(row, col)) {
        socket.emit("gameOver", { roomId, winner: currentPlayerIndex === 0 ? "X" : "O" });
      } else {
        // Cambiar automáticamente al siguiente jugador en el servidor
        const newPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        socket.emit("updatePlayer", { roomId, newPlayerIndex });
      }
    }
  };

  const checkWinner = (row, col) => {
    const currentPlayer = currentPlayerIndex === 0 ? "X" : "O";
    if (
      board[row].every(cell => cell === currentPlayer)
    ) {
      return true;
    }
    if (
      board.every(row => row[col] === currentPlayer)
    ) {
      return true;
    }
    if (
      row === col &&
      board.every((row, i) => row[i] === currentPlayer)
    ) {
      return true;
    }
    if (
      row + col === board.length - 1 &&
      board.every((row, i) => row[board.length - 1 - i] === currentPlayer)
    ) {
      return true;
    }

    return false;
  };

  const resetGame = () => {
    socket.emit("resetGame", roomId);
  };

  const idSala = localStorage.getItem("idRoom");

  return (
    <div>
      <div>El código de la sala es {idSala}</div>
      <div>
        {winner ? (
          <p>¡Ganador: {winner}!</p>
        ) : currentPlayerIndex !== null ? (
          <p>Turno del jugador: {currentPlayerIndex === 0 ? "X" : "O"}</p>
        ) : (
          <p>Esperando a que el otro jugador se una...</p>
        )}
      </div>
      <div>
        {board.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            {row.map((cell, j) => (
              <button
                key={j}
                onClick={() => handleClick(i, j)}
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "20px",
                  border: "1px solid #ccc",
                  backgroundColor: cell === "" ? "white" : cell === "X" ? "#ffcccb" : "#b3e6b3",
                  margin: "5px",
                }}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button onClick={resetGame}>Reiniciar Juego</button>
    </div>
  );
};

Oxox.propTypes = {
  socket: PropTypes.object.isRequired,
  roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Oxox;