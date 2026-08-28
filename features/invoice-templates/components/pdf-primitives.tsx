'use client'

import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { ReactNode } from 'react'

// ============ SMART SECTION ============
// Renders nothing if data is empty/undefined
interface SmartSectionProps {
  show?: boolean
  children: ReactNode
  style?: any
}

export const SmartSection = ({ show = true, children, style }: SmartSectionProps) => {
  if (!show) return null
  return <View style={style}>{children}</View>
}

// ============ SAFE IMAGE ============
// Handles image loading errors gracefully
interface SafeImageProps {
  src?: string
  style?: any
  fallbackText?: string
}

export const SafeImage = ({ src, style, fallbackText = '' }: SafeImageProps) => {
  if (!src) return null
  
  try {
    return <Image src={src} style={style} />
  } catch {
    if (fallbackText) {
      return <Text style={{ fontSize: 8, color: '#94a3b8' }}>{fallbackText}</Text>
    }
    return null
  }
}

// ============ TERMS SECTION ============
// Full-width terms section with proper styling
const termsStyles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    paddingTop: 15,
    paddingHorizontal: 0,
  },
  box: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 8,
    fontWeight: 700,
    color: '#334155',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.5,
  },
})

interface TermsSectionProps {
  terms?: string
  title?: string
  backgroundColor?: string
  borderColor?: string
  titleColor?: string
  textColor?: string
}

export const TermsSection = ({ 
  terms, 
  title = 'Terms & Conditions',
  backgroundColor = '#f8fafc',
  borderColor = '#e2e8f0',
  titleColor = '#334155',
  textColor = '#64748b',
}: TermsSectionProps) => {
  if (!terms) return null
  
  return (
    <View style={termsStyles.container}>
      <View style={[termsStyles.box, { backgroundColor, borderColor }]}>
        <Text style={[termsStyles.title, { color: titleColor }]}>{title}</Text>
        <Text style={[termsStyles.text, { color: textColor }]}>{terms}</Text>
      </View>
    </View>
  )
}

// ============ CURRENCY FORMATTER ============
export const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

// ============ PAYMENT STATUS BADGE ============
const statusStyles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})

interface PaymentStatusBadgeProps {
  status: 'paid' | 'partial' | 'pending'
  balanceDue?: number
}

export const PaymentStatusBadge = ({ status, balanceDue }: PaymentStatusBadgeProps) => {
  const configs = {
    paid: { bg: '#dcfce7', border: '#22c55e', text: '#15803d', label: '✓ PAID IN FULL' },
    partial: { bg: '#fef3c7', border: '#f59e0b', text: '#b45309', label: `PARTIAL - Balance: ${formatCurrency(balanceDue || 0)}` },
    pending: { bg: '#fee2e2', border: '#ef4444', text: '#dc2626', label: `PENDING - Due: ${formatCurrency(balanceDue || 0)}` },
  }
  
  const config = configs[status] || configs.pending
  
  return (
    <View style={[statusStyles.badge, { backgroundColor: config.bg, borderWidth: 1, borderColor: config.border }]}>
      <Text style={[statusStyles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  )
}

// ============ SECTION HEADER ============
interface SectionHeaderProps {
  title: string
  color?: string
  fontSize?: number
  borderColor?: string
}

export const SectionHeader = ({ 
  title, 
  color = '#64748b', 
  fontSize = 7,
  borderColor,
}: SectionHeaderProps) => (
  <Text style={{
    fontSize,
    fontWeight: 700,
    color,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: borderColor ? 4 : 0,
    borderBottomWidth: borderColor ? 1 : 0,
    borderBottomColor: borderColor,
  }}>
    {title}
  </Text>
)

// ============ INFO ROW ============
interface InfoRowProps {
  label: string
  value?: string
  labelColor?: string
  valueColor?: string
  labelSize?: number
  valueSize?: number
}

export const InfoRow = ({
  label,
  value,
  labelColor = '#64748b',
  valueColor = '#1e293b',
  labelSize = 8,
  valueSize = 9,
}: InfoRowProps) => {
  if (!value) return null
  
  return (
    <View style={{ flexDirection: 'row', marginBottom: 3 }}>
      <Text style={{ fontSize: labelSize, color: labelColor, width: 70 }}>{label}:</Text>
      <Text style={{ fontSize: valueSize, color: valueColor, fontWeight: 500, flex: 1 }}>{value}</Text>
    </View>
  )
}
