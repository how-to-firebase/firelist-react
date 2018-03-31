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
const store = devtools(createStore(defaultState));
const actions = store => rawActions;

const connectedActions = {};
for (let i in rawActions) {
  connectedActions[i] = store.action(rawActions[i]);
}

store.subscribe(() => {
  // console.log('state', store.getState());
  window.state = store.getState();
});

history.listen(args => console.log('args', args));

export { actions, connectedActions, store };
