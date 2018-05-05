const { calculateDownloadUrl, fileMatchesUploadsPath, parseStorageEvent } = require('../utilities');

module.exports = function UploadsOnFinalize({ admin, environment }) {
  const db = admin.firestore();
  const { paths, collections } = environment;

  return event => {
    // Always return a promise from every Cloud Function
    let promise = Promise.resolve();

    if (fileMatchesUploadsPath({ event, environment })) {
      const { noteId, downloadURL, md5Hash, name } = parseStorageEvent(event);
      const noteUpdate = { updated: Date().toString() };
      const galleryUpdate = { downloadURL, md5Hash, name };

      /* 
        CHALLENGE Cloud Functions
        - Save a noteRef and an imageRef
        - noteRef   pattern: {collections.notes}/{noteId}
        - imageRef  pattern: {collections.gallery}/{noteId}/{galleryCollectionName}/{md5Hash}
        - Stage a batch.set() job to write the noteUpdate to noteRef
        - Stage a batch.set() job to write the galleryUpdate to galleryRef
        - Use { merge: true} as options for both batchWrite functions to ensure that no existing
          data gets deleted
        - Assign the result of batch.commit() to the promise variable
      */

      const noteRef = db.collection(collections.notes).doc(noteId);
      const imageRef = noteRef.collection(collections.gallery).doc(md5Hash);

      const batch = db.batch();
      batch.set(noteRef, noteUpdate, { merge: true });
      batch.set(imageRef, galleryUpdate, { merge: true });

      // Returing imageRef for testing purposes only
      promise = batch.commit().then(() => imageRef);
    }

    // Always return a promise from a Cloud Function
    return promise;
  };
};
