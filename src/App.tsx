import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
// import Home from './components/Home';
// import Profile from './components/Profile';
// import Settings from './components/Settings';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <NavBar />  {/* Incluye el NavBar en la parte superior de la página */}
                <Switch>
                    {/* Define las rutas para cada página */}
                    {/* <Route path="/" exact component={Home} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/settings" component={Settings} /> */}
                    {/* Puedes agregar más rutas según sea necesario */}
                </Switch>
            </div>
        </Router>
    );
};

export default App;

/* <ScrapyStarter />
import ScrapyStarter from './components/scrapystarter'; */