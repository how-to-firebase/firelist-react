/* globals firebase */
import { Observable } from 'rxjs';
import { mapDocs } from '../utilities';

/* 
  CHALLENGE Firestore 04
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/


export default ({ uid }) => {
  return Observable.create(observer => {
    /* 
      CHALLENGE Firestore 05
      - See https://firebase.google.com/docs/firestore/query-data/listen
      - See http://reactivex.io/rxjs/manual/overview.html#observable
      - Listen to notesCollection with onSnapshot
      - Use a Firestore where query to only request notes where owner == uid
      - Pass snapshot.docs into mapDocs() to map the docs to a more useful data shape
      - Call observer.next with the result of mapDocs
      - Hint: Make sure to return onSnapshot's unsubscribe function from this function.
              RxJs takes whatever function you return from Observable.create and uses it as the
              observable's 'unsubscribe' function.
      - Application:  `getNotesObservable` is used in src/store/subscriptions/notes.js:29
                    Once you've finished `getNotesObservable`, the notes data will flow into
                    notes.js and you'll be able to see your notes in the app. 
    */
    
  });
};
