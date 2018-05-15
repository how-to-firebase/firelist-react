/* global firebase */
import React, { Component } from 'react';
import { connect } from 'unistore/react';
import * as actions from '../store/actions';

import { getToken } from '../messaging';

export class Messaging extends Component {
  constructor(props) {
    super(props);

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
    this.unlistenOnTokenRefresh = this.messaging.onTokenRefresh(() =>
      this.getToken()
    );

    this.unlistenOnMessage = this.messaging.onMessage(payload => {
      const { message, noteId, title } = payload.data;
      console.log('onMessage payload', message, noteId, title);
    });
  }

  componentWillUnmount() {
    this.unlistenOnTokenRefresh && this.unlistenOnTokenRefresh();
    this.unlistenOnMessage && this.unlistenOnMessage();
  }

  async getToken() {
    const token = await getToken(this.props);
    this.props.setMessagingToken(token);
  }

  render() {
    return null;
  }
}

export default connect('currentUser,environment', actions)(Messaging);

async function registerServiceWorker(messaging) {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    messaging.useServiceWorker(registration);
  }
}
