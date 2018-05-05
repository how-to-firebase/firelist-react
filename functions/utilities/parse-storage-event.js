const calculateDownloadUrl = require('./calculate-download-url');

module.exports = function parseStorageEvent(event) {
  const downloadURL = calculateDownloadUrl(event);
  const { name, md5Hash } = event;
  const nameParts = name.split('/');
  const filename = nameParts.pop();
  const noteId = nameParts.pop();
  const folder = nameParts.join('/');

  return { filename, noteId, folder, downloadURL, name, md5Hash };
};
