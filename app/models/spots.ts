import axios from 'axios'
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
  position: {
    lat: number
    lng: number
  }
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

export const addUserSpot = async (handle: string, data:  Omit<Spot, 'id' | 'createdAt' | 'updatedAt'>) => {
  const spotsRef = collection(db, 'accounts', handle, 'spots')
  const spot: Omit<Spot, 'id'> = {
    ...data,
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

export const getLatLng = async (placeName: string): Promise<{lat: number, lng: number} | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=${apiKey}`,
  )

  if (response.data.results && response.data.results.length > 0) {
    const { lat, lng } = response.data.results[0].geometry.location
    return { lat, lng }
  }
  return null
}

// export const getPlaceDetails = async () => {
//   const placeId = '!4m2!3m1!1s0x5ff5a98dc014f585:0x4b81a2128979de43'
//   const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//   const response = await axios.get(
//     `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`,
//   )
//   if (response.data.result) {
//     console.log(response.data.result)
//     return response.data.result
//   }
// }
