/* global firebase */
import React, { Component } from 'react';
import { connect } from 'unistore/react';
import * as actions from '../store/actions';

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
      - Assign the `unlisten` function to this.unlisten
      - Call getToken
    */
    this.unlisten = this.messaging.onTokenRefresh(() => this.getToken());
    this.getToken();
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
  }

  async getToken() {
    /* 
      CHALLENGE Messaging
      - Get the messaging token
      - HINT: use the await keyword to wait for the token asynchornously.
      - Call setMessagingToken with the new token
    */
    const { setMessagingToken } = this.props;
    const token = await this.messaging.getToken();
    setMessagingToken(token);
  }

  render() {
    return null;
  }
}

export default connect('', actions)(Messaging);

async function registerServiceWorker(messaging) {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    messaging.useServiceWorker(registration);
  }
}
