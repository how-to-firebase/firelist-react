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
import { Authenticate, NotesView, NoteAddView } from './components';

const css = {
  routeWrapper: {
    padding: '1rem',
  },
};

export default connect('currentUser', actions)(state => {
  const redirects = getRedirects(state.currentUser);
  return (
    <div style={css.routeWrapper}>
      {redirects}
      <Route exact path="/notes" render={guard(NotesView, state)} />
      <Route path="/note-add" render={guard(NoteAddView, state)} />
    </div>
  );
});

const protectedPaths = new Set(['/', '/notes']);
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

const redirectPaths = ['/', '/login'];
function getRedirects(currentUser) {
  return redirectPaths.map(path => (
    <Route
      key={path}
      exact
      path={path}
      render={() =>
        (currentUser && <Redirect to="/notes" />) || <Authenticate />
      }
    />
  ));
}
