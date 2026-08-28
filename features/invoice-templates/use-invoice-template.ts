'use client'

import { useState, useEffect, useCallback } from 'react'
import { TemplateId, TemplateInfo } from './types'
import { DEFAULT_TEMPLATE, getTemplateInfo } from './template-registry'

const STORAGE_KEY = 'selected-invoice-template'

export function useInvoiceTemplate() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(DEFAULT_TEMPLATE)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved template from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setSelectedTemplateId(saved as TemplateId)
    }
    setIsLoading(false)
  }, [])

  // Save template selection
  const selectTemplate = useCallback((id: TemplateId) => {
    setSelectedTemplateId(id)
    localStorage.setItem(STORAGE_KEY, id)
  }, [])

  // Get current template info
  const templateInfo: TemplateInfo = getTemplateInfo(selectedTemplateId)

  return {
    selectedTemplateId,
    templateInfo,
    selectTemplate,
    isLoading,
  }
}

// Utility function to get selected template (for non-hook usage)
export function getSelectedTemplateId(): TemplateId {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATE
  const saved = localStorage.getItem(STORAGE_KEY)
  return (saved as TemplateId) || DEFAULT_TEMPLATE
}
