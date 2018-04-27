/* globals firebase */
import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'unistore/react';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import { connectedActions, store, actions } from './store';
import Routes from './routes';
import { Drawer, Messaging, Toolbar } from './components';

let unlisten;
const InnerApp = withRouter(
  connect('', actions)(({ history, setLocation }) => {
    if (typeof unlisten === 'function') {
      unlisten();
    }
    unlisten = history.listen(setLocation);

    return (
      <div>
        <Messaging />
        <Drawer />
        <Toolbar />
        <Routes />
      </div>
    );
  })
);

function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <InnerApp />
        </Router>
      </Provider>
    </div>
  );
}

// TODO AUTHENTICATION
// See https://firebase.google.com/docs/auth/web/google-signin
// 1. Create an onAuthStateChanged callback
// 2. Call setCurrentUser with the currentUser object
const { setCurrentUser } = connectedActions;

render(<App />, document.getElementById('root'));
