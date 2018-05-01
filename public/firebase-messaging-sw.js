/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js'
);
importScripts('/environments/environment.js');

firebase.initializeApp(environment.firebase);

var messaging = firebase.messaging();

// Messaging
console.log('firebase-messaging-sw.js initialized');
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

// Establish cache
const CACHE_NAME = 'firelist-react-v0.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/environments/environment.js',
];
self.addEventListener('install', event => {
  console.log('install event', event);

  const promise = caches
    .open(CACHE_NAME)
    .then(cache => {
      console.table(urlsToCache);
      return cache.addAll(urlsToCache);
    })
    .then(() => {
      console.log('urls cached');
    })
    .catch(error => console.log(error));

  event.waitUntil(promise);
});

// Access cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || cacheRequest(event))
  );
});

function cacheRequest(event) {
  const request = event.request.clone();
  return fetch(request).then(response => {
    console.log('response', response);
    if (response && response.status == 200 && response.type == 'basic') {
      caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, response.clone());
      });
    }
    return response;
  });
}

// Manage caches
self.addEventListener('activate', function(event) {
  console.log('firebase-messaging-sw.js activated');
  const promise = caches
    .keys()
    .then(cacheNames =>
      Promise.all(
        cacheNames.map(
          cacheName => cacheName != CACHE_NAME && caches.delete(cacheName)
        )
      )
    );

  event.waitUntil(promise);
});
