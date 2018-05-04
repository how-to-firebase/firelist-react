const admin = require('firebase-admin');
const environment = require('./environments/environment.json');
const functions = require('firebase-functions');

admin.initializeApp();

/* 
  CHALLENGE Cloud Functions
  - Read and understand the following code carefully.
    We're using a dependency injection pattern, because our functions must be 100% testable.
    Our dependencies are the `admin` and `environment` variables. 
    Each function is a higher-order function that returns the actual function that Cloud Functions
    will run. The higher-order function takes all of the config that the inner function needs.
    So UploadsOnFinalize needs a config object that looks like { admin, environment }. 
    It can then return uploadsOnFinalize, which is the fully-initialized function that we'll
    pass to Cloud Functions with the .onFinalize method.
*/

// uploads-on-finalize
const UploadsOnFinalize = require('./src/uploads-on-finalize');
const uploadsOnFinalize = UploadsOnFinalize({ admin, environment });
exports.uploadsOnFinalize = functions.storage
  .object()
  .onFinalize(uploadsOnFinalize);

// uploads-on-delete
const UploadsOnDelete = require('./src/uploads-on-delete');
const uploadsOnDelete = UploadsOnDelete({ admin, environment });
exports.uploadsOnDelete = functions.storage
  .object()
  .onFinalize(uploadsOnDelete);
