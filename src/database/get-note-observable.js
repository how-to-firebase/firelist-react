/* globals firebase */
import { Observable } from 'rxjs';
import { formatDoc } from '../utilities';

/* 
  CHALLENGE Firestore
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to notesCollection
  - Hint: It's just a collection under the name 'notes'
*/
const db = firebase.firestore();
const notesCollection = db.collection('notes');

export default noteId => {
  /* 
    CHALLENGE Firestore
    - Create a reference to the doc specified by noteId
  */
  const docRef = notesCollection.doc(noteId);

  return Observable.create(observer => {
    /* 
      CHALLENGE Firestore
      - See https://firebase.google.com/docs/firestore/query-data/listen
      - See http://reactivex.io/rxjs/manual/overview.html#observable
      - Listen to docRef with onSnapshot
      - Pass the resulting doc into formatDoc() to format the doc to a more useful data shape
      - Call observer.next with the result of formatDoc
      - Hint: Make sure to return onSnapshot's unsubscribe function from this function.
              RxJs takes whatever function you return from Observable.create and uses it as the
              observable's 'unsubscribe' function.
    */
    const unsubscribe = docRef.onSnapshot(doc => {
      const docData = formatDoc(doc);

      observer.next(docData);
    });
    return unsubscribe;
  });
};
