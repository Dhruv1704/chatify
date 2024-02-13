importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.body;
    const notificationOptions = {
        icon: payload.notification.image,
        body: payload.notification.title,
        badge: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);

});

// addEventListener("notificationclick", (event) => {});
//
// onnotificationclick = (event) => {
//     event.notification.close();
//     event.waitUntil(
//         clients
//             .matchAll({
//                 type: "window",
//             })
//             .then((clientList) => {
//                 for (const client of clientList) {
//                     if (client.url === "https://chatify-17.web.app/" && "focus" in client) return client.focus();
//                 }
//                 if (clients.openWindow) return clients.openWindow("https://chatify-17.web.app/chat");
//             }),
// };

