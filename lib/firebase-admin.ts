import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import * as fs from "fs"
import * as path from "path"

let app: App

function getServiceAccount(): object | null {
  // Option 1: Load from file path (FIREBASE_SERVICE_ACCOUNT_PATH)
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (keyPath) {
    try {
      const fullPath = path.resolve(process.cwd(), keyPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        console.log("[Firebase Admin] Loaded service account from file:", keyPath)
        return JSON.parse(content)
      }
    } catch (e) {
      console.error("[Firebase Admin] Failed to load from file path:", e)
    }
  }

  // Option 2: Parse from inline JSON string (FIREBASE_SERVICE_ACCOUNT_KEY)
  const keyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (keyString) {
    try {
      const parsed = JSON.parse(keyString)
      console.log("[Firebase Admin] Loaded service account from env variable")
      return parsed
    } catch (e) {
      console.error("[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e)
    }
  }

  console.warn("[Firebase Admin] No service account configured")
  console.warn("[Firebase Admin] Set FIREBASE_SERVICE_ACCOUNT_PATH to point to your JSON file")
  console.warn("[Firebase Admin] Example: FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json")
  return null
}

if (!getApps().length) {
  const serviceAccount = getServiceAccount()
  
  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount as any),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
    console.log("[Firebase Admin] ✓ Initialized with service account")
  } else {
    console.warn("[Firebase Admin] ⚠ Initializing without service account - Admin API will not work")
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  }
} else {
  app = getApps()[0]
}

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
export const adminStorage = getStorage(app)
export default app


