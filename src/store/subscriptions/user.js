/* globals firebase environment */
import messaging from '../../components/messaging/messaging';

export default store => {
  let laggedCurrentUser;
  let laggedMessagingToken;
  return store.subscribe(() => {
    const { currentUser, messagingToken } = store.getState();
    const updates = {};

    if (currentUser && currentUser != laggedCurrentUser) {
      updates.displayName = currentUser.displayName;
      updates.email = currentUser.email;
      updates.emailVerified = currentUser.emailVerified;
      updates.photoURL = currentUser.photoURL;
      updates.phoneNumber = currentUser.phoneNumber;
      updates.uid = currentUser.uid;
    }

    if (
      currentUser &&
      messagingToken &&
      messagingToken != laggedMessagingToken
    ) {
      updates.messagingToken = messagingToken;
    }

    laggedCurrentUser = currentUser;
    laggedMessagingToken = messagingToken;

    if (Object.keys(updates).length) {
      firebase
        .database()
        .ref(`${environment.firebaseRoot}/users/${currentUser.uid}`)
        .update(updates);
    }
  });
};
