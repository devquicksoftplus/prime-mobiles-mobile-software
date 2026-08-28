'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { TermsSection, formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Classic Professional - Navy (#1e293b)
// Traditional invoice structure, boxed layout, serif headers, conservative spacing

const NAVY = '#1e293b'
const NAVY_LIGHT = '#f1f5f9'
const ACCENT = '#3b82f6'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    backgroundColor: '#ffffff',
    padding: 40,
    paddingBottom: 60,
  },
  outerBorder: {
    borderWidth: 2,
    borderColor: NAVY,
    padding: 25,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 55,
    height: 55,
    objectFit: 'contain',
  },
  companyInfo: {},
  companyName: {
    fontFamily: 'Times-Bold',
    fontSize: 18,
    color: NAVY,
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 1,
  },
  invoiceSection: {
    textAlign: 'right',
  },
  invoiceLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 20,
    color: NAVY,
    marginBottom: 8,
    letterSpacing: 2,
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  invoiceMetaValue: {
    fontFamily: 'Times-Bold',
    color: NAVY,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  infoBox: {
    flex: 1,
    padding: 12,
    backgroundColor: NAVY_LIGHT,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  customerName: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
    color: NAVY,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  deviceSection: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  deviceItem: {
    minWidth: 90,
  },
  deviceLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  deviceValue: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    color: NAVY,
    marginTop: 2,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: NAVY,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
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
    backgroundColor: NAVY_LIGHT,
  },
  tableCell: {
    fontSize: 10,
    color: '#334155',
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontFamily: 'Times-Bold' },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  statusBox: {
    flex: 1,
  },
  totalsBox: {
    width: 200,
    borderWidth: 1,
    borderColor: NAVY,
  },
  totalsHeader: {
    backgroundColor: NAVY,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  totalsTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalsBody: {
    padding: 10,
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
    fontFamily: 'Times-Bold',
    fontSize: 9,
    color: NAVY,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: NAVY,
  },
  grandTotalLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
    color: NAVY,
  },
  grandTotalValue: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    color: NAVY,
  },
  termsSection: {
    marginTop: 'auto',
    paddingTop: 15,
  },
  termsBox: {
    backgroundColor: NAVY_LIGHT,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  termsTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  termsText: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
})

interface ClassicProfessionalTemplateProps {
  data: InvoiceData
}

export const ClassicProfessionalTemplate = ({ data }: ClassicProfessionalTemplateProps) => {
  let rowIndex = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoSection}>
              {data.company.logoUrl && (
                <Image src={data.company.logoUrl} style={styles.logo} />
              )}
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{data.company.name}</Text>
                <Text style={styles.companyDetail}>{data.company.address}</Text>
                <Text style={styles.companyDetail}>{data.company.phone}</Text>
                <Text style={styles.companyDetail}>{data.company.email}</Text>
                {data.company.gstNumber && <Text style={styles.companyDetail}>GST: {data.company.gstNumber}</Text>}
              </View>
            </View>
            <View style={styles.invoiceSection}>
              <Text style={styles.invoiceLabel}>INVOICE</Text>
              <Text style={styles.invoiceMeta}>No: <Text style={styles.invoiceMetaValue}>{data.invoiceNumber}</Text></Text>
              <Text style={styles.invoiceMeta}>Date: <Text style={styles.invoiceMetaValue}>{data.invoiceDate}</Text></Text>
              {data.dueDate && <Text style={styles.invoiceMeta}>Due: <Text style={styles.invoiceMetaValue}>{data.dueDate}</Text></Text>}
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoBox}>
              <Text style={styles.sectionTitle}>Bill To</Text>
              <Text style={styles.customerName}>{data.customer.name}</Text>
              <Text style={styles.infoText}>{data.customer.phone}</Text>
              {data.customer.alternatePhone && <Text style={styles.infoText}>Alternate: {data.customer.alternatePhone}</Text>}
              {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
            </View>
            {(data.deliveryDate || data.warrantyPeriod) && (
              <View style={[styles.infoBox, { flex: 0.6 }]}>
                <Text style={styles.sectionTitle}>Service Details</Text>
                {data.deliveryDate && <Text style={styles.infoText}>Delivery: {data.deliveryDate}</Text>}
                {data.warrantyPeriod && <Text style={styles.infoText}>Warranty: {data.warrantyPeriod}</Text>}
              </View>
            )}
          </View>

          {/* Device Section */}
          {data.device && (
            <View style={styles.deviceSection}>
              <Text style={[styles.sectionTitle, { marginBottom: 10, paddingBottom: 0, borderBottomWidth: 0 }]}>Device Information</Text>
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

          {/* Table */}
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

          {/* Summary */}
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
                    <Text style={[styles.totalValue, { color: ACCENT }]}>- {formatCurrency(data.costs.discount)}</Text>
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
                      <Text style={[styles.totalValue, { color: ACCENT }]}>- {formatCurrency(data.advanceReceived)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={[styles.totalLabel, { fontFamily: 'Times-Bold' }]}>Balance</Text>
                      <Text style={[styles.totalValue, { color: '#dc2626' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Invoice #{data.invoiceNumber}</Text>
            <Text style={styles.footerText}>Thank you for your business</Text>
          </View>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.outerBorder}>
            <View style={{ marginBottom: 20, paddingBottom: 15, borderBottomWidth: 2, borderBottomColor: NAVY }}>
              <Text style={{ fontFamily: 'Times-Bold', fontSize: 18, color: NAVY }}>Additional Information</Text>
              <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
            </View>
            
            {/* Terms & Conditions */}
            {data.termsAndConditions && (
              <View style={{ backgroundColor: NAVY_LIGHT, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 }}>
                <Text style={{ fontFamily: 'Times-Bold', fontSize: 11, color: NAVY, marginBottom: 10 }}>Terms & Conditions</Text>
                <Text style={{ fontSize: 10, color: '#334155', lineHeight: 1.8 }}>{data.termsAndConditions}</Text>
              </View>
            )}
            
            {/* Device Condition Photos */}
            {data.device?.images && data.device.images.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontFamily: 'Times-Bold', fontSize: 11, color: NAVY, marginBottom: 10 }}>Device Condition Photos</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {data.device.images.slice(0, 4).map((imageUrl, index) => (
                    <Image 
                      key={index}
                      src={imageUrl} 
                      style={{ width: 115, height: 85, objectFit: 'cover', borderWidth: 1, borderColor: NAVY }} 
                    />
                  ))}
                </View>
              </View>
            )}
            
            <View style={{ marginTop: 'auto', padding: 15, borderWidth: 1, borderColor: '#e2e8f0' }}>
              <Text style={{ fontFamily: 'Times-Bold', fontSize: 9, color: NAVY, marginBottom: 8 }}>Contact Information</Text>
              <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.name}</Text>
              <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.address}</Text>
              <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.phone} • {data.company.email}</Text>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Page 2</Text>
              <Text style={styles.footerText}>{data.company.name}</Text>
            </View>
          </View>
        </Page>
      )}
    </Document>
  )
}
