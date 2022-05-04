import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	// apiKey: process.env.NEXT_PUBLIC_API_KEY,
	// authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
	// databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
	// projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	// storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
	// messagingSenderId: process.env.NEXT_PUBLIC_MESSAGIN_ID,
	// appId: process.env.NEXT_PUBLIC_APP_ID,

	apiKey: 'AIzaSyBgUmvRpcIcuXpvhE_Kc3xD05PVqULRJxU',
	authDomain: 'whale-talk.firebaseapp.com',
	projectId: 'whale-talk',
	storageBucket: 'whale-talk.appspot.com',
	messagingSenderId: '250464434047',
	appId: '1:250464434047:web:cc0e625e196a5947024c4a',
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const authService = firebase.auth();
