const { parseStorageEvent } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const UploadsOnDelete = require('./uploads-on-delete');
const sampleEvent = require('../sample-events/on-delete.json');
const db = admin.firestore();

describe('UploadsOnDelete', () => {
  const { md5Hash, noteId } = parseStorageEvent(sampleEvent);
  const noteRef = db.collection(environment.collections.notes).doc(noteId);
  const imageA = { exists: true };
  const imageB = { exists: true };

  beforeAll(done => {
    noteRef
      .set({ images: { [md5Hash]: imageA, imageB } })
      .then(() => done(), done.fail);
  });

  let uploadsOnDelete, event;
  beforeEach(() => {
    event = { ...sampleEvent };
    uploadsOnDelete = UploadsOnDelete({ admin, environment });
  });

  describe('functionality', () => {
    let result;
    beforeEach(done => {
      uploadsOnDelete(event)
        .then(imageRef => imageRef.get())
        .then(doc => {
          result = doc.data();
          return done();
        })
        .catch(done.fail);
    });

    it('should delete the image', () => {
      const expected = {
        images: {
          imageB,
        },
      };

      expect(result).toEqual(expected);
    });
  });
});
