/* globals firebase environment */
import createStore from 'unistore';
import devtools from 'unistore/devtools';
import * as rawActions from './actions';
import * as subscriptions from './subscriptions';

const currentUser =
  (typeof firebase != 'undefined' &&
    firebase.apps.length &&
    firebase.auth().currentUser) ||
  null;
const defaultState = {
  currentUser,
  drawerOpen: false,
  messagingToken: null,
  notes: [],
};
let store = createStore(defaultState);

if (environment.isDevelopment) {
  store = devtools(store);
}
const actions = store => rawActions;

const connectedActions = {};
for (let i in rawActions) {
  connectedActions[i] = store.action(rawActions[i]);
}

for (let i in subscriptions) {
  subscriptions[i](store, connectedActions);
}

store.subscribe(() => {
  window.state = store.getState();
});

export { actions, connectedActions, store };
