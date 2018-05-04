const MAX_BATCH = 3;

module.exports = ({ db, collections }) => {
  return getAllRefs({ ref: db, collections }).then(refs => {
    const refsToDelete = refs.slice(0);
    const batches = [];

    while (refsToDelete.length) {
      const batch = refsToDelete.splice(0, MAX_BATCH);
      batches.push(batch);
    }

    return deleteBatches(db, batches).then(() => refs);
  });
};

function getAllRefs({ ref, collections }) {
  const collectionsToDelete = collections.slice(0);
  const next = collectionsToDelete.shift();
  const refs = [];
  let promise = Promise.resolve();

  if (next) {
    const nextRef = ref.collection(next);
    promise = nextRef.get().then(snapshot => {
      return Promise.all(
        (snapshot.docs || []).map(doc => {
          refs.push(doc.ref);
          return getAllRefs({
            ref: doc.ref,
            collections: collectionsToDelete,
          }).then(subCollectionRefs =>
            subCollectionRefs.map(ref => refs.push(ref))
          );
        })
      );
    });
  }

  return promise.then(() => refs);
}

function deleteBatches(db, batches) {
  const batchesToDelete = batches.slice(0);
  let promise = Promise.resolve();
  if (batchesToDelete.length) {
    const refs = batchesToDelete.pop();
    const batch = db.batch();
    refs.forEach(ref => batch.delete(ref));
    promise = batch
      .commit()
      .then(
        () =>
          batchesToDelete.length ? deleteBatches(db, batchesToDelete) : true
      );
  }

  return promise;
}
