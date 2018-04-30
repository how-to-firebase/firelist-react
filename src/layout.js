/* globals window */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'unistore/react';
import { actions } from './store';
import { Drawer, Messaging, Toolbar } from './components';
import Routes from './routes';

export class InnerApp extends React.Component {
  constructor () {
    super();
    this.firebase = window.firebase
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
    */
    const { setCurrentUser } = this.props;
    this.firebase.auth().onAuthStateChanged(currentUser => {
      setCurrentUser(currentUser);
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

export default withRouter(connect('', actions)(InnerApp));
