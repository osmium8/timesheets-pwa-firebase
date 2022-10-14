// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
    apiKey: "AIzaSyBlSOuGJPezY5HUWhCuQYQkLDF8WFnFS_E",
    authDomain: "nagp-angular.firebaseapp.com",
    projectId: "nagp-angular",
    storageBucket: "nagp-angular.appspot.com",
    messagingSenderId: "522450582522",
    appId: "1:522450582522:web:0679e262095d36059ac243",
    measurementId: "G-P5CYX4JME1"
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();