'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { TermsSection, formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Corporate Pro - Royal Blue (#2563eb)
// Structured grid, bordered sections, traditional right-aligned header

const PRIMARY = '#2563eb'
const PRIMARY_LIGHT = '#dbeafe'
const PRIMARY_DARK = '#1d4ed8'
const GRAY = '#475569'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 0,
  },
  topBar: {
    backgroundColor: PRIMARY,
    height: 8,
  },
  content: {
    padding: 30,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  companySection: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  logo: {
    width: 45,
    height: 45,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
  },
  companyDetails: {
    marginTop: 4,
  },
  companyDetail: {
    fontSize: 8,
    color: GRAY,
    marginBottom: 1,
  },
  invoiceBox: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 4,
    minWidth: 150,
  },
  invoiceLabel: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 2,
  },
  invoiceValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 8,
  },
  infoSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  infoCardHeader: {
    backgroundColor: PRIMARY_LIGHT,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoCardTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: PRIMARY_DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardBody: {
    padding: 12,
  },
  customerName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 2,
  },
  deviceSection: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  deviceHeader: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  deviceTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 15,
  },
  deviceItem: {
    minWidth: 80,
  },
  deviceLabel: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  deviceValue: {
    fontSize: 9,
    color: '#0f172a',
    fontWeight: 600,
    marginTop: 2,
  },
  table: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontWeight: 700 },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 20,
  },
  statusBox: {
    flex: 1,
  },
  totalsBox: {
    width: 220,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalsHeader: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  totalsTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: GRAY,
    textTransform: 'uppercase',
  },
  totalsBody: {
    padding: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: GRAY,
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 600,
    color: '#1e293b',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: PRIMARY,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: PRIMARY,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
})

interface CorporateProTemplateProps {
  data: InvoiceData
}

export const CorporateProTemplate = ({ data }: CorporateProTemplateProps) => {
  let rowIndex = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.companySection}>
              <View style={styles.logoRow}>
                {data.company.logoUrl && (
                  <Image src={data.company.logoUrl} style={styles.logo} />
                )}
                <Text style={styles.companyName}>{data.company.name}</Text>
              </View>
              <View style={styles.companyDetails}>
                <Text style={styles.companyDetail}>{data.company.address}</Text>
                <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
                {data.company.gstNumber && <Text style={styles.companyDetail}>GST: {data.company.gstNumber}</Text>}
              </View>
            </View>
            <View style={styles.invoiceBox}>
              <Text style={styles.invoiceLabel}>Invoice Number</Text>
              <Text style={styles.invoiceValue}>{data.invoiceNumber}</Text>
              <View style={styles.invoiceDivider} />
              <Text style={styles.invoiceLabel}>Date</Text>
              <Text style={styles.invoiceValue}>{data.invoiceDate}</Text>
              {data.dueDate && (
                <>
                  <View style={styles.invoiceDivider} />
                  <Text style={styles.invoiceLabel}>Due Date</Text>
                  <Text style={styles.invoiceValue}>{data.dueDate}</Text>
                </>
              )}
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardTitle}>Bill To</Text>
              </View>
              <View style={styles.infoCardBody}>
                <Text style={styles.customerName}>{data.customer.name}</Text>
                <Text style={styles.infoText}>{data.customer.phone}</Text>
                {data.customer.alternatePhone && <Text style={styles.infoText}>Alt: {data.customer.alternatePhone}</Text>}
                {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
              </View>
            </View>
            {data.deliveryDate && (
              <View style={[styles.infoCard, { flex: 0.5 }]}>
                <View style={styles.infoCardHeader}>
                  <Text style={styles.infoCardTitle}>Delivery</Text>
                </View>
                <View style={styles.infoCardBody}>
                  <Text style={styles.customerName}>{data.deliveryDate}</Text>
                  {data.warrantyPeriod && <Text style={styles.infoText}>Warranty: {data.warrantyPeriod}</Text>}
                </View>
              </View>
            )}
          </View>

          {/* Device Info */}
          {data.device && (
            <View style={styles.deviceSection}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceTitle}>Device Information</Text>
              </View>
              <View style={styles.deviceGrid}>
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceLabel}>Brand</Text>
                  <Text style={styles.deviceValue}>{data.device.brand}</Text>
                </View>
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceLabel}>Model</Text>
                  <Text style={styles.deviceValue}>{data.device.model}</Text>
                </View>
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceLabel}>Type</Text>
                  <Text style={styles.deviceValue}>{data.device.type}</Text>
                </View>
                {data.device.imei && (
                  <View style={styles.deviceItem}>
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

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <View style={styles.statusBox}>
              <PaymentStatusBadge status={data.paymentStatus || 'pending'} balanceDue={data.balanceDue || data.costs.total} />
            </View>
            <View style={styles.totalsBox}>
              <View style={styles.totalsHeader}>
                <Text style={styles.totalsTitle}>Summary</Text>
              </View>
              <View style={styles.totalsBody}>
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
                      <Text style={[styles.totalLabel, { fontWeight: 700 }]}>Balance</Text>
                      <Text style={[styles.totalValue, { fontWeight: 700, color: '#dc2626' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          <Text style={styles.footerText}>Thank you for choosing us!</Text>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.topBar} />
          <View style={styles.content}>
            <View style={{ marginBottom: 20, paddingBottom: 15, borderBottomWidth: 2, borderBottomColor: PRIMARY }}>
              <Text style={{ fontSize: 18, fontWeight: 700, color: PRIMARY_DARK }}>Additional Information</Text>
              <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
            </View>
            
            {/* Terms & Conditions */}
            {data.termsAndConditions && (
              <View style={{ backgroundColor: PRIMARY_LIGHT, padding: 20, borderRadius: 4, borderWidth: 1, borderColor: PRIMARY, marginBottom: 20 }}>
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
                      style={{ width: 115, height: 85, objectFit: 'cover', borderRadius: 4, borderWidth: 1, borderColor: PRIMARY }} 
                    />
                  ))}
                </View>
              </View>
            )}
            
            <View style={{ marginTop: 'auto', padding: 15, backgroundColor: '#f8fafc', borderRadius: 4 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Contact Us</Text>
              <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.name}</Text>
              <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.address}</Text>
              <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.phone} • {data.company.email}</Text>
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
