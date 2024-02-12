importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBu2lL5isgDhvO0ZJPs1oQ7bsMaiuXcglc",
        authDomain: "chatify-17.firebaseapp.com",
        projectId: "chatify-17",
        storageBucket: "chatify-17.appspot.com",
        messagingSenderId: "1003628190110",
        appId: "1:1003628190110:web:ec602204b09eecf33a5e8f",
        measurementId: "G-HHQVD5HJJE"

});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
