import React from 'react';
import './App.css';
import ScrapyStarter from './components/ScrapyStarter';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ScrapyStarter />  {/* Aquí se añade el componente para que se muestre en la página */}
      </header>
    </div>
  );
}

export default App;
