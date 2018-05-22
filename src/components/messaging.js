/* global firebase */
import React, { Component } from 'react';
import { connect } from 'unistore/react';
import * as actions from '../store/actions';
import { Redirect } from 'react-router-dom';

import { Snackbar } from 'rmwc/Snackbar';

import { getToken } from '../messaging';

export class Messaging extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.messaging = firebase.messaging();
  }

  async componentDidMount() {
    await registerServiceWorker(this.messaging);

    /* 
      CHALLENGE Messaging
      - Listen to for refreshed messaging tokens and call getToken
      - Assign the `unlisten` function to this.unlistenOnTokenRefresh
      - Call getToken
    */
    
    /* 
      CHALLENGE Messaging
      - See https://firebase.google.com/docs/cloud-messaging/js/receive
      - Handle foreground messages
      - Assign the `unlisten` function to this.unlistenOnMessage
      - Call this.showMessage({ message, noteId }) to pop a snackbar message
      - Hint: onMessage payload looks like { message, noteId, title }
      - Hint: Share a project with your own email address to test the onMessage callback
    */
    
  }

  componentWillUnmount() {
    this.unlistenOnTokenRefresh && this.unlistenOnTokenRefresh();
    this.unlistenOnMessage && this.unlistenOnMessage();
  }

  async getToken() {
    const token = await getToken(this.props);
    this.props.setMessagingToken(token);
  }

  showMessage({ message, noteId }) {
    this.setState({ message, noteId, title: 'Visit', show: true });
  }

  render() {
    const { redirect, message, noteId, show, title } = this.state;

    return (
      <div>
        <Snackbar
          show={this.state.show}
          onHide={e => this.setState({ show: false })}
          message={message}
          actionText={title}
          actionHandler={() =>
            this.setState({ redirect: `/note/${noteId}`, show: false })
          }
        />
        {!!redirect && <Redirect to={redirect} />}
      </div>
    );
  }
}

export default connect('currentUser,environment', actions)(Messaging);

async function registerServiceWorker(messaging) {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    messaging.useServiceWorker(registration);
  }
}
