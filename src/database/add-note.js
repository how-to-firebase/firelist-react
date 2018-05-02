/* globals firebase */
import { omitEmptyValues } from '../utilities';

/* 
  CHALLENGE Firestore
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/
const db = firebase.firestore();
const notesCollection = db.collection('notes');

export default async ({ title, description, currentUser }) => {
  const { displayName, photoURL, uid: owner } = currentUser;
  const note = omitEmptyValues({
    description,
    displayName,
    photoURL,
    title,
    owner,
  });

  /* 
    CHALLENGE Firestore
    - See https://firebase.google.com/docs/firestore/manage-data/add-data
    - Add the note to notesCollection with the .add() function
    - Add the photoURL to the note if it's not empty
    - Hint: While Firestore supports null values, it does not support undefined value
    -       It's preferred to store nothing at all instead of a null
  */

  return notesCollection.add(note);
};
