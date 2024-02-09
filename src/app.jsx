// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/register.page';
import PaginaJuego from './pages/game.page';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Game" element={<PaginaJuego />} />
      </Routes>
    </Router>
  );
}

export default App;