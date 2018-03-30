import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unistore/react';
import { store } from './store';
import Routes from './routes';
import { Toolbar } from './components';

const App = () => (
  <Provider store={store}>
    <div>
      <Toolbar />
      <Routes />
    </div>
  </Provider>
);

var config = {
  apiKey: 'AIzaSyCS1pnoOtPF_LPRqqOpBFKef42-lk3fKxw',
  authDomain: 'how-to-firebase-tutorials.firebaseapp.com',
  databaseURL: 'https://how-to-firebase-tutorials.firebaseio.com',
  projectId: 'how-to-firebase-tutorials',
  storageBucket: 'how-to-firebase-tutorials.appspot.com',
  messagingSenderId: '1030752103417',
};

if (!window.firebase.apps.length) {
  window.firebase.initializeApp(config);
}

render(<App />, document.getElementById('root'));
