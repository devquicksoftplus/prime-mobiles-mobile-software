import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

/**
 * API Route: Convert image URL to base64
 * 
 * This runs server-side, bypassing browser CORS restrictions.
 * Firebase Storage images cannot be fetched from the browser due to CORS,
 * but server-side requests have no such limitation.
 * 
 * Supported formats: JPEG, PNG, WebP (converted to PNG), GIF, SVG, BMP, TIFF
 * Note: WebP images are automatically converted to PNG for PDF compatibility
 */

// Map of file extensions to MIME types for fallback detection
const MIME_TYPE_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
}

// Detect MIME type from URL if content-type header is missing or generic
function detectMimeType(url: string, headerContentType: string | null): string {
  // If we have a specific image content type, use it
  if (headerContentType && headerContentType.startsWith('image/') && headerContentType !== 'application/octet-stream') {
    return headerContentType
  }
  
  // Try to detect from URL
  try {
    const urlPath = new URL(url).pathname.toLowerCase()
    for (const [ext, mimeType] of Object.entries(MIME_TYPE_MAP)) {
      if (urlPath.includes(ext)) {
        return mimeType
      }
    }
  } catch {
    // If URL parsing fails, check the raw string
    const lowerUrl = url.toLowerCase()
    for (const [ext, mimeType] of Object.entries(MIME_TYPE_MAP)) {
      if (lowerUrl.includes(ext)) {
        return mimeType
      }
    }
  }
  
  // Default to JPEG as most common
  return 'image/jpeg'
}

// Fetch with timeout and retry
async function fetchWithRetry(
  url: string, 
  maxRetries: number = 2,
  timeoutMs: number = 15000
): Promise<Response | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; InvoiceGenerator/1.0)',
          'Accept': 'image/*',
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        return response
      }
      
      console.warn(`[Image Fetch] Attempt ${attempt + 1}/${maxRetries + 1} failed for ${url}: HTTP ${response.status}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.warn(`[Image Fetch] Attempt ${attempt + 1}/${maxRetries + 1} failed for ${url}: ${errorMessage}`)
      
      // If aborted (timeout), don't retry immediately
      if (errorMessage.includes('aborted')) {
        continue
      }
    }
    
    // Wait before retry (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)))
    }
  }
  
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "urls array is required" },
        { status: 400 }
      )
    }

    console.log(`[Image-to-Base64] Processing ${urls.length} image(s)`)

    // Process all URLs in parallel
    const results = await Promise.all(
      urls.map(async (url: string, index: number) => {
        try {
          if (!url || typeof url !== 'string') {
            console.error(`[Image ${index + 1}] Invalid URL provided`)
            return null
          }

          // Fetch with retry and timeout
          const response = await fetchWithRetry(url)
          
          if (!response) {
            console.error(`[Image ${index + 1}] Failed to fetch after retries: ${url}`)
            return null
          }

          // Get the content type (with fallback detection)
          const headerContentType = response.headers.get('content-type')
          let contentType = detectMimeType(url, headerContentType)
          
          // Get the image as array buffer
          const arrayBuffer = await response.arrayBuffer()
          
          // Validate we got actual data
          if (arrayBuffer.byteLength === 0) {
            console.error(`[Image ${index + 1}] Empty response body for: ${url}`)
            return null
          }
          
          let imageBuffer: Buffer = Buffer.from(new Uint8Array(arrayBuffer))
          
          // Convert WebP to PNG (react-pdf doesn't support WebP)
          if (contentType === 'image/webp') {
            console.log(`[Image ${index + 1}] Converting WebP to PNG...`)
            try {
              const convertedBuffer = await sharp(imageBuffer)
                .png({ quality: 90 })
                .toBuffer()
              imageBuffer = convertedBuffer
              contentType = 'image/png'
              console.log(`[Image ${index + 1}] WebP converted to PNG: ${imageBuffer.byteLength} bytes`)
            } catch (sharpError) {
              console.error(`[Image ${index + 1}] Failed to convert WebP:`, sharpError)
              // Try to continue with original format as fallback
            }
          }
          
          // Convert to base64
          const base64 = imageBuffer.toString('base64')
          
          console.log(`[Image ${index + 1}] Successfully processed: ${contentType}, ${imageBuffer.byteLength} bytes`)
          
          // Return as data URI
          return `data:${contentType};base64,${base64}`
        } catch (error) {
          console.error(`[Image ${index + 1}] Error processing ${url}:`, error)
          return null
        }
      })
    )

    // Filter out failed conversions
    const validResults = results.filter((r): r is string => r !== null)
    
    const successRate = urls.length > 0 ? ((validResults.length / urls.length) * 100).toFixed(1) : '0'
    console.log(`[Image-to-Base64] Completed: ${validResults.length}/${urls.length} images converted (${successRate}%)`)

    return NextResponse.json({ 
      images: validResults,
      total: urls.length,
      converted: validResults.length,
      failed: urls.length - validResults.length
    })
  } catch (error) {
    console.error("[Image-to-Base64] Critical error:", error)
    return NextResponse.json(
      { error: "Failed to convert images" },
      { status: 500 }
    )
  }
}
