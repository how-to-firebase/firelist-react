import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'rmwc/Button';

export default () => {
  return (
    <div>
      <h1>Firelist React</h1>
      <p>Welcome to Firelist as implemented in React</p>
      <p>Click the button below to log in :)</p>
      <div>
        <NavLink to="/login">
          <Button ripple={false}>login</Button>
        </NavLink>
      </div>
    </div>
  );
};
