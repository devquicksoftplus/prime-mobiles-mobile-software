"use client"

/**
 * Firebase Storage Client-Side Upload Utilities
 * Uploads directly from browser to Firebase Storage
 * Uses Firebase Auth for security (requires user to be logged in)
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"
import { v4 as uuidv4 } from "uuid"

export interface UploadResult {
  url: string
  path: string
  name: string
  size: number
}

/**
 * Upload a file directly to Firebase Storage from the client
 * @param file - The file to upload
 * @param folder - The folder path in storage (default: "device-conditions")
 * @returns Upload result with URL and path
 */
export async function uploadToFirebaseStorage(
  file: File,
  folder: string = "device-conditions"
): Promise<UploadResult> {
  // Generate unique filename
  const fileExtension = file.name.split(".").pop() || "webp"
  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  const filePath = `mobilebilling/${folder}/${uniqueFileName}`

  // Create storage reference
  const storageRef = ref(storage, filePath)

  // Upload file
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  })

  // Get download URL
  const url = await getDownloadURL(snapshot.ref)

  return {
    url,
    path: filePath,
    name: uniqueFileName,
    size: file.size,
  }
}

/**
 * Delete a file from Firebase Storage
 * @param filePath - The path of the file to delete
 */
export async function deleteFromFirebaseStorage(filePath: string): Promise<void> {
  const storageRef = ref(storage, filePath)
  await deleteObject(storageRef)
}
