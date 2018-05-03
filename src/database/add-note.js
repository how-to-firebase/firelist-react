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
  const note = { description, displayName, photoURL, title, owner };

  /* 
    CHALLENGE Firestore
    - See https://firebase.google.com/docs/firestore/manage-data/add-data
    - Use omitEmptyValues(note) to clear out undefined, null or '' values
    - Add the note to notesCollection with the .add(cleanNote) function
    - Hint: While Firestore supports null values, it does not support undefined values
    -       Also, it's generally preferred to store nothing at all instead of a null
  */
  const cleanNote = omitEmptyValues({
    description,
    displayName,
    photoURL,
    title,
    owner,
  });

  return notesCollection.add(cleanNote);
};
