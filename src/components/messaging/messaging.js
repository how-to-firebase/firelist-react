/* global firebase */
import React, { Component } from 'react';
import { connect } from 'unistore/react';
import { actions } from '../../store';

export class Messaging extends Component {
  constructor(props) {
    super(props);
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
    console.log('this.props.setMessagingToken', this.props);
    return this.messaging.getToken().then(this.props.setMessagingToken);
  }

  render() {
    return null;
  }
}

console.log(actions)

export default connect('', actions)(Messaging);
