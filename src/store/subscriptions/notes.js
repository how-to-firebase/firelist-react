import { getNotesObservable } from '../../database';

export default (store, { setNotes }) => {
  let subscription;
  return store.subscribe(async () => {
    const { currentUser } = store.getState();

    if (currentUser && !subscription) {
      // Handle user log in

      /* 
        CHALLENGE Firestore 06
        - The following function is already completed and this challenge exists for review purposes
        - Feel free to delete line 29 and rewrite it yourself...
          ...but it's application-specific logic that's not core to your understanding of Firestore
        - Use getNotesObservable(currentUser) to get the observable and subscribe to it
        - Call setNotes(notes) in the subscribe callback
        - Hint: Make sure to save the subscription to the 'subscription' variable from line 4.
                The next `if` block handles unsubscripitions, and it needs the subscription
                object to unsubscribe.
        - Application:  This `notes` function subscribes to the app's data store.
                        If there's a logged-in user (currentUser is not null) and there is no
                        existing 'notes' subscription, this function creates the subscription.
                        This function re-evaluates every time that the app's data store updates.
                        If the user logs out (currentUser becomes null) and there's an existing
                        subscription, it will cancel that subscription on line 46.
                        
      */
      subscription = getNotesObservable(currentUser).subscribe(notes => setNotes(notes));
    } else if (!currentUser && subscription) {
      // Handle user log out

      /* 
        HINT
        The order of the following lines of code is critical! 
        Messing it up will create an infinite loop.
        The subscription must me set to null (or false or undefined... it just needs a falsy value)
        before calling setNotes()... 
        because setNotes() will cause a store update... 
        and since this function is  subscribed to the store's updates, 
        setNotes() will effectively call this function again.
        So if you don't set `subscription` to a falsy value, setNotes() will trigger an infinite 
        loop!
      */

      subscription.unsubscribe();
      subscription = null;
      setNotes();
    }
  });
};
