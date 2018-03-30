import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
import css from './authenticate.css';

console.log('css', css);

export default () => {
  return (
    <div style={css.wrapper}>
      <Button stroked>Log in with Google</Button>
    </div>
  );
};
