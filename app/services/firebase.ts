import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCTNcpaBcn8bzjDGhWVpaQ6YOnZzHECwUE',
  authDomain: 'gm-spot-saver.web.app',
  projectId: 'gm-spot-saver',
  storageBucket: 'gm-spot-saver.appspot.com',
  messagingSenderId: '555137498198',
  appId: '1:555137498198:web:380bd830ee347237890ff7',
}

export const app = initializeApp(firebaseConfig)
