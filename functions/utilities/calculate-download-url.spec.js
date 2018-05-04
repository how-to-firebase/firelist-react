const calculateDownloadUrl = require('./calculate-download-url');
const sampleEvent = require('../sample-events/on-finalize.json');

describe('calculateDownloadURL', () => {
  it('should return a valid downloadURL', () => {
    const expected =
      'https://firebasestorage.googleapis.com/v0/b/firelist-react.appspot.com/o/firelist-react%2Fuploads%2F5ccM4M3aaS3IolEnAKWB%2Fchrisesplin-headshot-6-600x600.jpg?alt=media&token=51b4bb2f-ef18-4f82-8380-b5a23d99a202';

    expect(calculateDownloadUrl(sampleEvent)).toEqual(expected);
  });
});
