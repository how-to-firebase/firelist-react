const path = require('path');
const { fileMatchesUploadsPath, parseStorageEvent } = require('../utilities');
const GCS = require('@google-cloud/storage');

module.exports = function({ admin, environment }) {
  const db = admin.firestore();
  const { googleCloud } = environment;
  const keyFilename = path.resolve(`${googleCloud.keyFilename}`);
  const gcs = GCS({ keyFilename });

  return event => {
    // Always return a promise from every Cloud Function
    let promise = Promise.resolve();

    if (fileMatchesUploadsPath({ event, environment })) {
      const { root, noteId } = parseStorageEvent(event);
      const options = { prefix: `${root}/thumbnails/${noteId}` };
      const bucket = gcs.bucket(event.bucket);

      promise = bucket.deleteFiles(options);
    }

    return promise;
  };
};
