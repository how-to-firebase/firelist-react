const { fileMatchesUploadsPath, parseStorageEvent } = require('../utilities');
const GCS = require('@google-cloud/storage');
const { spawn } = require('child-process-promise');
const path = require('path');
const os = require('os');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const THUMB_MAX_HEIGHT = 250;
const THUMB_MAX_WIDTH = 250;
const widthXHeight = `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}`;

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
        widthXHeight,
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
        CHALLENGE Functions
        - Read the following code if you're interested in how to transcode images with Functions
        - The 'convert' command from ImageMagick is installed on all Cloud Functions instances
        - Using ImageMagick with Windows can be tricky, hence the convertCmd variable :)
        - Otherwise, the pattern is simple enough, even if the code is ugly...  
          1. Make sure that there's a tempFolder
          2. Download the original image file to the tempFolder
          3. Spawn a new process to run the ImageMagick thumbnail conversion
             `convert temp/folder/original.jpg -thumbnail '250x250' temp/folder/thumbnail.jpg`
          4. Upload the thumbnail to the Cloud Storage bucket in a new 'thumbnails' folder
          5. Delete the images from tempFolder
          6. Get a signed url from Cloud Storage for the thumbnail
          7. Use a Firestore transaction to add the thumbnail url to the note object
        - I take it back... that was a lot. Some problems are just messy at their core :(
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
          : 'convert'; // Developing on Windows is causing some trouble :)
      promise = Promise.resolve()
        .then(() => fs.existsSync(tempFolder) || mkdir(tempFolder))
        .then(() => file.download({ destination: tempOriginalFilename }))
        .then(() =>
          spawn(convertCmd, [
            tempOriginalFilename,
            '-thumbnail',
            widthXHeight,
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
