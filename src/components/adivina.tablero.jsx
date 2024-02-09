
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const App = () => {
    const [message, setMessage] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [isPlayer1, setIsPlayer1] = useState(false);

    const socket = io('http://localhost:8080');

    useEffect(() => {
        socket.on('message', (data) => {
            setMessage(data);
        });

        socket.on('gameOver', () => {
            setGameOver(true);
        });

        socket.on('setPlayer', (isJ1) => {
            setIsPlayer1(isJ1);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSelectNumber = () => {
        if (!gameOver && isPlayer1) {
            const selectedNumber = prompt('Selecciona un número del 1 al 10:');
            socket.emit('selectNumber', selectedNumber);
        }
    };

    const handleGuess = () => {
        if (!gameOver && !isPlayer1) {
            socket.emit('guess', inputValue);
            setInputValue('');
        }
    };

    return (
        <div>
            <h1>Juego de Adivinanza</h1>
            <p>{message}</p>
            {!gameOver && (
                <>
                    {isPlayer1 ? (
                        <button onClick={handleSelectNumber}>Seleccionar Número (J1)</button>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button onClick={handleGuess}>Adivinar (J2)</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default App;