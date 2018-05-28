/* globals firebase */
import { Observable } from 'rxjs';
import { mapDocs, slugifyEmail } from '../utilities';

/* 
  CHALLENGE Firestore 14
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/


export default ({ email }) => {
  const emailSlug = slugifyEmail(email);
  const lowercaseEmail = email.toLowerCase();
  const collaboratorPath = `collaborators.${emailSlug}`;


  return Observable.create(observer => {
    /* 
      CHALLENGE Firestore 15
      - See https://firebase.google.com/docs/firestore/query-data/listen
      - See http://reactivex.io/rxjs/manual/overview.html#observable
      - See https://firebase.google.com/docs/firestore/solutions/arrays
      - Listen to notesCollection with onSnapshot
      - Use a Firestore where query to only request notes where collaboratorPath == lowercaseEmail
      - Pass snapshot.docs into mapDocs() to map the docs to a more useful data shape
      - Call observer.next with the result of mapDocs
      - Hint: Make sure to return onSnapshot's unsubscribe function from this function.
              RxJs takes whatever function you return from Observable.create and uses it as the
              observable's 'unsubscribe' function.
      - Application:  This `getCollaborativeNotesObservable` function is consumed in  
                      src/store/subscriptions/collaborative-notes.js:29
                      This function powers note sharing. If you want to share notes, you'll need to 
                      log in under different Google accounts and attempt to share notes between 
                      those accounts. You'll need multiple Google accounts to make this happen. If 
                      you don't have multiple accounts--and don't want to create another Google 
                      account just for this exercise--then you won't be able to test that this is 
                      working. If you do have multiple Google accounts, then edit a note and add 
                      your other Google email as a collaborator. Then log in as the second google 
                      account and check to see if your note shows up on the notes page.
    */
    
  });
};
