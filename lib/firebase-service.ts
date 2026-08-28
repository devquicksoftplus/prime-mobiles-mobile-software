import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"

// Helper to get user-scoped collection reference
function getUserCollection(userId: string, collectionName: string) {
  return collection(db, "users", userId, collectionName)
}

// Helper to convert Firestore timestamp to Date
function toDate(timestamp: any): Date {
  if (!timestamp) return new Date()
  if (timestamp.toDate) return timestamp.toDate()
  if (timestamp instanceof Date) return timestamp
  return new Date(timestamp)
}

// Generic CRUD operations
export const firebaseService = {
  // Create a document
  async create<T extends DocumentData>(
    userId: string,
    collectionName: string,
    data: T
  ): Promise<string> {
    const collRef = getUserCollection(userId, collectionName)
    const docRef = await addDoc(collRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  // Get all documents from a collection
  async getAll<T>(
    userId: string,
    collectionName: string,
    orderByField: string = "createdAt"
  ): Promise<(T & { id: string })[]> {
    const collRef = getUserCollection(userId, collectionName)
    const q = query(collRef, orderBy(orderByField, "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as unknown as T & { id: string }
    })
  },

  // Get a single document
  async getById<T>(
    userId: string,
    collectionName: string,
    docId: string
  ): Promise<(T & { id: string }) | null> {
    const docRef = doc(db, "users", userId, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    } as unknown as T & { id: string }
  },

  // Update a document
  async update(
    userId: string,
    collectionName: string,
    docId: string,
    data: Partial<DocumentData>
  ): Promise<void> {
    const docRef = doc(db, "users", userId, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  // Delete a document
  async delete(
    userId: string,
    collectionName: string,
    docId: string
  ): Promise<void> {
    const docRef = doc(db, "users", userId, collectionName, docId)
    await deleteDoc(docRef)
  },

  // TIER-OPTIMIZED QUERIES (Reduce Firestore Reads)
  
  // Basic Tier: Only active/pending jobs (NOT delivered)
  // Note: We avoid compound orderBy to prevent need for Firestore composite index
  async getActiveJobs<T>(
    userId: string,
    collectionName: string
  ): Promise<(T & { id: string })[]> {
    const collRef = getUserCollection(userId, collectionName)
    // Simple where query - no orderBy to avoid index requirement
    const q = query(
      collRef,
      where("status", "in", ["pending", "ready-for-delivery", "in-progress"])
    )
    const snapshot = await getDocs(q)

    const results = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as unknown as T & { id: string }
    })
    
    // Sort client-side by createdAt descending
    return results.sort((a: any, b: any) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0
      return dateB - dateA
    })
  },

  // Pro Tier: Last 30 days of jobs
  async getMonthlyJobs<T>(
    userId: string,
    collectionName: string
  ): Promise<(T & { id: string })[]> {
    const collRef = getUserCollection(userId, collectionName)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const q = query(
      collRef,
      where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo)),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as unknown as T & { id: string }
    })
  },
}

// Collection names
export const COLLECTIONS = {
  CUSTOMERS: "customers",
  DEVICES: "devices",
  JOB_CARDS: "jobCards",
  INVOICES: "invoices",
  INVENTORY: "inventory",
  REPAIRS: "repairs",
} as const
