'use client'

import { Font } from '@react-pdf/renderer'

// Track if fonts are registered to prevent duplicate registration
let fontsRegistered = false

/**
 * Register fonts for PDF generation
 * Uses Helvetica as fallback since it's built into @react-pdf/renderer
 * and doesn't require external font loading
 */
export function registerFonts() {
  if (fontsRegistered) return
  
  // Use built-in Helvetica font to avoid font loading issues
  // react-pdf has issues with woff2 fonts from Google Fonts
  // Helvetica is reliably available and looks professional
  try {
    Font.register({
      family: 'Helvetica',
      fonts: [
        { src: 'Helvetica', fontWeight: 400 },
        { src: 'Helvetica-Bold', fontWeight: 700 },
      ],
    })
    fontsRegistered = true
  } catch {
    // Helvetica is already registered as a standard font
    fontsRegistered = true
  }
}

// Auto-register on import for convenience
registerFonts()

// Export the font family name to use in styles
export const PDF_FONT_FAMILY = 'Helvetica'
