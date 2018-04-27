/* global firebase */
import React, { Component } from 'react';
import { connect } from 'unistore/react';
import * as actions from '../../store/actions';

export class Messaging extends Component {
  constructor(props) {
    super(props);
    // Let's pull
    this.messaging = firebase.messaging();
  }

  componentDidMount() {
    this.unlisten = this.messaging.onTokenRefresh(() => this.getToken());
    this.getToken();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  getToken() {
    return this.messaging.getToken().then(token => {
      console.log('token', token);
      console.log('this.props', this.props);
      this.props.setMessagingToken(token);
    });
  }

  render() {
    return null;
  }
}

export default connect('', actions)(Messaging);
