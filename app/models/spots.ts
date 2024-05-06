import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  type FieldValue,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '~/services/firestore'

// 個別の投稿
export type Spot = {
  id: string
  comment: string | null
  categoryId: string
  memo: string | null
  title: string
  url: string | null
  createdAt: FieldValue
  updatedAt: FieldValue
}

const converter = {
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Spot
  },
  toFirestore: (model: Spot) => {
    const { id, ...rest } = model
    return { ...rest }
  },
}

export const listUserSpots = async (handle: string) => {
  const q = query(
    collection(db, 'accounts', handle, 'spots'),
  ).withConverter<Spot>(converter)
  const docs = await getDocs(q)
  return docs.docs.map((doc) => doc.data())
}

// export const listAllPosts = async () => {
//   const q = collectionGroup(db, 'posts').withConverter<Spot>(converter)
//   const docs = await getDocs(q)
//   return docs.docs.map((doc) => doc.data())
// }

// export const getUserPostById = async (handle: string, id: string) => {
//   const postDocRef = doc(
//     db,
//     'accounts',
//     handle,
//     'posts',
//     id,
//   ).withConverter<Spot>(converter)
//   const postDoc = await getDoc(postDocRef)
//   if (postDoc.exists()) {
//     return postDoc.data()
//   }
//   return null
// }

export const addUserSpot = async (handle: string) => {
  const spotsRef = collection(db, 'accounts', handle, 'spots')
  const spot: Omit<Spot, 'id'> = {
    comment: '',
    categoryId: 'pd75urrpEDbVQThlKa73',
    memo: '',
    title: 'テスト',
    url: 'https://www.google.com/maps/place/%E5%B3%B6%E9%87%8D%E6%9C%A8%E5%B7%A5%E6%89%80/data=!4m2!3m1!1s0x5ff5bc6539a19c0f:0x944cfede6752c9d8',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  return await addDoc(spotsRef, spot)
}

export const updateUserSpot = async (handle: string, data: Spot) => {
  const spotDocRef = doc(
    db,
    'accounts',
    handle,
    'spots',
    data.id,
  ).withConverter<Spot>(converter)

  data.updatedAt = serverTimestamp()

  await setDoc(spotDocRef, data, { merge: true })
}

export const deleteUserSpot = async (handle: string, id: string) => {
  const spotDocRef = doc(db, 'accounts', handle, 'spots', id)
  await deleteDoc(spotDocRef)
}
