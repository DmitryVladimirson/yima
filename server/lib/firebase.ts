import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDvi-F4Z4VK-j3K5ZS3zYBffjdGhVAwkq4',

  authDomain: 'yima-82cda.firebaseapp.com',

  projectId: 'yima-82cda',

  storageBucket: 'yima-82cda.appspot.com',

  messagingSenderId: '708721062864',

  appId: '1:708721062864:web:704f2198e1881e9d007fd5',
}

// Initialize Firebase

const app = initializeApp(firebaseConfig)

export const firestoreDatabase = getFirestore(app)

export const storage = getStorage()
