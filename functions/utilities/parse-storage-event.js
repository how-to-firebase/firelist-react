const calculateDownloadUrl = require('./calculate-download-url');

module.exports = function parseStorageEvent(event) {
  const downloadURL = calculateDownloadUrl(event);
  const { name } = event;
  const nameParts = name.split('/');
  const filename = nameParts.pop();
  const noteId = nameParts.pop();
  const type = nameParts.pop();
  const root = nameParts.slice(0);
  const folder = [root, type].join('/');

  return Object.assign(event, { downloadURL, filename, folder, root, noteId, type });
};
