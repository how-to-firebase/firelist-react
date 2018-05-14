const path = require('path');
const { parseStorageEvent } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const ThumbnailsOnDelete = require('./thumbnails-on-delete');
const sampleEvent = require('../sample-data/upload-on-finalize.json');
const db = admin.firestore();
const GCS = require('@google-cloud/storage');
const gcs = GCS({ keyFilename: environment.googleCloud.keyFilename });
const bucket = gcs.bucket(sampleEvent.bucket);

describe('ThumbnailsOnDelete', () => {
  const { root, noteId } = parseStorageEvent(sampleEvent);
  const prefix = 'test/thumbnails/123456';
  const localFilename = path.resolve('./test-assets/thumbnail.jpg');
  const thumbnailName = 'test/thumbnails/123456/200x200/thumbnail.jpg';
  const uploadName = 'test/uploads/123456/thumbnail.jpg';

  let thumbnailsOnDelete, event;
  beforeEach(() => {
    event = {
      ...sampleEvent,
      name: uploadName,
    };

    thumbnailsOnDelete = ThumbnailsOnDelete({
      admin,
      environment: {
        ...environment,
        paths: {
          uploads: 'test/uploads',
        },
      },
    });
  });

  describe('functionality', () => {
    let result;
    beforeEach(done => {
      Promise.resolve()
        .then(() =>
          bucket.upload(localFilename, { destination: thumbnailName })
        )
        .then(() => thumbnailsOnDelete(event))
        .then(() => bucket.getFiles({ prefix }))
        .then(([files]) => {
          result = files;
          return done();
        })
        .catch(done.fail);
    }, 10 * 1000);

    it('should delete the thumbnail', () => {
      expect(result.length).toEqual(0);
    });
  });
});
