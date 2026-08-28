import { adminDb } from "./firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

// Helper to get collection with user scoping
export function getUserCollection(userId: string, collectionName: string) {
  return adminDb.collection("users").doc(userId).collection(collectionName)
}

// Generate unique IDs for documents
export function generateId(): string {
  return adminDb.collection("_temp").doc().id
}

// Convert Firestore timestamp to Date
export function toDate(timestamp: any): Date {
  if (!timestamp) return new Date()
  if (timestamp.toDate) return timestamp.toDate()
  if (timestamp instanceof Date) return timestamp
  return new Date(timestamp)
}

// Server timestamp
export const serverTimestamp = () => FieldValue.serverTimestamp()

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  CUSTOMERS: "customers",
  REPAIRS: "repairs",
  INVENTORY: "inventory",
  INVOICES: "invoices",
  JOB_CARDS: "jobCards",
  DEVICES: "devices",
} as const

export { adminDb }
