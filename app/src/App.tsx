import React from "react";
import "./index.scss"
import { Home, HowTo, Test } from './pages'
import { Navbar } from './components';

import { RecoilRoot } from 'recoil';

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
    <RecoilRoot>
      <Router> 
          <Switch>
            <Route exact path="/">
              <Layout links={navLinks}>
                <Home></Home>
              </Layout>
            </Route>
            <Route exact path="/how-to">
              <Layout links={navLinks}>
                <HowTo></HowTo>
              </Layout>
            </Route>
            <Route exact path="/test" component={Test} />
          </Switch>
      </Router>
    </RecoilRoot>
  );
}

interface Links {
  path: string;
  name: string;
}

interface LayoutProps {
  children: React.ReactNode;
  links: Links[];
}

const Layout = ({ children, links }: LayoutProps) => {
  return (
    <>
     <Navbar navLinks={links} />
     <div className="body">
       {children}
     </div>
    </>
  );
};