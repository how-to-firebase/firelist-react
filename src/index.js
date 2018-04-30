import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'unistore/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store';

import Layout from './layout';

const App = function() {
  return (
    <div id="app">
      <Provider store={store}>
        <Router>
          <Layout />
        </Router>
      </Provider>
    </div>
  );
};

render(<App />, document.getElementById('root'));
