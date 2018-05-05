const parseStorageEvent = require('./parse-storage-event');

module.exports = function fileMatchesUploadsPath({ event, environment }) {
  const { folder } = parseStorageEvent(event);

  return folder == environment.paths.uploads;
};
