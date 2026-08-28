"use client"

/**
 * Image Compression Utility
 * Compresses images client-side before uploading to Firebase Storage
 * Reduces storage costs and improves upload/download speeds
 */

export interface CompressionOptions {
  /** Maximum width of the output image (default: 1920) */
  maxWidth?: number
  /** Maximum height of the output image (default: 1080) */
  maxHeight?: number
  /** Target file size in KB (default: 150) */
  targetSizeKB?: number
  /** Minimum quality (0-1, default: 0.3) */
  minQuality?: number
  /** Maximum quality (0-1, default: 0.9) */
  maxQuality?: number
  /** Output format (default: 'webp' for best compression) */
  outputFormat?: 'webp' | 'jpeg' | 'png'
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  width: number
  height: number
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  targetSizeKB: 150, // Optimal size for quality vs storage
  minQuality: 0.3,
  maxQuality: 0.9,
  outputFormat: 'webp',
}

/**
 * Loads an image from a File object
 */
async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculates dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let newWidth = width
  let newHeight = height

  // Scale down if necessary
  if (width > maxWidth) {
    newHeight = (height * maxWidth) / width
    newWidth = maxWidth
  }

  if (newHeight > maxHeight) {
    newWidth = (newWidth * maxHeight) / newHeight
    newHeight = maxHeight
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) }
}

/**
 * Converts canvas to blob with specified format and quality
 */
async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      },
      `image/${format}`,
      quality
    )
  })
}

/**
 * Compresses an image file using Canvas API
 * Uses binary search to find optimal quality that meets target size
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const originalSize = file.size

  // Skip compression for already small files (under 50KB)
  if (originalSize <= 50 * 1024) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1,
      width: 0,
      height: 0,
    }
  }

  // Load the image
  const img = await loadImage(file)
  const originalUrl = img.src

  // Calculate new dimensions
  const { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    opts.maxWidth,
    opts.maxHeight
  )

  // Create canvas and draw resized image
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Use high-quality image rendering
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  // Clean up object URL
  URL.revokeObjectURL(originalUrl)

  // Determine MIME type
  const mimeType = `image/${opts.outputFormat}`
  const targetBytes = opts.targetSizeKB * 1024

  // Binary search for optimal quality
  let minQuality = opts.minQuality
  let maxQuality = opts.maxQuality
  let bestBlob: Blob | null = null
  let iterations = 0
  const maxIterations = 10

  while (iterations < maxIterations) {
    const midQuality = (minQuality + maxQuality) / 2
    const blob = await canvasToBlob(canvas, opts.outputFormat, midQuality)
    
    if (Math.abs(blob.size - targetBytes) < targetBytes * 0.1) {
      // Within 10% of target, good enough
      bestBlob = blob
      break
    }

    if (blob.size > targetBytes) {
      maxQuality = midQuality
    } else {
      minQuality = midQuality
      bestBlob = blob
    }

    iterations++
  }

  // If no good match found, use the last attempt
  if (!bestBlob) {
    bestBlob = await canvasToBlob(canvas, opts.outputFormat, opts.minQuality)
  }

  // Create new file with compressed data
  const fileName = file.name.replace(/\.[^.]+$/, `.${opts.outputFormat}`)
  const compressedFile = new File([bestBlob], fileName, { type: mimeType })

  return {
    file: compressedFile,
    originalSize,
    compressedSize: compressedFile.size,
    compressionRatio: originalSize / compressedFile.size,
    width,
    height,
  }
}

/**
 * Compresses multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  const results = await Promise.all(
    files.map((file) => compressImage(file, options))
  )
  return results
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
}
