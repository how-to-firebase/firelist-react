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

// TODO AUTHENTICATION
// See https://firebase.google.com/docs/auth/web/google-signin
function signIn() {
  // 1. Create a new Google provider
  // 2. Add any scopes that you may want
  // 3. Sign in with the provider using a popup or a redirect  
  
}