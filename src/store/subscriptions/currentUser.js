/* globals firebase */
export default store => {
  let laggedCurrentUser;
  let laggedMessagingToken;
  return store.subscribe(async () => {
    const { currentUser, environment, messagingToken } = store.getState();
    const now = new Date().toString();
    const updates = {};

    if (currentUser && currentUser != laggedCurrentUser) {
      updates.idToken = await currentUser.getIdToken();
    }

    if (
      currentUser &&
      messagingToken &&
      messagingToken != laggedMessagingToken
    ) {
      updates.idToken = await currentUser.getIdToken();
      updates.messagingToken = messagingToken;
    }

    laggedCurrentUser = currentUser;
    laggedMessagingToken = messagingToken;

    if (Object.keys(updates).length) {
      return firebase
        .database()
        .ref(`${environment.firebaseRoot}/userWriteable/userTokens/${currentUser.uid}`)
        .update(updates);
    }
  });
};
