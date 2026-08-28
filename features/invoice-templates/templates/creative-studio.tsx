'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { TermsSection, formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Creative Studio - Violet (#8b5cf6)
// Sidebar layout with brand color background, bold white text for headers

const PRIMARY = '#8b5cf6'
const PRIMARY_LIGHT = '#ede9fe'
const PRIMARY_DARK = '#7c3aed'
const SIDEBAR_WIDTH = 180

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: PRIMARY,
    padding: 20,
    paddingTop: 30,
  },
  sidebarLogo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 5,
  },
  sidebarCompanyName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 8,
  },
  sidebarDetail: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 3,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 15,
  },
  sidebarSection: {
    marginBottom: 15,
  },
  sidebarLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  sidebarValue: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
  },
  sidebarText: {
    fontSize: 9,
    color: '#ffffff',
    marginBottom: 2,
  },
  mainContent: {
    flex: 1,
    padding: 30,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_LIGHT,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: PRIMARY_DARK,
    letterSpacing: 2,
  },
  invoiceSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  customerSection: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  sectionTitle: {
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
    color: '#0f172a',
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  deviceSection: {
    marginBottom: 20,
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  deviceCard: {
    backgroundColor: PRIMARY_LIGHT,
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
  },
  deviceLabel: {
    fontSize: 7,
    color: PRIMARY_DARK,
    textTransform: 'uppercase',
  },
  deviceValue: {
    fontSize: 9,
    fontWeight: 600,
    color: '#0f172a',
    marginTop: 2,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#faf5ff',
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontWeight: 700 },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  totalsBox: {
    width: 200,
    backgroundColor: PRIMARY_LIGHT,
    padding: 15,
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 600,
    color: '#1e293b',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: PRIMARY,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: PRIMARY_DARK,
  },
  statusSection: {
    marginBottom: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: SIDEBAR_WIDTH + 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
})

interface CreativeStudioTemplateProps {
  data: InvoiceData
}

export const CreativeStudioTemplate = ({ data }: CreativeStudioTemplateProps) => {
  let rowIndex = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {data.company.logoUrl && (
            <Image src={data.company.logoUrl} style={styles.sidebarLogo} />
          )}
          <Text style={styles.sidebarCompanyName}>{data.company.name}</Text>
          <Text style={styles.sidebarDetail}>{data.company.address}</Text>
          <Text style={styles.sidebarDetail}>{data.company.phone}</Text>
          <Text style={styles.sidebarDetail}>{data.company.email}</Text>
          {data.company.gstNumber && (
            <Text style={[styles.sidebarDetail, { marginTop: 4 }]}>GST: {data.company.gstNumber}</Text>
          )}

          <View style={styles.sidebarDivider} />

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Invoice #</Text>
            <Text style={styles.sidebarValue}>{data.invoiceNumber}</Text>
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Date</Text>
            <Text style={styles.sidebarValue}>{data.invoiceDate}</Text>
          </View>

          {data.dueDate && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarLabel}>Due Date</Text>
              <Text style={styles.sidebarValue}>{data.dueDate}</Text>
            </View>
          )}

          <View style={styles.sidebarDivider} />

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Total Amount</Text>
            <Text style={[styles.sidebarValue, { fontSize: 16 }]}>{formatCurrency(data.costs.total)}</Text>
          </View>

          {data.balanceDue && data.balanceDue > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarLabel}>Balance Due</Text>
              <Text style={[styles.sidebarValue, { fontSize: 14, color: '#fbbf24' }]}>{formatCurrency(data.balanceDue)}</Text>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceSubtitle}>Service Invoice for {data.customer.name}</Text>
          </View>

          {/* Customer Info */}
          <View style={styles.customerSection}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.customerName}>{data.customer.name}</Text>
            <Text style={styles.customerDetail}>{data.customer.phone}</Text>
            {data.customer.alternatePhone && <Text style={styles.customerDetail}>Alt: {data.customer.alternatePhone}</Text>}
            {data.customer.address && <Text style={styles.customerDetail}>{data.customer.address}</Text>}
          </View>

          {/* Device Info */}
          {data.device && (
            <View style={styles.deviceSection}>
              <Text style={styles.sectionTitle}>Device Details</Text>
              <View style={styles.deviceGrid}>
                <View style={styles.deviceCard}>
                  <Text style={styles.deviceLabel}>Brand</Text>
                  <Text style={styles.deviceValue}>{data.device.brand}</Text>
                </View>
                <View style={styles.deviceCard}>
                  <Text style={styles.deviceLabel}>Model</Text>
                  <Text style={styles.deviceValue}>{data.device.model}</Text>
                </View>
                <View style={styles.deviceCard}>
                  <Text style={styles.deviceLabel}>Type</Text>
                  <Text style={styles.deviceValue}>{data.device.type}</Text>
                </View>
                {data.device.imei && (
                  <View style={styles.deviceCard}>
                    <Text style={styles.deviceLabel}>IMEI</Text>
                    <Text style={styles.deviceValue}>{data.device.imei}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Items Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>Description</Text>
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

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsBox}>
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
                  <Text style={[styles.totalValue, { color: PRIMARY_DARK }]}>- {formatCurrency(data.costs.discount)}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
              </View>
            </View>
          </View>

          {/* Payment Status */}
          <View style={styles.statusSection}>
            <PaymentStatusBadge status={data.paymentStatus || 'pending'} balanceDue={data.balanceDue || data.costs.total} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Invoice #{data.invoiceNumber}</Text>
            <Text style={styles.footerText}>Thank you for your business!</Text>
          </View>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={{ fontFamily: 'Helvetica', fontSize: 9, backgroundColor: '#ffffff', padding: 30 }}>
          <View style={{ marginBottom: 20, paddingBottom: 15, borderBottomWidth: 2, borderBottomColor: PRIMARY }}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: PRIMARY_DARK }}>Additional Information</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          </View>
          
          {/* Terms & Conditions */}
          {data.termsAndConditions && (
            <View style={{ backgroundColor: PRIMARY_LIGHT, padding: 20, borderRadius: 8, borderWidth: 1, borderColor: PRIMARY, marginBottom: 20 }}>
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
                    style={{ width: 115, height: 85, objectFit: 'cover', borderRadius: 8, borderWidth: 1, borderColor: PRIMARY }} 
                  />
                ))}
              </View>
            </View>
          )}
          
          <View style={{ marginTop: 'auto', padding: 15, backgroundColor: '#f8fafc', borderRadius: 8 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Contact Us</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.name}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.address}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.phone} • {data.company.email}</Text>
          </View>
        </Page>
      )}
    </Document>
  )
}
