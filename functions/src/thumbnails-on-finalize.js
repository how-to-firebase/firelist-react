const { fileMatchesUploadsPath, parseStorageEvent } = require('../utilities');
const GCS = require('@google-cloud/storage');
const { spawn } = require('child-process-promise');
const path = require('path');
const os = require('os');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;

module.exports = function({ admin, environment }) {
  const db = admin.firestore();
  const { paths, collections, googleCloud } = environment;
  const keyFilename = path.resolve(`${googleCloud.keyFilename}`);
  const gcs = GCS({ keyFilename });

  return event => {
    // Always return a promise from every Cloud Function
    let promise = Promise.resolve();

    if (fileMatchesUploadsPath({ event, environment })) {
      const {
        contentType,
        filename,
        folder,
        root,
        name,
        noteId,
        md5Hash,
        type,
      } = parseStorageEvent(event);
      const thumbnailName = [
        root,
        'thumbnails',
        noteId,
        '200x200',
        filename,
      ].join('/');
      const tempFolder = path.join(os.tmpdir(), noteId);
      const tempOriginalFilename = path.join(tempFolder, filename);
      const tempThumbnailFilename = path.join(
        tempFolder,
        `thumbnail-${filename}`
      );

      const bucket = gcs.bucket(event.bucket);
      const file = getFile(admin, event.name);
      const thumbnail = getFile(admin, thumbnailName);

      const metadata = {
        contentType: contentType,
        'Cache-Control': 'public,max-age=3600',
      };

      /* 
        CHALLENGE Cloud Functions
        - Save a noteRef and an imageRef
        - noteRef   pattern: {collections.notes}/{noteId}
        - imageRef  pattern: {collections.gallery}/{noteId}/{galleryCollectionName}/{md5Hash}
        - Delete the imageRef and don't forget to assign the resulting promise to the `promise`
          variable
      */

      const noteRef = db.collection(collections.notes).doc(noteId);

      // Download file and save to disk
      // Use imagemagick for the thumbnail
      // Save thumbnail
      const convertCmd =
        os.platform() == 'win32'
          ? path.join(
              'C:',
              'Program Files',
              'ImageMagick-6.9.9-Q16',
              'convert.exe'
            )
          : 'convert';
      promise = Promise.resolve()
        .then(() => fs.existsSync(tempFolder) || mkdir(tempFolder))
        .then(() => file.download({ destination: tempOriginalFilename }))
        .then(() =>
          spawn(convertCmd, [
            tempOriginalFilename,
            '-thumbnail',
            `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}`,
            tempThumbnailFilename,
          ])
        )
        .then(() =>
          bucket.upload(tempThumbnailFilename, {
            destination: thumbnailName,
            metadata,
          })
        )
        .then(() => unlink(tempOriginalFilename))
        .then(() => unlink(tempThumbnailFilename))
        .then(() =>
          thumbnail.getSignedUrl({
            action: 'read',
            expires: '01-01-2100',
          })
        )
        .then(([signedUrl]) =>
          db.runTransaction(t =>
            t.get(noteRef).then(doc => {
              const note = doc.data() || {};

              if (!note.images) {
                note.images = {};
              }

              if (!note.images[md5Hash]) {
                note.images[md5Hash] = {};
              }

              note.images[md5Hash].thumbnail = signedUrl;

              return t.set(noteRef, { images: note.images }, { merge: true });
            })
          )
        )
        .then(() => noteRef);
    }

    return promise;
  };
};

function getFile(admin, name) {
  return admin
    .storage()
    .bucket()
    .file(name);
}

function promisify(fn) {
  return function() {
    const args = [...arguments];
    return new Promise((resolve, reject) => {
      args.push((err, res) => (err ? reject(err) : resolve(res)));
      fn.apply({}, args);
    });
  };
}
