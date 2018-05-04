const { recursiveDelete } = require('.');
const admin = require('./dev-admin');
const collections = ['one', 'two', 'three', 'four'];
const db = admin.firestore();

describe('recursiveDelete', () => {
  let refs;
  beforeAll(done => {
    refs = collections.reduce(
      ({ refs, ref }, collectionName) => {
        const refToCreate = ref.collection(collectionName);

        return {
          refs: refs.concat(refToCreate),
          ref: refToCreate.doc('doc-one'),
        };
      },
      { refs: [], ref: db }
    ).refs;
    const batch = db.batch();

    refs.forEach(ref => {
      batch.set(ref.doc('doc-one'), { yes: 1 });
      batch.set(ref.doc('doc-two'), { no: 2 });
    });

    batch.commit().then(() => done());
  });

  it('should delete everything', done => {
    recursiveDelete({
      db,
      collections: ['one', 'two', 'three', 'four'],
    }).then(refs => {
      expect(refs.length).toEqual(8);
      done();
    }, done.fail);
  });
});
