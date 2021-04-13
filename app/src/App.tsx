import React from "react";
import "./index.css"
import Home from "./routes/Home";
import HowTo from "./routes/HowTo";
import Settings from "./routes/Settings";
import Drag from "./components/Drag";
import Navbar from "./components/Navbar";

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
    {
      path: "/settings",
      name: "Settings"
    }
  ]
  
  return (
    <div>
      <Router>
        <Navbar 
          navLinks={navLinks}
          background={"#333"}
          hoverBackground={"#999"}
          linkColor={"#DDD"}
        />
        <div className="body">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/how-to" component={HowTo} />
            <Route exact path="/settings" component={Settings} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}


