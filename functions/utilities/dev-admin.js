const admin = require('firebase-admin');
const environment = require('../environments/environment.dev.json');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: environment.firebase.databaseURL,
});

module.exports = admin;
