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

export type Category = {
  id: string
  color: string | null
  icon: string | null
  name: string
  createdAt: FieldValue
  updatedAt: FieldValue
}

const converter = {
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Category
  },
  toFirestore: (model: Category) => {
    const { id, ...rest } = model
    return { ...rest }
  },
}

export const listUserCategories = async (handle: string) => {
  const q = query(
    collection(db, 'accounts', handle, 'categories'),
  ).withConverter<Category>(converter)
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

export const addUserCategory = async (
  handle: string,
  data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const categoriesRef = collection(db, 'accounts', handle, 'categories')
  const category: Omit<Category, 'id'> = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  return await addDoc(categoriesRef, category)
}

export const updateUserCategory = async (handle: string, data: Category) => {
  const categoryDocRef = doc(
    db,
    'accounts',
    handle,
    'categories',
    data.id,
  ).withConverter<Category>(converter)

  data.updatedAt = serverTimestamp()

  await setDoc(categoryDocRef, data, { merge: true })
}

export const deleteUserCategory = async (handle: string, id: string) => {
  const categoryDocRef = doc(db, 'accounts', handle, 'categories', id)
  await deleteDoc(categoryDocRef)
}
