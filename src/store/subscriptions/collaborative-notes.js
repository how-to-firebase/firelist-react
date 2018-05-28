import { getCollaborativeNotesObservable } from '../../database';

export default (store, { setCollaborativeNotes }) => {
  let subscription;
  return store.subscribe(async () => {
    const { currentUser } = store.getState();

    if (currentUser && !subscription) {
      // Handle user log in

      /* 
        CHALLENGE Firestore 16
        - The following function is already completed and this challenge exists for review purposes
        - Feel free to delete line 29 and rewrite it yourself...
          ...but it's application-specific logic that's not core to your understanding of Firestore
        - Use getCollaborativeNotesObservable(currentUser) to get the observable and subscribe to it
        - Call setCollaborativeNotes(notes) in the subscribe callback
        - Hint: Make sure to save the subscription to the 'subscription' variable from line 4.
                The next `if` block handles unsubscripitions, and it needs the subscription
                object to unsubscribe.
        - Application:  This `collaborativeNotes` function subscribes to the app's data store.
                        If there's a logged-in user (currentUser is not null) and there is no
                        existing 'collaborativeNotes' subscription, this function creates the 
                        subscription.
                        This function re-evaluates every time that the app's data store updates.
                        If the user logs out (currentUser becomes null) and there's an existing
                        subscription, it will cancel that subscription on line 48.
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
