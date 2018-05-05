const { parseStorageEvent } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const UploadsOnDelete = require('./uploads-on-delete');
const sampleEvent = require('../sample-events/on-delete.json');
const db = admin.firestore();
const { noteId } = parseStorageEvent(sampleEvent);
const noteRef = db.collection(environment.collections.notes).doc(noteId);
const imageRef = noteRef
  .collection(environment.collections.gallery)
  .doc(sampleEvent.md5Hash);

describe('UploadsOnDelete', () => {
  beforeAll(done => {
    imageRef.set({ exists: true }).then(() => done(), done.fail);
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
          result = {
            id: doc.id,
            data: doc.data(),
          };
          return done();
        })
        .catch(done.fail);
    });

    it('should delete the record to Firestore', () => {
      const expected = {
        id: 'Duxor3rBckijJi7QA5Lazg==',
      };

      expect(result).toEqual(expected);
    });
  });
});
