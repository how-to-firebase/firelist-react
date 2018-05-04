const { devAdmin: admin, calculateDownloadUrl } = require('../utilities');
const environment = require('../environments/environment.dev.json');
const UploadsOnFinalize = require('./uploads-on-finalize');
const sampleEvent = require('../sample-events/on-finalize.json');
const downloadURL = calculateDownloadUrl(sampleEvent);
const db = admin.firestore();
const notesRef = db.collection(environment.collections.notes);

describe('UploadsOnFinalize', () => {
  let uploadsOnFinalize, event;
  beforeEach(() => {
    event = { ...sampleEvent };
    uploadsOnFinalize = UploadsOnFinalize({ admin, environment });
  });

  describe('functionality', () => {
    let result;
    beforeEach(done => {
      console.log('here');
      uploadsOnFinalize(event)
        .then(imageRef => imageRef.get())
        .then(doc => (result = doc.data()))
        .then(done)
        .catch(error => {
          console.log('error', error);
          done.fail(error);
        });
    });

    it('should write the record to Firestore', () => {
      const expected = {
        downloadURL,
        md5Hash: sampleEvent.md5Hash,
        name: sampleEvent.name,
      };

      expect(result).toEqual(expected);
    });
  });
});
