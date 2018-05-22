/* globals firebase environment */
import { omitEmptyValues } from '../utilities';

const db = firebase.database();

export default async ({ environment, messagingToken, currentUser }) => {
  const { uid } = currentUser;
  const idToken = await currentUser.getIdToken()
  
  /* 
    CHALLENGE Realtime DB
    - See https://firebase.google.com/docs/database/web/start
    - Create a userTokensRef with the path 
      `${environment.firebaseRoot}/userWriteable/userTokens/${currentUser.uid}`
    - Create a userTokens variable with the data shape of { idToken, messagingToken }
    - Use omitEmptyValues({ idToken, messagingToken }) to clear out undefined, null or '' values
    - Set userTokensRef to the new userTokens object
    - Hint: Firebase does not like null values :)
      Keep your data "sparse"... don't try to save empty data.
  */

};
