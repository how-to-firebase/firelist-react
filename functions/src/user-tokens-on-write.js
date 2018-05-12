module.exports = function({ admin, environment }) {
  const { collections } = environment;

  return (snapshot, context) => {
    const { environment, uid } = context.params;
    const { idToken, messagingToken } = snapshot.val();
    const lastLogin = new Date().toString();
    const userRef = admin
      .firestore()
      .ref(collection.users)
      .doc(uid);

    return admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        console.log('decodedToken', JSON.stringify(decodedToken));
        const user = Object.assign(decodedToken, {
          environment,
          lastLogin,
          messagingToken,
        });
        
        return userRef.set(user);
      })
      .then(() => snapshot.ref.remove());
  };
};
