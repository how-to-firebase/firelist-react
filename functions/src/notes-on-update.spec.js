const admin = require('../utilities/dev-admin');
const environment = require('../environments/environment.dev.json');
const NotesOnUpdate = require('./notes-on-update');
const { collections } = environment;
const db = admin.firestore();
const notesRef = db.collection(collections.users);

describe('notesOnUpdate', () => {
  const userOne = {
    emailSlug: 'one|gmail|com',
    email: 'one@gmail.com',
    messagingToken: 'one',
  };
  const userTwo = {
    emailSlug: 'two|gmail|com',
    email: 'two@gmail.com',
    messagingToken: 'two',
  };
  const userThree = {
    emailSlug: 'three|gmail|com',
    email: 'three@gmail.com',
    messagingToken: 'three',
  };
  const noteId = '123456';

  beforeAll(done => {
    const batch = db.batch();

    batch.set(notesRef.doc(userOne.emailSlug), userOne);
    batch.set(notesRef.doc(userTwo.emailSlug), userTwo);
    batch.set(notesRef.doc(userThree.emailSlug), userThree);
    batch.commit().then(() => done(), done.fail);
  });

  let notesOnUpdate, newNote, oldNote, change, context;

  beforeAll(() => {
    newNote = {
      title: 'new note',
      collaborators: {
        [userOne.emailSlug]: userOne.email,
        [userTwo.emailSlug]: userTwo.email,
      },
    };
    oldNote = {
      collaborators: {
        [userOne.emailSlug]: userOne.email,
        [userThree.emailSlug]: userThree.email,
      },
    };

    change = {
      after: {
        data: () => newNote,
      },
      before: {
        data: () => oldNote,
      },
    };

    context = {
      params: { noteId },
    };

    notesOnUpdate = NotesOnUpdate({ admin, environment });
  });

  let results;
  beforeAll(done => {
    notesOnUpdate(change, context).then(res => {
      results = res;
      done();
    }, done.fail);
  });

  it('should return two results', () => {
    expect(results.length).toEqual(2);
  });

  it('should return two errors', () => {
    expect(results[0].result instanceof Error).toEqual(true);
    expect(results[1].result instanceof Error).toEqual(true);
  });
});
