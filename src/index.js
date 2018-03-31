/* globals firebase */
import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'unistore/react';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import { connectedActions, store, actions } from './store';
import Routes from './routes';
import { Drawer, Toolbar } from './components';

let unlisten;
const InnerApp = withRouter(
  connect('', actions)(({ history, setLocation }) => {
    if (typeof unlisten === 'function') {
      unlisten();
    }
    unlisten = history.listen(setLocation);

    return (
      <div>
        <Drawer />
        <Toolbar />
        <Routes />
      </div>
    );
  })
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <InnerApp />
      </Router>
    </Provider>
  );
}

var config = {
  apiKey: 'AIzaSyCS1pnoOtPF_LPRqqOpBFKef42-lk3fKxw',
  authDomain: 'how-to-firebase-tutorials.firebaseapp.com',
  databaseURL: 'https://how-to-firebase-tutorials.firebaseio.com',
  projectId: 'how-to-firebase-tutorials',
  storageBucket: 'how-to-firebase-tutorials.appspot.com',
  messagingSenderId: '1030752103417',
};

if (firebase && !firebase.apps.length) {
  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(connectedActions.setCurrentUser);
}

render(<App />, document.getElementById('root'));
