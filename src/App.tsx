import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
// import Home from './components/Home';
// import Profile from './components/Profile';
// import Settings from './components/Settings';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import "preline/preline";
import { IStaticMethods } from "preline/preline";
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <NavBar />
                <Routes>  // Reemplazo de Switch por Routes
                    {/* <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} /> */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;


/* <ScrapyStarter />
import ScrapyStarter from './components/scrapystarter'; */