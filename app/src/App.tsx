import React, { useEffect } from 'react';
import './index.scss';
import { Home, GameHandler } from './pages';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default function App() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );
    window.addEventListener('resize', () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    });
  }, []);

  return (
    <RecoilRoot>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home></Home>
          </Route>
          <Route exact path="/g/:id" component={GameHandler} />
          <Route>
            <NotFound></NotFound>
          </Route>
        </Switch>
      </Router>
    </RecoilRoot>
  );
}

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - PAGE NOT FOUND</h1>
    </div>
  );
};
