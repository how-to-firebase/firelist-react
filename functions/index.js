const admin = require('firebase-admin');
const environment = require('./environments/environment.json');
const functions = require('firebase-functions');

admin.initializeApp();

const {
  NotesOnUpdate,
  ThumbnailsOnFinalize,
  ThumbnailsOnDelete,
  UploadsOnFinalize,
  UploadsOnDelete,
  UserTokensOnCreate,
} = require('./src');
const context = { admin, environment };

/* 
  CHALLENGE Functions
  - Read and understand the following code carefully.
    We're using a dependency injection pattern, because our functions must be 100% testable.
    Our dependencies are the `admin` and `environment` variables which are combined into `context`. 
    Each function is a higher-order function that returns the actual function that Cloud Functions
    will run. The higher-order function takes all of the context that the inner function needs.
    So UploadsOnFinalize needs a context object that looks like { admin, environment }. 
    It can then return uploadsOnFinalize, which is the fully-initialized function that we'll
    pass to Cloud Functions with the .onFinalize method.
*/

// thumbnails-on-delete
const notesOnUpdate = NotesOnUpdate(context);
exports.notesOnUpdate = functions.firestore
  .document('notes/{noteId}')
  .onUpdate(notesOnUpdate);

// thumbnails-on-delete
const thumbnailsOnDelete = ThumbnailsOnDelete(context);
exports.thumbnailsOnDelete = functions.storage
  .object()
  .onDelete(thumbnailsOnDelete);

// thumbnails-on-finalize
const thumbnailsOnFinalize = ThumbnailsOnFinalize(context);
exports.thumbnailsOnFinalize = functions.storage
  .object()
  .onFinalize(thumbnailsOnFinalize);

// uploads-on-finalize
const uploadsOnFinalize = UploadsOnFinalize(context);
exports.uploadsOnFinalize = functions.storage
  .object()
  .onFinalize(uploadsOnFinalize);

// uploads-on-delete
const uploadsOnDelete = UploadsOnDelete(context);
exports.uploadsOnDelete = functions.storage.object().onDelete(uploadsOnDelete);

// user-tokens-on-create
const userTokensOnCreate = UserTokensOnCreate(context);
exports.userTokensOnCreate = functions.database
  .ref('{environment}/userWriteable/userTokens/{uid}')
  .onCreate(userTokensOnCreate);
