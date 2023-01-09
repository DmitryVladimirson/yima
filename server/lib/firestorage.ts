import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export const uploadFile = async (file: any, url: string) => {
  const storageReference = ref(storage, url)

  await uploadBytes(storageReference, file)

  return getDownloadURL(ref(storage, url))
}
