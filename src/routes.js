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
import {
  Authenticate,
  LandingView,
  NoteView,
  NotesView,
  NoteAddView,
} from './components';

const css = {
  routeWrapper: {
    padding: '1rem',
  },
};

export function Routes(state) {
  return (
    <div style={css.routeWrapper}>
      {getRedirects(state.currentUser)}
      <Route exact path="/" render={guard(LandingView, state)} />
      <Route exact path="/notes" render={guard(NotesView, state)} />
      <Route path="/note/:noteId" render={guard(NoteView, state)} />
      <Route path="/note-add" render={guard(NoteAddView, state)} />
    </div>
  );
}

export default connect('currentUser', actions)(Routes);

const protectedPaths = new Set(['/notes']);
function guard(View, { currentUser }) {
  return ({ location, match }) => {
    const { pathname } = location;

    if (!currentUser && protectedPaths.has(pathname)) {
      return <Redirect to="/login" />;
    } else {
      return <View {...match.params} />;
    }
  };
}

const redirectPaths = ['/login'];
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
