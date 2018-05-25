/* globals window */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'unistore/react';
import { actions } from './store';
import { Drawer, Messaging, Toolbar } from './components';
import Routes from './routes';

import { setUserTokens } from './database';

export class InnerApp extends React.Component {
  constructor() {
    super();
    this.firebase = window.firebase;
  }
  componentDidMount() {
    const { history, setLocation } = this.props;
    this.unlisten = history.listen(setLocation);
    this.subscribeToOnAuthStateChanged();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  subscribeToOnAuthStateChanged() {
    /* 
      CHALLENGE Authentication
      - Review onAuthStateChanged docs
      - https://firebase.google.com/docs/auth/web/manage-users
      - Register an onAuthStateChanged callback
      - Call setCurrentUser with the updated currentUser
      - If a currentUser exists, call setUserTokens({ environment, currentUser})
    */

    const { environment, setCurrentUser } = this.props;

    this.firebase.auth().onAuthStateChanged(currentUser => {
      setCurrentUser(currentUser);

      currentUser && setUserTokens({ environment, currentUser });
    });
  }

  render() {
    return (
      <div id="layout">
        <Messaging />
        <Toolbar />
        <Drawer />
        <Routes />
      </div>
    );
  }
}

export default withRouter(connect('environment', actions)(InnerApp));
