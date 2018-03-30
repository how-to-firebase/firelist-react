import createStore from 'unistore';
import * as rawActions from './actions';

const defaultState = {
  currentUser: null,
};
const store = createStore(defaultState);
const actions = store => rawActions;

store.subscribe(() => {
  console.log('state', store.getState());
});

export { actions, store };
