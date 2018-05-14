import React from 'react';

import { Spinner } from '../svg';

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '50vh',
      }}
    >
      <Spinner />
    </div>
  );
};
