const {
  calculateDownloadUrl,
  fileMatchesUploadsPath,
  parseStorageEvent,
} = require('../utilities');

module.exports = function UploadsOnFinalize({ admin, environment }) {
  const db = admin.firestore();
  const { paths, collections } = environment;

  return event => {
    // Always return a promise from every Cloud Function
    let promise = Promise.resolve();

    if (fileMatchesUploadsPath({ event, environment })) {
      const { downloadURL, filename, name, noteId, md5Hash, size } = parseStorageEvent(
        event
      );
      const updated = Date().toString();

      /* 
        CHALLENGE Cloud Functions
        - Save a noteRef and an imageRef
        - noteRef   pattern: {collections.notes}/{noteId}
        - imageRef  pattern: {collections.gallery}/{noteId}/{galleryCollectionName}/{md5Hash}
        - Get the noteRef record and pull off the note.owner attribute so we can add it to the
        - Stage a batch.set() job to write the noteUpdate to noteRef
        - Stage a batch.set() job to write the galleryUpdate to galleryRef
        - Use { merge: true} as options for both batchWrite functions to ensure that no existing
          data gets deleted
        - Assign the result of batch.commit() to the promise variable
      */

      const noteRef = db.collection(collections.notes).doc(noteId);

      promise = noteRef
        .get()
        .then(doc => doc.data())
        .then(note => {
          let { images } = note || {};

          if (!images) {
            images = {};
          }

          images[md5Hash] = { downloadURL, filename, name, size };

          // Setting the { merge: true } option turns the set into an upsert
          return noteRef.set({ images }, { merge: true });
        })
        .then(() => noteRef);
      // Returning imageRef for testing purposes only
    }

    // Always return a promise from a Cloud Function
    return promise;
  };
};
