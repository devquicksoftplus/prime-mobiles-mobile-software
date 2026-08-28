'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { TermsSection, formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Executive Suite - Slate Gray (#475569) & Gold (#d97706)
// Serif fonts style, elegant horizontal dividers, sophisticated feel

const SLATE = '#475569'
const SLATE_LIGHT = '#f1f5f9'
const GOLD = '#d97706'
const GOLD_LIGHT = '#fef3c7'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    backgroundColor: '#ffffff',
    padding: 35,
    paddingBottom: 60,
  },
  headerBorder: {
    borderWidth: 1,
    borderColor: GOLD,
    padding: 20,
    marginBottom: 25,
  },
  header: {
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
    width: 55,
    height: 55,
    objectFit: 'contain',
  },
  companyInfo: {
  },
  companyName: {
    fontFamily: 'Times-Bold',
    fontSize: 18,
    color: SLATE,
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
    fontSize: 22,
    color: GOLD,
    letterSpacing: 3,
    marginBottom: 6,
  },
  invoiceMeta: {
    fontSize: 9,
    color: SLATE,
    marginBottom: 2,
  },
  invoiceMetaValue: {
    fontFamily: 'Times-Bold',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: GOLD,
    marginVertical: 20,
  },
  thinDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: GOLD_LIGHT,
  },
  customerName: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    color: '#0f172a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 10,
    color: SLATE,
    marginBottom: 2,
  },
  deviceSection: {
    backgroundColor: SLATE_LIGHT,
    padding: 15,
    marginBottom: 20,
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
    letterSpacing: 0.5,
  },
  deviceValue: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    color: SLATE,
    marginTop: 2,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
    paddingBottom: 8,
    marginBottom: 0,
  },
  tableHeaderCell: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    color: SLATE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    width: 220,
    borderWidth: 1,
    borderColor: GOLD,
    padding: 15,
  },
  totalsTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: SLATE,
  },
  totalValue: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    color: '#1e293b',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: GOLD,
  },
  grandTotalLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    color: '#0f172a',
  },
  grandTotalValue: {
    fontFamily: 'Times-Bold',
    fontSize: 14,
    color: GOLD,
  },
  termsBox: {
    marginTop: 'auto',
    paddingTop: 15,
  },
  termsContainer: {
    backgroundColor: SLATE_LIGHT,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  termsTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    color: SLATE,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  termsText: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: GOLD,
  },
  footerText: {
    fontSize: 8,
    color: SLATE,
    fontStyle: 'italic',
  },
})

interface ExecutiveSuiteTemplateProps {
  data: InvoiceData
}

export const ExecutiveSuiteTemplate = ({ data }: ExecutiveSuiteTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Border */}
        <View style={styles.headerBorder}>
          <View style={styles.header}>
            <View style={styles.logoSection}>
              {data.company.logoUrl && (
                <Image src={data.company.logoUrl} style={styles.logo} />
              )}
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{data.company.name}</Text>
                <Text style={styles.companyDetail}>{data.company.address}</Text>
                <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
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
        </View>

        {/* Customer & Delivery Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.customerName}>{data.customer.name}</Text>
            <Text style={styles.infoText}>{data.customer.phone}</Text>
            {data.customer.alternatePhone && <Text style={styles.infoText}>Alternate: {data.customer.alternatePhone}</Text>}
            {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
          </View>
          {(data.deliveryDate || data.warrantyPeriod) && (
            <View style={styles.infoBox}>
              <Text style={styles.sectionTitle}>Service Details</Text>
              {data.deliveryDate && <Text style={styles.infoText}>Expected Delivery: {data.deliveryDate}</Text>}
              {data.warrantyPeriod && <Text style={styles.infoText}>Warranty Period: {data.warrantyPeriod}</Text>}
            </View>
          )}
        </View>

        {/* Device Info */}
        {data.device && (
          <View style={styles.deviceSection}>
            <Text style={[styles.sectionTitle, { marginBottom: 10, borderBottomWidth: 0 }]}>Device Information</Text>
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
              {data.device.condition && (
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceLabel}>Condition</Text>
                  <Text style={styles.deviceValue}>{data.device.condition}</Text>
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
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDescription]}>Professional Labor Charges</Text>
              <Text style={[styles.tableCell, styles.colQty]}>1</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(data.costs.laborCost)}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(data.costs.laborCost)}</Text>
            </View>
          )}

          {data.costs.partsCost > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDescription]}>Parts & Components</Text>
              <Text style={[styles.tableCell, styles.colQty]}>1</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(data.costs.partsCost)}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(data.costs.partsCost)}</Text>
            </View>
          )}

          {data.costs.serviceCost > 0 && (
            <View style={styles.tableRow}>
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
            <Text style={styles.totalsTitle}>Payment Summary</Text>
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
                <Text style={[styles.totalValue, { color: GOLD }]}>- {formatCurrency(data.costs.discount)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Due</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
            </View>
            {data.advanceReceived && data.advanceReceived > 0 && (
              <>
                <View style={[styles.totalRow, { marginTop: 8 }]}>
                  <Text style={styles.totalLabel}>Advance Received</Text>
                  <Text style={[styles.totalValue, { color: GOLD }]}>- {formatCurrency(data.advanceReceived)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { fontFamily: 'Times-Bold' }]}>Balance</Text>
                  <Text style={[styles.totalValue, { color: '#dc2626' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          <Text style={styles.footerText}>We appreciate your business</Text>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={{ marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: GOLD }}>
            <Text style={{ fontFamily: 'Times-Bold', fontSize: 18, color: SLATE }}>Additional Information</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          </View>
          
          {/* Terms & Conditions */}
          {data.termsAndConditions && (
            <View style={{ backgroundColor: SLATE_LIGHT, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 }}>
              <Text style={{ fontFamily: 'Times-Bold', fontSize: 11, color: SLATE, marginBottom: 10 }}>Terms & Conditions</Text>
              <Text style={{ fontSize: 10, color: '#334155', lineHeight: 1.8 }}>{data.termsAndConditions}</Text>
            </View>
          )}
          
          {/* Device Condition Photos */}
          {data.device?.images && data.device.images.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontFamily: 'Times-Bold', fontSize: 11, color: SLATE, marginBottom: 10 }}>Device Condition Photos</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {data.device.images.slice(0, 4).map((imageUrl, index) => (
                  <Image 
                    key={index}
                    src={imageUrl} 
                    style={{ width: 115, height: 85, objectFit: 'cover', borderWidth: 1, borderColor: GOLD }} 
                  />
                ))}
              </View>
            </View>
          )}
          
          <View style={{ marginTop: 'auto', padding: 15, borderWidth: 1, borderColor: GOLD }}>
            <Text style={{ fontFamily: 'Times-Bold', fontSize: 9, color: SLATE, marginBottom: 8 }}>Contact Us</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.name}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.address}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{data.company.phone} • {data.company.email}</Text>
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
