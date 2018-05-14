/* globals firebase environment */
import { omitEmptyValues } from '../utilities';

/* 
  CHALLENGE Realtime DB
  - See 
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/
const db = firebase.database();

export default async ({ environment, messagingToken, currentUser }) => {
  const { uid } = currentUser;
  const idToken = await currentUser.getIdToken()
  const userTokensRef = db
    .ref(environment.firebaseRoot)
    .child('userWriteable/userTokens')
    .child(currentUser.uid);

  /* 
    CHALLENGE Realtime DB
    - See 
    - Use omitEmptyValues(note) to clear out undefined, null or '' values
    - Add the note to notesCollection with the .add(cleanNote) function
    - Hint: While Firestore supports null values, it does not support undefined values
    -       Also, it's generally preferred to store nothing at all instead of a null
  */
  const userTokens = omitEmptyValues({
    idToken,
    messagingToken,
  });

  return userTokensRef.set(userTokens);
};
