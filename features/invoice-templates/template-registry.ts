import { TemplateInfo, TemplateId } from './types'

// Template registry with metadata for all 10 unique templates
export const templateRegistry: Record<TemplateId, TemplateInfo> = {
  'modern-minimalist': {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean design with emerald accents and plenty of whitespace',
    thumbnail: '/templates/modern-minimalist.png',
    primaryColor: '#10b981',
    secondaryColor: '#d1fae5',
    style: 'minimal',
  },
  'corporate-pro': {
    id: 'corporate-pro',
    name: 'Corporate Pro',
    description: 'Professional royal blue theme with structured grid layout',
    thumbnail: '/templates/corporate-pro.png',
    primaryColor: '#2563eb',
    secondaryColor: '#dbeafe',
    style: 'classic',
  },
  'creative-studio': {
    id: 'creative-studio',
    name: 'Creative Studio',
    description: 'Unique violet sidebar layout ideal for agencies',
    thumbnail: '/templates/creative-studio.png',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ede9fe',
    style: 'creative',
  },
  'executive-suite': {
    id: 'executive-suite',
    name: 'Executive Suite',
    description: 'Elegant serif fonts with slate and gold accents',
    thumbnail: '/templates/executive-suite.png',
    primaryColor: '#475569',
    secondaryColor: '#d97706',
    style: 'classic',
  },
  'tech-forward': {
    id: 'tech-forward',
    name: 'Tech Forward',
    description: 'Modern flat design with cyan accents and dark header',
    thumbnail: '/templates/tech-forward.png',
    primaryColor: '#06b6d4',
    secondaryColor: '#cffafe',
    style: 'modern',
  },
  'bold-impact': {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'High contrast red theme with thick borders and bold typography',
    thumbnail: '/templates/bold-impact.png',
    primaryColor: '#dc2626',
    secondaryColor: '#fee2e2',
    style: 'bold',
  },
  'industrial-tech': {
    id: 'industrial-tech',
    name: 'Industrial Tech',
    description: 'Technical blueprint aesthetic with monospace fonts and orange accents',
    thumbnail: '/templates/industrial-tech.png',
    primaryColor: '#f97316',
    secondaryColor: '#ffedd5',
    style: 'modern',
  },
  'classic-professional': {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional navy invoice with outer border and serif headers',
    thumbnail: '/templates/classic-professional.png',
    primaryColor: '#1e293b',
    secondaryColor: '#f1f5f9',
    style: 'classic',
  },
  'retail-receipt': {
    id: 'retail-receipt',
    name: 'Retail Receipt',
    description: 'Compact teal receipt-style layout with centered header',
    thumbnail: '/templates/retail-receipt.png',
    primaryColor: '#14b8a6',
    secondaryColor: '#ccfbf1',
    style: 'creative',
  },
  'soft-elegance': {
    id: 'soft-elegance',
    name: 'Soft Elegance',
    description: 'Gentle rose theme with rounded corners and soft backgrounds',
    thumbnail: '/templates/soft-elegance.png',
    primaryColor: '#fb7185',
    secondaryColor: '#ffe4e6',
    style: 'minimal',
  },
}

export const getTemplateInfo = (id: TemplateId): TemplateInfo => {
  return templateRegistry[id] || templateRegistry['modern-minimalist']
}

export const getAllTemplates = (): TemplateInfo[] => {
  return Object.values(templateRegistry)
}

export const DEFAULT_TEMPLATE: TemplateId = 'modern-minimalist'
