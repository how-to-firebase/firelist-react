/* globals firebase */
import { Observable } from 'rxjs';
import { mapDocs, slugifyEmail } from '../utilities';

/* 
  CHALLENGE Firestore
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
      CHALLENGE Firestore
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
    */
    
  });
};
