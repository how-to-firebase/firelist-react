/* globals location */

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  matchPath,
} from 'react-router-dom';
import { connect } from 'unistore/react';
import { actions } from './store';
import { Authenticate, LandingView, AccountView } from './components';

export default connect('currentUser', actions)(state => {
  return (
    <div>
      <Route
        exact
        path="/login"
        render={() =>
          (state.currentUser && <Redirect to="/" />) || <Authenticate />
        }
      />
      <Route exact path="/" render={guard(LandingView, state)} />
      <Route path="/account" render={guard(AccountView, state)} />
    </div>
  );
});

const protectedPaths = new Set(['/', '/account']);
function guard(View, { currentUser }) {
  return ({ location }) => {
    const { pathname } = location;

    if (!currentUser && protectedPaths.has(pathname)) {
      return <Redirect to="/login" />;
    } else {
      return <View />;
    }
  };
}
