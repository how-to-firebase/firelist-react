const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const { collections } = environment;
const UserTokensOnCreate = require('./user-tokens-on-create');
const decodedToken = require('../sample-data/decoded-token.json');
const db = admin.firestore();

describe('userTokensOnCreate', () => {
  let admin,
    doc,
    collection,
    context,
    set,
    snapshot,
    verifyIdToken,
    userRef,
    userTokens,
    userTokensOnCreate;

  beforeEach(() => {
    userTokens = {
      idToken: 123456,
      messagingToken: 7890123,
    };

    snapshot = {
      val: jest.fn(() => userTokens),
      ref: { remove: jest.fn() },
    };

    context = { params: { environment: 'test', uid: '123456' } };

    verifyIdToken = jest.fn(() => Promise.resolve(decodedToken));
    set = jest.fn(() => Promise.resolve());
    doc = jest.fn(() => ({ set }));
    collection = jest.fn(() => ({ doc }));

    admin = {
      auth: () => ({ verifyIdToken }),
      firestore: () => ({ collection }),
    };

    userTokensOnCreate = UserTokensOnCreate({ admin, environment });
  });

  beforeEach(done => {
    userTokensOnCreate(snapshot, context).then(() => done(), done.fail);
  });

  it('should get the correct collection', () => {
    expect(collection).toHaveBeenCalledWith(collections.users);
  });

  it('should get the correct doc', () => {
    expect(doc).toHaveBeenCalledWith(context.params.uid);
  });

  it('should set the user', () => {
    const user = Object.assign(decodedToken, {
      environment: context.params.environment,
      messagingToken: userTokens.messagingToken,
    });
    expect(set).toHaveBeenCalledWith(user);
  });

  it('should have removed the ref', () => {
    expect(snapshot.ref.remove).toHaveBeenCalledTimes(1);
  });
});
