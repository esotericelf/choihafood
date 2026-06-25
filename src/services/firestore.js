import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { parseDateId } from '../utils/date'

const ITEM_POOL = 'item_pool'
const DAILY_MENUS = 'daily_menus'

export async function fetchItemPool() {
  const snapshot = await getDocs(
    query(collection(db, ITEM_POOL), orderBy('name'))
  )
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addItemToPool({ name, price, category, description = '' }) {
  const docRef = await addDoc(collection(db, ITEM_POOL), {
    name: name.trim(),
    price: Number(price),
    category: category.trim(),
    description: description.trim(),
  })
  return { id: docRef.id, name: name.trim(), price: Number(price), category: category.trim(), description: description.trim() }
}

export async function updateItemInPool(id, { name, price }) {
  const docRef = doc(db, ITEM_POOL, id)
  await updateDoc(docRef, {
    name: name.trim(),
    price: Number(price),
  })
  return { id, name: name.trim(), price: Number(price) }
}

export async function deleteItemFromPool(id) {
  const docRef = doc(db, ITEM_POOL, id)
  await deleteDoc(docRef)
}

export async function fetchPublishedMenu(dateId) {
  const docRef = doc(db, DAILY_MENUS, dateId)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists() || !snapshot.data().published) return null
  return { id: snapshot.id, ...snapshot.data() }
}

export async function fetchDailyMenu(dateId) {
  const docRef = doc(db, DAILY_MENUS, dateId)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

export async function publishDailyMenu(dateId, items) {
  const docRef = doc(db, DAILY_MENUS, dateId)
  await setDoc(docRef, {
    id: dateId,
    date: Timestamp.fromDate(parseDateId(dateId)),
    items,
    published: true,
  })
}

export async function deleteDailyMenu(dateId) {
  const docRef = doc(db, DAILY_MENUS, dateId)
  await deleteDoc(docRef)
}

export async function fetchMenusByMonth(year, month) {
  const paddedMonth = String(month).padStart(2, '0')
  const start = `${year}-${paddedMonth}-01`
  const end = `${year}-${paddedMonth}-31`

  const snapshot = await getDocs(
    query(
      collection(db, DAILY_MENUS),
      where('id', '>=', start),
      where('id', '<=', end),
      orderBy('id', 'desc')
    )
  )
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}
