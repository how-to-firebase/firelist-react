const { parseStorageEvent } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const ThumbnailsOnFinalize = require('./thumbnails-on-finalize');
const sampleEvent = require('../sample-data/upload-on-finalize.json');
const db = admin.firestore();

describe('ThumbnailsOnFinalize', () => {
  const fakeMd5Hash = 'thumbnails-on-finalize';
  const { noteId } = parseStorageEvent(sampleEvent);
  const noteRef = db.collection(environment.collections.notes).doc(noteId);

  let thumbnailsOnFinalize, event;
  beforeEach(() => {
    event = {
      ...sampleEvent,
      metadata: {},
      md5Hash: fakeMd5Hash,
      name:
        'test/uploads/5ccM4M3aaS3IolEnAKWB/chrisesplin-headshot-6-600x600.jpg',
    };
    const testEnvironment = {
      ...environment,
      paths: { uploads: 'test/uploads' },
    };
    thumbnailsOnFinalize = ThumbnailsOnFinalize({
      admin,
      environment: testEnvironment,
    });
  });

  describe('functionality', () => {
    let result;
    beforeEach(done => {
      Promise.resolve()
        .then(() => noteRef.delete())
        .then(() => thumbnailsOnFinalize(event))
        .then(() => noteRef.get())
        .then(doc => {
          result = doc.data();
          return done();
        })
        .catch(done.fail);
    }, 10 * 1000);

    it('should create the thumbnail', () => {
      expect(typeof result.images[fakeMd5Hash].thumbnail).toEqual('string');
    });
  });
});
