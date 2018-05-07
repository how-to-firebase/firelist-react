const { parseStorageEvent } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const ThumbnailsOnFinalize = require('./thumbnails-on-finalize');
const sampleEvent = require('../sample-events/on-finalize.json');
const db = admin.firestore();

describe('ThumbnailsOnFinalize', () => {
  const { md5Hash, noteId } = parseStorageEvent(sampleEvent);
  const noteRef = db.collection(environment.collections.notes).doc(noteId);

  let thumbnailsOnFinalize, event;
  beforeEach(() => {
    event = {
      ...sampleEvent,
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
      thumbnailsOnFinalize(event)
        .then(noteRef => noteRef.get())
        .then(doc => {
          result = doc.data();
          return done();
        })
        .catch(done.fail);
    });

    it('should create the thumbnail', () => {
      const expected = {
        images: {
          test: true,
        },
      };

      expect(result).toEqual(expected);
    });
  });
});
