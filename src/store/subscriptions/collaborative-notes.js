import { getCollaborativeNotesObservable } from '../../database';

export default (store, { setCollaborativeNotes }) => {
  let subscription;
  return store.subscribe(async () => {
    const { currentUser } = store.getState();

    if (currentUser && !subscription) {
      // Handle user log in

      /* 
        CHALLENGE Firestore
        - Use getCollaborativeNotesObservable(currentUser) to get the observable and subscribe to it
        - Call setCollaborativeNotes(notes) in the subscribe callback
        - Hint: Make sure to save the subscription to the 'subscription' variable from line 4.
                The next `if` block handles unsubscripitions, and it needs the subscription
                object to unsubscribe.
      */
      subscription = getCollaborativeNotesObservable(currentUser).subscribe(
        notes => setCollaborativeNotes(notes)
      );
    } else if (!currentUser && subscription) {
      // Handle user log out

      /* 
        HINT
        The order of the following lines of code is critical! 
        Messing it up will create an infinite loop.
        The subscription must me set to null (or false or undefined... it just needs a falsy value)
        before calling setCollaborativeNotes()... 
        because setCollaborativeNotes() will cause a store update... 
        and since this function is  subscribed to the store's updates, 
        setCollaborativeNotes() will effectively call this function again.
        So if you don't set `subscription` to a falsy value, setCollaborativeNotes() will trigger an infinite 
        loop!
      */

      subscription.unsubscribe();
      subscription = null;
      setCollaborativeNotes();
    }
  });
};
