/* global firebase */

import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
// import css from './authenticate.css';

const css = {
  wrapper: {
    display: 'flex',
    height: '50vh',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
};

const providers = {
  google: new firebase.auth.GoogleAuthProvider(),
};

export default () => {
  return (
    <div style={css.wrapper}>
      <Button stroked onClick={signIn}>
        Log in with Google
      </Button>
    </div>
  );
};

function signIn() {
  firebase.auth().signInWithPopup(providers.google);
}
