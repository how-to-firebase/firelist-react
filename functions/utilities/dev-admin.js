const admin = require('firebase-admin');
const environment = require('../environments/environment.dev.json');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  ...environment.firebase,
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
