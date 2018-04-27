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

// See https://firebase.google.com/docs/auth/web/google-signin
function signIn() {
  const googleProvider = getGoogleProvider();

  // Use the provider to sign in with a popup or a redirect
  firebase.auth().signInWithPopup(googleProvider);
}

function getGoogleProvider() {
  // Return a new Google auth provider  
  return  new firebase.auth.GoogleAuthProvider();
}
