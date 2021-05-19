import React, { useEffect } from 'react';
import './index.scss';
import { Home, HowTo, GameHandler } from './pages';
import { Navbar } from './components';

import { RecoilRoot } from 'recoil';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default function App() {
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    window.addEventListener('resize', () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  }, []);

  const navLinks = [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: '/how-to',
      name: 'How to',
    },
  ];

  return (
    <RecoilRoot>
      <Router>
        <Switch>
          <Route exact path="/">
            <Layout links={navLinks}>
              <Home></Home>
            </Layout>
          </Route>
          <Route exact path="/g/:id" component={GameHandler} />
          <Route exact path="/how-to">
            <Layout links={navLinks}>
              <HowTo></HowTo>
            </Layout>
          </Route>
          <Route>
            <Layout links={navLinks}>
              <NotFound></NotFound>
            </Layout>
          </Route>
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
      <div>{children}</div>
    </>
  );
};

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - PAGE NOT FOUND</h1>
    </div>
  );
};
