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
        CHALLENGE Functions 02
        - Save a noteRef
        - noteRef   pattern: {collections.notes}/{noteId}
        - Get the noteRef record and pull off the `images` attribute
        - Don't forget to assign the result of the promise chain to the `promise` variable
        - Add the image to the `images` object with the md5Hash as the key
        - The image data shape is { downloadURL, filename, name, size }
        - Update the noteRef with the new images object using noteRef.set with { merge: true }
        - Return noteRef in the .then callback for testing purposes
        - Note: Using noteRef.set with the { merge: true } option is what's called an 'upsert'
                Upserts are often preferred, because they update or insert new data.
                The .set operation without { merge: true } will overwrite the entire object.
                The .update operation fails if the object already exists.
                The beauty of an upsert is that it never fails :)
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
