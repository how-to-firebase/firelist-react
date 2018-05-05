const { calculateDownloadUrl, recursiveDelete } = require('../utilities');
const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const UploadsOnFinalize = require('./uploads-on-finalize');
const sampleEvent = require('../sample-events/on-finalize.json');
const downloadURL = calculateDownloadUrl(sampleEvent);
const db = admin.firestore();

describe('UploadsOnFinalize', () => {
  beforeAll(done => {
    const { notes, gallery } = environment.collections;

    recursiveDelete({ db, collections: [notes, gallery] }).then(
      refs => done(),
      done.fail
    );
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
        .then(imageRef => imageRef.get())
        .then(doc => {
          result = doc.data();
          return done();
        })
        .catch(done.fail);
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
