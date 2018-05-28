/* globals firebase */
import { Observable } from 'rxjs';
import { formatDoc } from '../utilities';

/* 
  CHALLENGE Firestore 17
  - See https://firebase.google.com/docs/firestore/quickstart
  - Create a reference to usersCollection
  - Hint: It's just a collection under the name 'users'
*/

export default uid => {
  /* 
    CHALLENGE Firestore 18
    - Create a reference to the doc specified by uid
  */
  
  return Observable.create(observer => {
    /* 
      CHALLENGE Firestore 19
      - See https://firebase.google.com/docs/firestore/query-data/listen
      - See http://reactivex.io/rxjs/manual/overview.html#observable
      - Listen to usersCollection with onSnapshot
      - Pass doc into formatDoc() to format the doc to a more useful data shape
      - Call observer.next with the result of formatDoc
      - Hint: Make sure to return onSnapshot's unsubscribe function from this function.
              RxJs takes whatever function you return from Observable.create and uses it as the
              observable's 'unsubscribe' function.
      - Application:  This `getUserObservable` function is consumed in  
                      src/components/view/account-view.js:43
                      You won't have any user account data quite yet, because that data will be created in the Cloud Functions module. Go ahead and complete this function now and we'll circle back to confirm that it's working once we have user data flowing through our app. This is one of those chicken-and-egg scenarios where two parts of the app are interdependent... so we have to stub one part out, finish the second part, and then return to the stubbed code to make our fixes. If you write code here and it doesn't throw errors, then congratulations! You're done for now :)
    */
    
    
  });
};
