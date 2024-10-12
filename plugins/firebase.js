import { initializeApp } from "firebase/app";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.app.apiKeyFirebase,
        authDomain: config.app.authDomain,
        projectId: config.app.projectId,
        storageBucket: config.app.storageBucket,
        messagingSenderId: config.app.messagingSenderId,
        appId: config.app.appId,
    };

    const app = initializeApp(firebaseConfig);

    nuxtApp.provide('firebase', app);
});
