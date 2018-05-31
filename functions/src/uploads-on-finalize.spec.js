const { parseStorageEvent } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const UploadsOnFinalize = require('./uploads-on-finalize');
const sampleEvent = require('../sample-data/upload-on-finalize.json');
const db = admin.firestore();
const name = `${environment.paths.uploads}/5ccM4M3aaS3IolEnAKWB/chrisesplin-headshot-6-600x600.jpg`
const customEvent = { ...sampleEvent, name };

describe('UploadsOnFinalize', () => {
  const {
    downloadURL,
    filename,
    md5Hash,
    name,
    noteId,
    size,
  } = parseStorageEvent(customEvent);
  const noteRef = db.collection(environment.collections.notes).doc(noteId);

  beforeAll(done => {
    return noteRef.delete().then(() => done(), done.fail);
  });

  let uploadsOnFinalize, event;
  beforeEach(() => {
    event = { ...customEvent };
    uploadsOnFinalize = UploadsOnFinalize({ admin, environment });
  });

  describe('functionality', () => {
    let result;
    beforeEach(done => {
      uploadsOnFinalize(event)
        .then(noteRef => noteRef.get())
        .then(doc => {
          result = doc.data();
          done();
        })
        .catch(done.fail);
    });

    it('should add the image to Firestore', () => {
      const expected = {
        downloadURL,
        filename,
        name,
        size,
      };
      const imageRecord = result.images[md5Hash];

      expect(imageRecord).toEqual(expected);
    });
  });
});
