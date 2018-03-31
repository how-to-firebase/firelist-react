import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../../store';

export default connect('currentUser', actions)(() => {
  return (
    <div>
      <h1>Account Route</h1>
    </div>
  );
});
