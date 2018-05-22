/* globals firebase */
import { setUserTokens } from '../database';
const messaging = firebase.messaging();

export default async ({ currentUser, environment }) => {
  
  let messagingToken;
  try {
    /* 
      CHALLENGE Messaging
      - See https://firebase.google.com/docs/cloud-messaging/js/client
      - Request permission to send a message inside a try/catch
      - Use `await` to wait for the messaging.requestPermission() result
      - If permission is blocked, the await will throw an error, so log the error in the catch block
      - If permission is granted, get the messagingToken using messaging.getToken().
      - Again, don't forget to use `await`.
    */
    
    await setUserTokens({ currentUser, environment, messagingToken });
  } catch (e) {
    alert(
      'Unblock notifications to enable. See https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=en'
    );
  }

  return messagingToken;
};
