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
        - Save a noteRef
        - noteRef   pattern: {collections.notes}/{noteId}
        - Use db.runTransaction(t => {...}) to start a transaction
        - Don't forget to assign the result of db.runTransaction to the `promise` variable
        - Use the transaction object to get the noteRef
        - Pull the note data into a variable and delete note.images[md5Hash]
        - Use the transaction to update the noteRef with the new images object
        - Return the noteRef in the transactions's .then() callback for testing purposes
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
