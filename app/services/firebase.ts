import { initializeApp } from 'firebase/app'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const firebaseConfig = {
  apiKey: GOOGLE_API_KEY,
  authDomain: 'gm-spot-saver.firebaseapp.com',
  projectId: 'gm-spot-saver',
  storageBucket: 'gm-spot-saver.appspot.com',
  messagingSenderId: '287487504882',
  appId: '1:287487504882:web:b3078ebafdc8e7a6a27b6b'
};
export const app = initializeApp(firebaseConfig)
