import React from 'react';
import './App.css';
import ScrapyStarter from './components/scrapystarter';  // Se importa el componente

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Boton
        </p>
        <ScrapyStarter />  {/* Aquí se añade el componente para que se muestre en la página */}
      </header>
    </div>
  );
}

export default App;
