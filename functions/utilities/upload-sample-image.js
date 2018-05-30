const GCS = require('@google-cloud/storage');
const path = require('path');
const environment = require('../environments/environment.dev.json');

const keyFilename = path.resolve(`${environment.googleCloud.keyFilename}`);
const {
  firebase: { storageBucket },
} = environment;

const testImagePath = path.resolve(
  __dirname,
  '../test-assets/thumbnail.jpg'
);
const destination =
  'test/uploads/5ccM4M3aaS3IolEnAKWB/chrisesplin-headshot-6-600x600.jpg';

module.exports = function uploadSampleImage() {
  const gcs = GCS({ keyFilename });
  const bucket = gcs.bucket(storageBucket);
  const file = bucket.file(destination);

  return file
    .exists()
    .then(
      ([exists]) =>
        exists
          ? Promise.resolve()
          : bucket.upload(testImagePath, { destination })
    );
};
