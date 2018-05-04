const { calculateDownloadUrl } = require('../utilities');

/* 
  CHALLENGE Cloud Functions
  - 
*/
module.exports = function UploadsOnFinalize({ admin, environment }) {
  const db = admin.firestore();
  const { paths, collections } = environment;

  return event => {
    const nameParts = event.name.split('/');
    const filename = nameParts.pop();
    const noteId = nameParts.pop();
    const uploadFolder = nameParts.join('/');
    let promise = Promise.resolve();

    if (uploadFolder == paths.uploads) {
      const downloadURL = calculateDownloadUrl(event);
      const { md5Hash, name } = event;
      const batch = db.batch();

      const noteRef = db
        .collection(collections.notes)
        .doc(noteId);

      const imageRef = noteRef.collection(collections.gallery).doc(md5Hash);

      batch.set(noteRef, { updated: Date().toString() });
      batch.set(imageRef, { downloadURL, md5Hash, name }, { merge: true });

      promise = batch.commit().then(() => imageRef);
    }

    return promise;
  };
};

// const sampleEvent = {
//   bucket: 'firelist-react.appspot.com',
//   contentDisposition:
//     "inline; filename*=utf-8''chrisesplin-headshot-6-600x600.jpg",
//   contentType: 'image/jpeg',
//   crc32c: 'vr1Wlg==',
//   etag: 'CNOjmIL869oCEAE=',
//   generation: '1525433875435987',
//   id:
//     'firelist-react.appspot.com/firelist-react/uploads/5ccM4M3aaS3IolEnAKWB/chrisesplin-headshot-6-600x600.jpg/1525433875435987',
//   kind: 'storage#object',
//   md5Hash: 'TMhCLMo319sLbrzVOLae5Q==',
//   mediaLink:
//     'https://www.googleapis.com/download/storage/v1/b/firelist-react.appspot.com/o/firelist-react%2Fuploads%2F5ccM4M3aaS3IolEnAKWB%2Fchrisesplin-headshot-6-600x600.jpg?generation=1525433875435987&alt=media',
//   metadata: {
//     firebaseStorageDownloadTokens: '51b4bb2f-ef18-4f82-8380-b5a23d99a202',
//   },
//   metageneration: '1',
//   name:
//     'firelist-react/uploads/5ccM4M3aaS3IolEnAKWB/chrisesplin-headshot-6-600x600.jpg',
//   selfLink:
//     'https://www.googleapis.com/storage/v1/b/firelist-react.appspot.com/o/firelist-react%2Fuploads%2F5ccM4M3aaS3IolEnAKWB%2Fchrisesplin-headshot-6-600x600.jpg',
//   size: '271526',
//   storageClass: 'STANDARD',
//   timeCreated: '2018-05-04T11:37:55.379Z',
//   timeStorageClassUpdated: '2018-05-04T11:37:55.379Z',
//   updated: '2018-05-04T11:37:55.379Z',
// };
