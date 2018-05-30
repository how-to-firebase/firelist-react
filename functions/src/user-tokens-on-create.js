const { omitEmptyValues, slugifyEmail } = require('../utilities');

module.exports = function({ admin, environment }) {
  const { collections } = environment;

  return (snapshot, context) => {
    const { environment, uid } = context.params;
    const { idToken, messagingToken } = snapshot.val();
    const userRef = admin
      .firestore()
      .collection(collections.users)
      .doc(uid);

    /* 
      CHALLENGE Functions 01
      - See https://firebase.google.com/docs/auth/admin/verify-id-tokens
      - Use admin.auth().verifyIdToken(idToken) to retrieve the decodedToken
      - Use getUserObject(decodedToken, environment, messagingToken) to get the user object
      - Set userRef to the user object
      - Remove the snapshot with snapshot.ref.remove()
    */

    return admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        const user = getUserObject(decodedToken, environment, messagingToken);

        return userRef.set(user, { merge: true });
      })
      .then(() => snapshot.ref.remove());
  };
};

function getUserObject(decodedToken, environment, messagingToken) {
  const emailSlug = slugifyEmail(decodedToken.email);

  const customAttributes = omitEmptyValues({
    emailSlug,
    environment,
    messagingToken,
  });
  return Object.assign(decodedToken, customAttributes);
}
