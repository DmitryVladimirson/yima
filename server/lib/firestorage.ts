import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export const uploadFile = async (file: any, url: string) => {
  const { storage } = await import('~/server/lib/firebase')

  const storageReference = ref(storage, url)

  await uploadBytes(storageReference, file)

  return getDownloadURL(storageReference)
}

export const deleteFile = async (url: string) => {
  const { storage } = await import('~/server/lib/firebase')

  const storageReference = ref(storage, url)

  return deleteObject(storageReference)
}
