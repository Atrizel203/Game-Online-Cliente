import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginCreateAccount = () => {
    const [nombre_usuario, setnombre_usuario] = useState("");
    const [contrasena, setcontrasena] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCreatingAccount] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/Game");
        }
    }, [isLoggedIn, navigate]);


    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:3000/app/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_usuario,
                    contrasena,
                }),
            });
            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuario", nombre_usuario);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateAccount = async () => {
        try {
            const response = await fetch("http://localhost:3000/app/user/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_usuario,
                    contrasena,
                }),
            });
            if (response.status === 201) {
                alert("Cuenta creada");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <h1>Estás conectado</h1>
                    <button onClick={() => navigate("/Game")}>Ir al juego</button>
                </div>
            ) : (
                <div>
                    {isCreatingAccount ? (
                        <div>
                            <h1>Creando cuenta...</h1>
                        </div>
                    ) : (
                        <div>
                            <h1>Inicia sesión o crea una cuenta</h1>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    value={nombre_usuario}
                                    onChange={(e) => setnombre_usuario(e.target.value)}
                                />
                                <input
                                    type="contrasena"
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={(e) => setcontrasena(e.target.value)}
                                />
                            </div>
                            <button onClick={handleLogin}>Iniciar sesión</button>
                            <button onClick={handleCreateAccount}>Crear cuenta</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LoginCreateAccount;