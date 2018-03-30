import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'unistore/react';
import { actions } from './store';
import { Authenticate } from './components';

export default connect('currentUser', actions)(({ currentUser }) => {
  return (
    <Router>
      <div>{currentUser ? <h2>Logged in</h2> : <Authenticate />}</div>
    </Router>
  );
});
