/* globals firebase */
import { deleteEmptyValues } from '../utilities';

/* 
  CHALLENGE Firestore 10
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/


export default async (noteId, updates) => {
  const cleanUpdates = deleteEmptyValues(updates);

  /* 
    CHALLENGE Firestore 11
    - See https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
    - Get the doc ref from notesCollection using the noteId
    - Update the doc with the .update() function
    - Don't forget to use cleanUpdates :)
    - Application:  This `updateNote` function is consumed in a few places throughout the app.
                    The primary place where `updateNote` is critical is in 
                    src/components/views/note-view.js:161
                    ...but search the codebase for 'updateNote' to see the other use cases.
                    The way to test that `updateNote` is working is to create a note in the app and 
                    then click on the note's card to enter the note's detail view. Try editing and 
                    saving some changes to a note. Then reload the page to see if the changes 
                    stuck. You can also check your Firestore database to see the date change.
  */

  
};
