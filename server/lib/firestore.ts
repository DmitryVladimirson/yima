import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { firestoreDatabase } from './firebase'

export const queryByCollection = async (col: string): Promise<Array<Record<string, any>>> => {
  const colReference = collection(firestoreDatabase, col)

  const snapshot = await getDocs(colReference)

  return [...snapshot.docs].map((document_) => {
    return {
      ...document_.data(),
      id: document_.id,
    }
  })
}

export const set = async (col: string, payload: Record<string, any>, id: string) => {
  return setDoc(doc(collection(firestoreDatabase, col), id), payload, { merge: true })
}

export const add = async (col: string, payload: Record<string, unknown>) => {
  const colReference = collection(firestoreDatabase, col)

  return addDoc(colReference, payload)
}

export const del = async (col: string, id: string) => {
  const documentReference = doc(firestoreDatabase, col, id)

  return deleteDoc(documentReference)
}
