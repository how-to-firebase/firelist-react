import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../../store';
import { Button } from 'rmwc/Button';
import { Elevation } from 'rmwc/Elevation';

import { getUserObservable } from '../../database';
import { getToken, removeToken } from '../../messaging';

const css = {
  card: {
    margin: '1rem 0',
    padding: '1rem',
  },
  headline: {
    marginTop: '0',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    marginBottom: '0',
  },
  listItem: {
    marginBottom: '.5rem',
  },
};

export class AccountView extends React.Component {
  constructor() {
    super();

    this.state = AccountView.defaultState;
  }

  static get defaultState() {
    return {
      user: {},
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.userSubscription = getUserObservable(currentUser.uid).subscribe(user =>
      this.setState({ user })
    );
  }

  componentWillUnmount() {
    this.userSubscription.unsubscribe();
  }

  async activateNotifications() {
    this.setState({ disabled: true });

    const token = await getToken(this.props);

    this.props.setMessagingToken(token);
    this.setState({ disabled: false });
  }

  async deactivateNotifications() {
    this.setState({ disabled: true });

    await removeToken(this.props);

    this.props.setMessagingToken(null);

    this.setState({ disabled: false });
  }

  render() {
    const { disabled, user } = this.state;

    return (
      <div>
        <h1>Account</h1>

        <Elevation z="1" style={css.card}>
          <h2 style={css.headline}>Details</h2>

          <ul style={css.list}>
            <li style={css.listItem}>
              <strong>Name:</strong> <span>{user.name}</span>
            </li>
            <li style={css.listItem}>
              <strong>Email:</strong> <span>{user.email}</span>
            </li>
            <li style={css.listItem}>
              <strong>Messaging token:</strong> <span>{user.messagingToken}</span>
            </li>
            <li style={css.listItem}>
              <strong>Last login:</strong>{' '}
              <span>{new Date(user.auth_time * 1000).toString()}</span>
            </li>
          </ul>
        </Elevation>

        <Elevation z="1" style={css.card}>
          <h2 style={css.headline}>Notifications</h2>

          {user.messagingToken ? (
            <Button
              ripple={false}
              onClick={this.deactivateNotifications.bind(this)}
              disabled={disabled}
            >
              Deactivate Notifications
            </Button>
          ) : (
            <Button
              ripple={false}
              onClick={this.activateNotifications.bind(this)}
              disabled={disabled}
            >
              Activate Notifications
            </Button>
          )}
        </Elevation>
      </div>
    );
  }
}

export default connect('currentUser,environment', actions)(AccountView);
