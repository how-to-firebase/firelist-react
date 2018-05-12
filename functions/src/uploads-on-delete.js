const { fileMatchesUploadsPath, parseStorageEvent } = require('../utilities');

module.exports = function UploadsOnDelete({ admin, environment }) {
  const db = admin.firestore();
  const { paths, collections } = environment;

  return event => {
    // Always return a promise from every Cloud Function
    let promise = Promise.resolve();

    if (fileMatchesUploadsPath({ event, environment })) {
      const { noteId, md5Hash } = parseStorageEvent(event);

      /* 
        CHALLENGE Cloud Functions
        - Save a noteRef and an imageRef
        - noteRef   pattern: {collections.notes}/{noteId}
        - imageRef  pattern: {collections.gallery}/{noteId}/{galleryCollectionName}/{md5Hash}
        - Delete the imageRef and don't forget to assign the resulting promise to the `promise`
          variable
      */

      const noteRef = db.collection(collections.notes).doc(noteId);

      promise = db
        .runTransaction(t =>
          t
            .get(noteRef)
            .then(doc => doc.data())
            .then(note => {
              if (note.images) {
                delete note.images[md5Hash];
              }

              return t.update(noteRef, { images: note.images });
            })
        )
        .then(() => noteRef);
    }

    return promise;
  };
};
