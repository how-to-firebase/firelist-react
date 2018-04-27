/* global firebase */
import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
import css from './authenticate.css';

export default () => {
  return (
    <div className={css.wrapper}>
      <Button stroked onClick={signIn}>
        Log in with Google
      </Button>
    </div>
  );
};

const providers = {
  google: new firebase.auth.GoogleAuthProvider(),
};

function signIn() {
  firebase.auth().signInWithPopup(providers.google);
}
