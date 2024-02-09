import { useState, useEffect } from 'react';
import axios from 'axios';

function Jugadores() {
    const [jugadores, setJugadores] = useState([]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/app/user/', { headers: { Authorization: `${token}` } });
            setJugadores(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    useEffect(() => {   
        fetchUsers();
        const intervalId = setInterval(() => {
            fetchUsers();
        }, 5000); // Intervalo de 5 segundos (ajusta según tus necesidades)
        return () => clearInterval(intervalId);
    }, []);

    const filteredJugadores = jugadores.filter(jugador => jugador.record > 0).sort((a, b) => b.record - a.record);

    return (
        <div style={{ textAlign: "center", paddingLeft: "15px", paddingRight: "15px" , backgroundColor:"purple", justifyContent: "center" }}>
            <h2>Top Jugadores</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Usuario</th>
                        <th>Récord</th>
                    </tr>
                </thead>
                <tbody >
                    {Array.isArray(filteredJugadores) && filteredJugadores.map((jugador) => (
                        <tr key={jugador.id_usuario}>
                            <td>{jugador.nombre_usuario}</td>
                            <td>{jugador.record}</td>
                        </tr>   
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Jugadores;