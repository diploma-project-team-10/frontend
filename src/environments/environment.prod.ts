import { SETTINGS } from './settings';

const firebaseConfig = {
  apiKey: 'AIzaSyBlZDXcI8HHi3Ru9r1Ov8JXBRt8xhNNMrU',
  authDomain: 'innlab-mobile-app.firebaseapp.com',
  projectId: 'innlab-mobile-app',
  storageBucket: 'innlab-mobile-app.appspot.com',
  messagingSenderId: '59188235869',
  appId: '1:59188235869:web:5a714cb0e1a6a5e64fc7b4',
  measurementId: 'G-LE9YD9YBYJ'
};

export const environment = {
  production: true,
  appSettings: SETTINGS,
  apiUrl: '/px',
  defaultLanguage: 'kz',
  appMenu: 'assets/data/menu.json',
  logo: 'assets/img/talaptan-logo.svg',
  logoSign: 'assets/img/talaptan-logo.svg',
  firebaseConfig: firebaseConfig,
};
