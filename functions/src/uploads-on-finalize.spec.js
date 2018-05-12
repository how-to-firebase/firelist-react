const { parseStorageEvent } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const UploadsOnFinalize = require('./uploads-on-finalize');
const sampleEvent = require('../sample-events/upload-on-finalize.json');
const db = admin.firestore();

describe('UploadsOnFinalize', () => {
  const {
    downloadURL,
    filename,
    md5Hash,
    name,
    noteId,
    size,
  } = parseStorageEvent(sampleEvent);
  const noteRef = db.collection(environment.collections.notes).doc(noteId);

  beforeAll(done => {
    return noteRef.delete().then(() => done(), done.fail);
  });

  let uploadsOnFinalize, event;
  beforeEach(() => {
    event = { ...sampleEvent };
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
