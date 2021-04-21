import React from "react";
import "./index.scss"
import { Home, HowTo } from './pages'
import { Navbar } from './components';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

export default function App() {

  const navLinks = [
    {
      path: "/",
      name: "Home"
    },
    {
      path: "/how-to",
      name: "How to"
    },
  ]
  
  return (
    <Router>
      <Navbar 
        navLinks={navLinks}
      />
      <div className="body"> 
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/how-to" component={HowTo} />
        </Switch>
      </div>
    </Router>
  );
}
