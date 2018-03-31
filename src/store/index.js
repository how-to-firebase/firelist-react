/* globals firebase */
import createStore from 'unistore';
import devtools from 'unistore/devtools';
import * as rawActions from './actions';

const currentUser =
  (firebase.apps.length && firebase.auth().currentUser) || null;
const defaultState = {
  currentUser,
  drawerOpen: false,
};
let store = createStore(defaultState);

if (true) {
  store = devtools(store);
}
const actions = store => rawActions;

const connectedActions = {};
for (let i in rawActions) {
  connectedActions[i] = store.action(rawActions[i]);
}

store.subscribe(() => {
  // console.log('state', store.getState());
  window.state = store.getState();
});

export { actions, connectedActions, store };
