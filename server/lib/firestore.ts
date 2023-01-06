import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc
} from 'firebase/firestore'
import { firestoreDb } from './firebase'

export const queryByCollection = async (col: string) => {
  // @ts-ignore
  const colRef = collection(firestoreDb, col)

  const snapshot = await getDocs(colRef)

  return Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      id: doc.id
    }
  })
}

export const set = async (col: string, document: Object) => {
  await setDoc(doc(collection(firestoreDb, col)), document, { merge: true })
}

export const add = async (col: string, document: Object) => {
  // @ts-ignore
  const colRef = collection(firestoreDb, col)

  return await addDoc(colRef, document)
}

export const del = async (col: string, id: string) => {
  const docRef = doc(firestoreDb, col, id)
  return await deleteDoc(docRef)
}
