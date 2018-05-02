/* globals firebase */
import { deleteEmptyValues } from '../utilities';

/* 
  CHALLENGE Firestore
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/
const db = firebase.firestore();
const notesCollection = db.collection('notes');

export default async (noteId, updates) => {
  const cleanUpdates = deleteEmptyValues(updates);

  /* 
    CHALLENGE Firestore
    - See https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
    - Get the doc ref from notesCollection using the noteId
    - Update the doc with the .update() function
    - Don't forget to use cleanUpdate :)
  */

  return notesCollection.doc(noteId).update(cleanUpdates);
};
