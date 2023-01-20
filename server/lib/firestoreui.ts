import * as firebaseui from 'firebaseui'
import firebase from 'firebase/compat/app'
import { auth } from './firebase'

const ui = new firebaseui.auth.AuthUI(auth)

ui.start('#firebaseui-auth-container', {
  signInOptions: [{ provider: firebase.auth.EmailAuthProvider.PROVIDER_ID }],
  signInSuccessUrl: '/',
})
