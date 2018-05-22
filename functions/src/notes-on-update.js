const { setDifference } = require('../utilities');

module.exports = function({ admin, environment }) {
  const { collections } = environment;
  const usersCollection = admin.firestore().collection(collections.users);

  /* 
    CHALLENGE Functions
    - Read the following code if you'd like to learn how to handle a .onUpdate event
    - The first event argument is `change` with `change.after` and `change.before`
    - Most of this code is application-specific logic... so it's not critical to understand
      Just know that you can easily compare Firestore changes and respond accordingly
  */

  return (change, context) => {
    const newNote = change.after.data();
    const oldNote = change.before.data();

    const newSlugs = getSlugs(newNote);
    const oldSlugs = getSlugs(oldNote);

    const slugsAdded = setDifference(newSlugs, oldSlugs);
    const slugsRemoved = setDifference(oldSlugs, newSlugs);

    const note = {
      noteId: context.params.noteId,
      title: newNote.title,
    };
    let promise = Promise.resolve([]);

    if (slugsAdded.size) {
      const payload = Object.assign(note, {
        message: `You've been added to "${newNote.title}"`,
      });

      promise = promise
        .then(() => getUsersByEmailSlugs(slugsAdded, usersCollection))
        .then(users => sendMessages(users, payload, admin));
    }

    if (slugsRemoved.size) {
      const payload = Object.assign(note, {
        message: `You've been removed from "${newNote.title}"`,
      });

      let results = [];

      promise = promise
        .then(
          intermediateResults => (results = results.concat(intermediateResults))
        )
        .then(() => getUsersByEmailSlugs(slugsRemoved, usersCollection))
        .then(users => sendMessages(users, payload, admin))
        .then(
          intermediateResults => (results = results.concat(intermediateResults))
        );
    }

    return promise;
  };
};

function getSlugs(note) {
  const collaborators = note.collaborators || {};
  return new Set(Object.keys(collaborators));
}

function getUsersByEmailSlugs(emailSlugs, usersCollection) {
  const slugsArray = Array.from(emailSlugs);

  return Promise.all(
    slugsArray.map(slug => usersCollection.where('emailSlug', '==', slug).get())
  ).then(snapshots =>
    snapshots.reduce((users, snapshot) => {
      snapshot.forEach(doc => users.push(formatDoc(doc)));
      return users;
    }, [])
  );
}

function formatDoc(doc) {
  return Object.assign(doc.data(), { __id: doc.id });
}

function sendMessages(users, data, admin) {
  const messaging = admin.messaging();
  const usersWithTokens = users.filter(user => !!user.messagingToken);

  /* 
    CHALLENGE Messaging
    - Note how easy it is to send a messaging using admin.messaging() from line 86
    - Lines 100-103 show that you merely call messaging.send({ token, data })
    - The only trick is that you need a valid token
    - You can structure the data object however you like... just make sure to keep it under 4kb!
      https://firebase.google.com/docs/cloud-messaging/concept-options
  */

  return Promise.all(
    usersWithTokens.map(({ email, messagingToken: token }) =>
      messaging
        .send({ token, data })
        .catch(error => error)
        .then(result => ({ result, email, token }))
    )
  );
}
