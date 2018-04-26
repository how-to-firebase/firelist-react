/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js'
);
importScripts('/environments/environment.js');

firebase.initializeApp(environment.firebase);

var messaging = firebase.messaging();

console.log('sw initialized');

messaging.setBackgroundMessageHandler(function(payload) {
  const { message: body } = payload.data;
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body,
    icon:
      'https://cdn.glitch.com/ab6d28c0-aafb-4f4c-a385-096869db91d7%2Flogo-logomark.png?1521808882093',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
