/* globals firebase */
import { setUserTokens } from '../database';
const messaging = firebase.messaging();

export default async ({ currentUser, environment }) => {
  /* 
    CHALLENGE Messaging 02
    - Call setUserTokens({ currentUser, environment, messagingToken });
    - messagingToken should be the boolean `false`
  */

  return setUserTokens({
    currentUser,
    environment,
    messagingToken: false,
  });
};
