/* globals firebase */
import { Observable } from 'rxjs';
import { formatDoc } from '../utilities';

/* 
  CHALLENGE Firestore 07
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/
const db = firebase.firestore();
const notesCollection = db.collection('notes');

export default noteId => {
  /* 
    CHALLENGE Firestore 08
    - Create a reference to the doc specified by noteId
  */
  const docRef = notesCollection.doc(noteId);
  return Observable.create(observer => {
    /* 
      CHALLENGE Firestore 09
      - See https://firebase.google.com/docs/firestore/query-data/listen
      - See http://reactivex.io/rxjs/manual/overview.html#observable
      - Listen to notesCollection with onSnapshot
      - Pass doc into formatDoc() to format the doc to a more useful data shape
      - Call observer.next with the result of formatDoc
      - Hint: Make sure to return onSnapshot's unsubscribe function from this function.
              RxJs takes whatever function you return from Observable.create and uses it as the
              observable's 'unsubscribe' function.
      - Application:  This `getNoteObservable` function is consumed in  
                      src/components/views/note-view.js:86 
                      If you can reach a note detail view and see data, then this function is 
                      working.
      
    */
    const unsubscribe = docRef.onSnapshot(doc => {
      const docData = formatDoc(doc);

      observer.next(docData);
    });
    return unsubscribe;
  });
};
