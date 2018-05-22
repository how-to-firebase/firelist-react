/* global firebase */
import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';

const css = {
  wrapper: {
    display: 'flex',
    height: '50vh',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
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

/* 
  CHALLENGE Authentication
  - Review Google sign-in docs 
  - https://firebase.google.com/docs/auth/web/google-signin
  - Create a new GoogleAuthProvider
  - Pass that provider into signInWithPopup or signInWithRedirect
*/

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();

  // Use the provider to sign in with a popup or a redirect
  firebase.auth().signInWithPopup(provider);
}
