import React from 'react';
import moment from 'moment';

export default ({ date: stringDate }) => {
  const date = stringDate && moment(new Date(stringDate));

  return <span>{date && date.format('dddd, MMM Do, YYYY')}</span>;
};
