/* globals firebase */
import { omitEmptyValues } from '../utilities';

/* 
  CHALLENGE Firestore 02
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/


export default async ({ title, description, currentUser }) => {
  const { displayName, email, photoURL, uid: owner } = currentUser;
  const note = { description, displayName, photoURL, title, owner };

  /* 
    CHALLENGE Firestore 03
    - See https://firebase.google.com/docs/firestore/manage-data/add-data
    - Use omitEmptyValues(note) to clear out undefined, null or '' values
    - Add the cleaned up note to notesCollection with the .add(cleanNote) function
    - Hint: While Firestore supports null values, it does not support undefined values
    -       Also, it's generally preferred to store nothing at all instead of a null
    - Application:  The `addNote` function is used in src/components/views/note-add-view.js:56
                    It takes a title, description and currentUser object and creates a note.
                    Once this challenge is complete, you'll be able to add notes to Firestore.
                    Try adding a note and check your Firestore database to see the data flow in!
  */
  
};
