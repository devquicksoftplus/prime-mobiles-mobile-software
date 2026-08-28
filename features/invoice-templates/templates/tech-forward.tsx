'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { TermsSection, formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Tech Forward - Cyan (#06b6d4)
// Modern gradient-like accents, flat design, compact data tables

const PRIMARY = '#06b6d4'
const PRIMARY_LIGHT = '#cffafe'
const PRIMARY_DARK = '#0891b2'
const DARK = '#0f172a'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 0,
  },
  headerBar: {
    backgroundColor: DARK,
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
  },
  companyTagline: {
    fontSize: 8,
    color: PRIMARY,
    marginTop: 2,
  },
  invoiceBadge: {
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  invoiceBadgeText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: 1,
  },
  accentBar: {
    height: 4,
    backgroundColor: PRIMARY,
  },
  content: {
    padding: 30,
    paddingBottom: 60,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  metaCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  metaLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: 700,
    color: DARK,
    marginTop: 2,
  },
  infoSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: PRIMARY_DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 700,
    color: DARK,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  deviceSection: {
    marginBottom: 20,
  },
  deviceCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  deviceCard: {
    backgroundColor: PRIMARY_LIGHT,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  deviceText: {
    fontSize: 9,
    color: PRIMARY_DARK,
    fontWeight: 600,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DARK,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontWeight: 700, color: DARK },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 20,
  },
  statusSection: {
    flex: 1,
  },
  totalsCard: {
    width: 220,
    backgroundColor: DARK,
    borderRadius: 8,
    padding: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 600,
    color: '#ffffff',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: PRIMARY,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: PRIMARY,
  },
  termsSection: {
    marginTop: 'auto',
    paddingTop: 15,
  },
  termsBox: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  termsTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  termsText: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DARK,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
  },
  footerAccent: {
    color: PRIMARY,
    fontWeight: 700,
  },
})

interface TechForwardTemplateProps {
  data: InvoiceData
}

export const TechForwardTemplate = ({ data }: TechForwardTemplateProps) => {
  let rowIndex = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View style={styles.logoSection}>
            {data.company.logoUrl && (
              <Image src={data.company.logoUrl} style={styles.logo} />
            )}
            <View>
              <Text style={styles.companyName}>{data.company.name}</Text>
              <Text style={styles.companyTagline}>{data.company.email}</Text>
            </View>
          </View>
          <View style={styles.invoiceBadge}>
            <Text style={styles.invoiceBadgeText}>INVOICE</Text>
          </View>
        </View>
        <View style={styles.accentBar} />

        <View style={styles.content}>
          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Invoice No</Text>
              <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{data.invoiceDate}</Text>
            </View>
            {data.dueDate && (
              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{data.dueDate}</Text>
              </View>
            )}
          </View>

          {/* Company & Customer Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.sectionLabel}>From</Text>
              <Text style={styles.customerName}>{data.company.name}</Text>
              <Text style={styles.infoText}>{data.company.address}</Text>
              <Text style={styles.infoText}>{data.company.phone}</Text>
              {data.company.gstNumber && <Text style={styles.infoText}>GST: {data.company.gstNumber}</Text>}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.sectionLabel}>Bill To</Text>
              <Text style={styles.customerName}>{data.customer.name}</Text>
              <Text style={styles.infoText}>{data.customer.phone}</Text>
              {data.customer.alternatePhone && <Text style={styles.infoText}>Alt: {data.customer.alternatePhone}</Text>}
              {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
            </View>
          </View>

          {/* Device Info - Pill Style */}
          {data.device && (
            <View style={styles.deviceSection}>
              <Text style={styles.sectionLabel}>Device Details</Text>
              <View style={styles.deviceCards}>
                <View style={styles.deviceCard}>
                  <Text style={styles.deviceText}>{data.device.brand} {data.device.model}</Text>
                </View>
                <View style={styles.deviceCard}>
                  <Text style={styles.deviceText}>{data.device.type}</Text>
                </View>
                {data.device.imei && (
                  <View style={styles.deviceCard}>
                    <Text style={styles.deviceText}>IMEI: {data.device.imei}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Items Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>Service / Item</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.colPrice]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>Amount</Text>
            </View>

            {data.costs.laborCost > 0 && (
              <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCell, styles.colDescription]}>Labor / Service Charges</Text>
                <Text style={[styles.tableCell, styles.colQty]}>1</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(data.costs.laborCost)}</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(data.costs.laborCost)}</Text>
              </View>
            )}

            {data.costs.partsCost > 0 && (
              <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCell, styles.colDescription]}>Parts & Components</Text>
                <Text style={[styles.tableCell, styles.colQty]}>1</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(data.costs.partsCost)}</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(data.costs.partsCost)}</Text>
              </View>
            )}

            {data.costs.serviceCost > 0 && (
              <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCell, styles.colDescription]}>Service Fee</Text>
                <Text style={[styles.tableCell, styles.colQty]}>1</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(data.costs.serviceCost)}</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(data.costs.serviceCost)}</Text>
              </View>
            )}
          </View>

          {/* Summary */}
          <View style={styles.summaryRow}>
            <View style={styles.statusSection}>
              <PaymentStatusBadge status={data.paymentStatus || 'pending'} balanceDue={data.balanceDue || data.costs.total} />
            </View>
            <View style={styles.totalsCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>{formatCurrency(data.costs.subtotal)}</Text>
              </View>
              {data.costs.taxAmount && data.costs.taxAmount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax ({data.costs.taxRate}%)</Text>
                  <Text style={styles.totalValue}>{formatCurrency(data.costs.taxAmount)}</Text>
                </View>
              )}
              {data.costs.discount && data.costs.discount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Discount</Text>
                  <Text style={[styles.totalValue, { color: PRIMARY }]}>- {formatCurrency(data.costs.discount)}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
              </View>
              {data.advanceReceived && data.advanceReceived > 0 && (
                <>
                  <View style={[styles.totalRow, { marginTop: 6 }]}>
                    <Text style={styles.totalLabel}>Advance</Text>
                    <Text style={[styles.totalValue, { color: PRIMARY }]}>- {formatCurrency(data.advanceReceived)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { fontWeight: 700, color: '#ffffff' }]}>Balance</Text>
                    <Text style={[styles.totalValue, { color: '#fbbf24' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Invoice <Text style={styles.footerAccent}>#{data.invoiceNumber}</Text></Text>
          <Text style={styles.footerText}>Powered by <Text style={styles.footerAccent}>{data.company.name}</Text></Text>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.headerBar}>
            <Text style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Additional Information</Text>
          </View>
          <View style={styles.accentBar} />
          <View style={styles.content}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 9, color: '#64748b' }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
            </View>
            
            {/* Terms & Conditions */}
            {data.termsAndConditions && (
              <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 }}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: PRIMARY_DARK, marginBottom: 10 }}>Terms & Conditions</Text>
                <Text style={{ fontSize: 10, color: '#334155', lineHeight: 1.8 }}>{data.termsAndConditions}</Text>
              </View>
            )}
            
            {/* Device Condition Photos */}
            {data.device?.images && data.device.images.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: PRIMARY_DARK, marginBottom: 10 }}>Device Condition Photos</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {data.device.images.slice(0, 4).map((imageUrl, index) => (
                    <Image 
                      key={index}
                      src={imageUrl} 
                      style={{ width: 115, height: 85, objectFit: 'cover', borderRadius: 6, borderWidth: 1, borderColor: PRIMARY }} 
                    />
                  ))}
                </View>
              </View>
            )}
            
            <View style={{ marginTop: 'auto', padding: 15, backgroundColor: DARK, borderRadius: 8 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, color: PRIMARY, marginBottom: 8 }}>Contact Us</Text>
              <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{data.company.name}</Text>
              <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{data.company.address}</Text>
              <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{data.company.phone} • {data.company.email}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Page 2</Text>
            <Text style={styles.footerText}>{data.company.name}</Text>
          </View>
        </Page>
      )}
    </Document>
  )
}
