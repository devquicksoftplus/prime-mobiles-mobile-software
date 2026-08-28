// Export all templates
export { ModernMinimalistTemplate } from './modern-minimalist'
export { CorporateProTemplate } from './corporate-pro'
export { CreativeStudioTemplate } from './creative-studio'
export { ExecutiveSuiteTemplate } from './executive-suite'
export { TechForwardTemplate } from './tech-forward'
export { BoldImpactTemplate } from './bold-impact'
export { IndustrialTechTemplate } from './industrial-tech'
export { ClassicProfessionalTemplate } from './classic-professional'
export { RetailReceiptTemplate } from './retail-receipt'
export { SoftEleganceTemplate } from './soft-elegance'

// Template component map for dynamic rendering
import { ModernMinimalistTemplate } from './modern-minimalist'
import { CorporateProTemplate } from './corporate-pro'
import { CreativeStudioTemplate } from './creative-studio'
import { ExecutiveSuiteTemplate } from './executive-suite'
import { TechForwardTemplate } from './tech-forward'
import { BoldImpactTemplate } from './bold-impact'
import { IndustrialTechTemplate } from './industrial-tech'
import { ClassicProfessionalTemplate } from './classic-professional'
import { RetailReceiptTemplate } from './retail-receipt'
import { SoftEleganceTemplate } from './soft-elegance'
import { TemplateId, InvoiceData } from '../types'
import { FC } from 'react'

type TemplateComponent = FC<{ data: InvoiceData }>

export const templateComponents: Record<TemplateId, TemplateComponent> = {
  'modern-minimalist': ModernMinimalistTemplate,
  'corporate-pro': CorporateProTemplate,
  'creative-studio': CreativeStudioTemplate,
  'executive-suite': ExecutiveSuiteTemplate,
  'tech-forward': TechForwardTemplate,
  'bold-impact': BoldImpactTemplate,
  'industrial-tech': IndustrialTechTemplate,
  'classic-professional': ClassicProfessionalTemplate,
  'retail-receipt': RetailReceiptTemplate,
  'soft-elegance': SoftEleganceTemplate,
}

export const getTemplateComponent = (id: TemplateId): TemplateComponent => {
  return templateComponents[id] || ModernMinimalistTemplate
}
