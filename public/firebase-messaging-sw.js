// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');

if ('function' === typeof importScripts) {
    // eslint-disable-next-line no-undef
    importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
    // eslint-disable-next-line no-undef
    importScripts(
        "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
    );

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
    // eslint-disable-next-line no-undef
    if (firebase.messaging.isSupported()) {
        const firebaseConfig = {
            apiKey: "AIzaSyBu2lL5isgDhvO0ZJPs1oQ7bsMaiuXcglc",
            authDomain: "chatify-17.firebaseapp.com",
            projectId: "chatify-17",
            storageBucket: "chatify-17.appspot.com",
            messagingSenderId: "1003628190110",
            appId: "1:1003628190110:web:ec602204b09eecf33a5e8f",
            measurementId: "G-HHQVD5HJJE"
        };
        try {
            // eslint-disable-next-line no-undef
            firebase.initializeApp(firebaseConfig);
            // eslint-disable-next-line no-undef
            const messaging = firebase.messaging();

            messaging.onBackgroundMessage(function (payload) {
                console.log('[firebase-messaging-sw.js] Received background message ', payload);
                let notificationTitle;
                let notificationOptions;
                if (payload.data.type === "message") {
                    notificationTitle = payload.data.title;
                    notificationOptions = {
                        icon: payload.data.image,
                        body: payload.data.body,
                        badge: payload.data.image,
                    };
                } else {
                    notificationTitle = payload.data.title;
                    notificationOptions = {
                        icon: payload.data.image,
                        body: payload.data.type,
                        badge: payload.data.image,
                    };
                }

                self.registration.showNotification(notificationTitle,
                    notificationOptions);

            });
        } catch (e) {
            console.log(e);
        }

        addEventListener("notificationclick", (event) => {
            // eslint-disable-next-line no-undef
            onnotificationclick(event)
        });
        // eslint-disable-next-line no-undef
        onnotificationclick = (event) => {
            event.notification.close();
            event.waitUntil(
                // eslint-disable-next-line no-undef
                clients
                    .matchAll({
                        type: "window",
                    })
                    .then((clientList) => {
                        for (const client of clientList) {
                            if (client.url === "/" && "focus" in client) return client.focus();
                        }
                        // eslint-disable-next-line no-undef
                        if (clients.openWindow) return clients.openWindow("/chat");
                    })
            )
        };
    }
}
