import React from 'react';
import './App.css';
import Board from './components/Board';
import NavBar from './components/NavBar';

function App() {
  return (
    <div>
      <NavBar title="Tableau Trello" />
      <div className="container">
        <div className="board">
          <Board />
        </div>
      </div>
    </div>
  );
}

export default App;
