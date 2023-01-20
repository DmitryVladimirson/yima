import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDvi-F4Z4VK-j3K5ZS3zYBffjdGhVAwkq4',

  authDomain: 'yima-82cda.firebaseapp.com',

  projectId: 'yima-82cda',

  storageBucket: 'yima-82cda.appspot.com',

  messagingSenderId: '708721062864',

  appId: '1:708721062864:web:704f2198e1881e9d007fd5',
}

// Initialize Firebase

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const firestoreDatabase = getFirestore(app)

export const storage = getStorage()
