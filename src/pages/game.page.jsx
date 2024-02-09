import { useState, useEffect } from 'react';
import Jugadores from '../components/tablaJugadores';
import io from 'socket.io-client';
import CanalGlobal from './components/longPolling/CanalGlobal';

const token = localStorage.getItem("token");

const socket = io("http://localhost:3000", {
  auth: {
    token: token,
    nombre_usuario: localStorage.getItem("usuario")
  },
});

function App() {
  const [roomId, setRoomId] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [playerId, setPlayerId] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [choice, setChoice] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [result, setResult] = useState('');
  const [loser, setLoser] = useState(null);
  const [winner, setWinner] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);

  useEffect(() => {
    socket.on('roomCreated', (roomId) => {
      setRoomId(roomId);
      setPlayerId(socket.id);
      setWaiting(true);
    });
    
    socket.on('playerJoined', (players) => {
      setPlayers(players);
    });
    
    socket.on('gameStart', () => {
      setGameStarted(true);
      setWaiting(false);
    });
    
    socket.on('play', ({ playerId, choice }) => {
      if (playerId !== socket.id) {
        setChoice(choice);
      }
    });
    
    socket.on('result', ({ result, loser, winner }) => {
      setResult(result);
      setLoser(loser);
      setWinner(winner);
      setShowResetButton(true); // Mostrar el botón de reinicio después de ver los resultados
    });

    socket.on('playerLeft', (players) => {
      setPlayers(players);
      setGameStarted(false);
      setResult('');
      setShowResetButton(false); // Ocultar el botón de reinicio cuando un jugador deja la sala
    });
    
    socket.on('roomNotFound', () => {
      alert('La sala no existe o está llena');
    });
  }, [choice]);

  const createRoom = () => {
    if (socket) {
      socket.emit('createRoom');
    }
  };

  const joinRoom = () => {
    if (socket) {
      socket.emit('joinRoom', roomId);
    }
  };

  const play = (choice) => {
    if (socket) {
      setChoice(choice);
      socket.emit('play', { roomId, choice });
    }
  };

    const resetPage = () => {
      window.location.reload();
    };

    return (
      <div>
        <Jugadores />
        <CanalGlobal />
        {waiting ? (
          <div>
            <h1>Código de sala: {roomId}</h1>
            <h2>Esperando a que se unan jugadores...</h2>
          </div>
        ) : (
          <div>
            <h1>Juego de Piedra, Papel, Tijeras</h1>
            {gameStarted ? (
              <>
                {showResetButton ? null : (
                  <>
                    <button onClick={() => play('piedra')}>Piedra</button>
                    <button onClick={() => play('papel')}>Papel</button>
                    <button onClick={() => play('tijeras')}>Tijeras</button>
                  </>
                )}
                {loser && <p>{`${loser} perdió.`}</p>}
                {winner && <p>{`${winner} ganó.`}</p>}
                {showResetButton && <button onClick={resetPage}>Reiniciar</button>}
              </>
            ) : (
              <>
                <h2>Crear o unirte a una sala</h2>
                <input
                  type="text"
                  placeholder="ID de sala"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <button onClick={createRoom}>Crear Sala</button>
                <button onClick={joinRoom}>Unirte a la Sala</button>
              </>
            )}
            <h3>Jugadores en la sala:</h3>
            <ul>
              {players.map((player) => (
                <li key={player.id}>{player.playerName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  export default App;