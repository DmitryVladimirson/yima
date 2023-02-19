import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  limit,
  getCountFromServer,
  startAfter,
  getDoc,
  endBefore,
  orderBy,
  type OrderByDirection,
} from 'firebase/firestore'

import { getQuery, type H3Event } from 'h3'
import { firestoreDatabase } from './firebase'
import type { QueryConstraint, QueryFieldFilterConstraint } from 'firebase/firestore'

declare global {
  interface QueryByCollectionOptions {
    per_page?: number
    anchorDocumentId?: string
    directionForward?: boolean
    where?: QueryFieldFilterConstraint
    orderByPath?: string
    orderByDirection?: OrderByDirection
  }
}

export const getQueryByCollectionOptions = (event: H3Event) => {
  const parsedParameters = getQuery(event)
  const parameters: QueryByCollectionOptions = { ...parsedParameters, directionForward: true }

  if (parsedParameters.directionForward === 'false') {
    parameters.directionForward = false
  }

  if (parameters.per_page) {
    parameters.per_page = Number(parsedParameters.per_page)
  }

  return parameters
}

export const queryByCollection = async <T>(
  col: string,
  options: QueryByCollectionOptions = {}
): Promise<MemberResponse<T>> => {
  const colReference = collection(firestoreDatabase, col)

  const {
    per_page = 10,
    directionForward = true,
    anchorDocumentId,
    where: whereOption,
    orderByPath,
    orderByDirection = 'desc',
  } = options

  const queryOptions: QueryConstraint[] = []

  if (per_page >= 0) {
    queryOptions.push(limit(per_page))
  }

  if (orderByPath) {
    queryOptions.push(orderBy(orderByPath, orderByDirection))
  }

  if (anchorDocumentId) {
    const documentSnap = await getDoc(doc(colReference, anchorDocumentId))
    queryOptions.push(directionForward ? startAfter(documentSnap) : endBefore(documentSnap))
  }

  if (whereOption) {
    queryOptions.push(whereOption)
  }

  const countResponse = await getCountFromServer(colReference)

  const totalItems = countResponse.data().count

  const queryResponse = query(colReference, ...queryOptions)

  const snapshot = await getDocs(queryResponse)

  const member = [...snapshot.docs].map((document_) => {
    return {
      ...document_.data(),
      id: document_.id,
    }
  })

  return { member, totalItems }
}

export const set = async (col: string, payload: Record<string, any>, id: string) => {
  if (Buffer.isBuffer(payload)) {
    payload = JSON.parse(payload.toString())
  }

  return setDoc(doc(collection(firestoreDatabase, col), id), payload, { merge: true })
}

export const add = async (col: string, payload: any) => {
  const colReference = collection(firestoreDatabase, col)

  if (Buffer.isBuffer(payload)) {
    payload = JSON.parse(payload.toString())
  }

  return addDoc(colReference, payload)
}

export const del = async (col: string, id: string) => {
  const documentReference = doc(firestoreDatabase, col, id)

  return deleteDoc(documentReference)
}
