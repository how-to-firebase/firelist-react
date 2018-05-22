/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js'
);
importScripts('/environments/environment.js');

firebase.initializeApp(environment.firebase);

var messaging = firebase.messaging();

/* 
  CHALLENGE Messaging
  
  https://github.com/firebase/quickstart-js/blob/65071f29716138fe020e62bed50cfba174e83170/messaging/firebase-messaging-sw.js#L15-L29

  - Set the background message handler
  - Pull data off of the message handler payload
  - Construct a notification options object with the following data shape: 
    { body: 'the message body', icon: iconUrl }
  - Use self.registration.showNotification(title, options) to pop a background message
    `title` is whatever text you want at the top of your notification
    `options` is the options object you constructed in the last step
*/

const iconUrl =
  'https://firebasestorage.googleapis.com/v0/b/firelist-react.appspot.com/o/assets%2Fbolt-144px.png?alt=media&token=a747522e-22a4-496d-bcc9-429a007a86fb';

/* 
  CHALLENGE Messaging
  - See https://developers.google.com/web/fundamentals/codelabs/push-notifications/
  - Handle notificationclick events
  - Close the notification
  - Open noteUrl
  - Hint: Look for the noteId on event.notification.data
*/

if (!environment.isDevelopment) {
  /* 
  Cacheing
  
  https://developers.google.com/web/fundamentals/primers/service-workers/#cache_and_return_requests
*/

  //Establish cache
  const CACHE_NAME = 'firelist-react-v0.0.0';
  const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/environments/environment.js',
  ];
  self.addEventListener('install', event => {
    const promise = caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => console.log('sw install error', error))
      .then(() => {
        console.log('sw install successful');
      });

    event.waitUntil(promise);
  });

  // Access cache
  self.addEventListener('fetch', event => {
    const promise = caches
      .match(event.request)
      .then(response => response || cacheRequest(event));
    event.respondWith(promise);
  });

  function cacheRequest(event) {
    const request = event.request.clone();
    return fetch(request).then(
      response =>
        !shouldCache(response)
          ? response
          : caches
              .open(CACHE_NAME)
              .then(cache => cache.put(event.request, response.clone()))
              .then(() => response)
    );
  }

  function shouldCache(response) {
    return response && response.status == 200 && response.type == 'basic';
  }

  // Manage caches
  self.addEventListener('activate', event => {
    const promise = caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(
            cacheName => cacheName != CACHE_NAME && caches.delete(cacheName)
          )
        )
      )
      .catch(error => console.log('sw activation error', error))
      .then(() => console.log('sw activation successful'));

    event.waitUntil(promise);
  });
} else {
  console.log('sw cacheing disabled for development');
}
