'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { TermsSection, formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Bold Impact - Red (#dc2626)
// High contrast black header, bold section titles, thick borders

const RED = '#dc2626'
const RED_LIGHT = '#fee2e2'
const RED_DARK = '#b91c1c'
const BLACK = '#0f172a'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 0,
  },
  topHeader: {
    backgroundColor: BLACK,
    paddingVertical: 25,
    paddingHorizontal: 30,
  },
  headerContent: {
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
    width: 50,
    height: 50,
    objectFit: 'contain',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 4,
  },
  companyInfo: {},
  companyName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 2,
  },
  companyTagline: {
    fontSize: 9,
    color: RED,
    fontWeight: 600,
  },
  invoiceBox: {
    textAlign: 'right',
  },
  invoiceLabel: {
    fontSize: 28,
    fontWeight: 700,
    color: RED,
    letterSpacing: 3,
  },
  invoiceNumber: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  redStripe: {
    height: 6,
    backgroundColor: RED,
  },
  content: {
    padding: 30,
    paddingBottom: 60,
  },
  metaStrip: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: BLACK,
  },
  metaItem: {
    flex: 1,
    padding: 12,
    borderRightWidth: 2,
    borderRightColor: BLACK,
  },
  metaItemLast: {
    borderRightWidth: 0,
  },
  metaLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: RED,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: 700,
    color: BLACK,
    marginTop: 3,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: BLACK,
  },
  infoCardHeader: {
    backgroundColor: BLACK,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  infoCardTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoCardBody: {
    padding: 12,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 700,
    color: BLACK,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  deviceSection: {
    backgroundColor: RED_LIGHT,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: RED,
  },
  deviceTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: RED_DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  deviceItem: {
    minWidth: 80,
  },
  deviceLabel: {
    fontSize: 7,
    color: RED_DARK,
    textTransform: 'uppercase',
  },
  deviceValue: {
    fontSize: 10,
    fontWeight: 700,
    color: BLACK,
    marginTop: 2,
  },
  table: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: BLACK,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: RED,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  tableHeaderCell: {
    fontSize: 9,
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
    fontSize: 10,
    color: '#334155',
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontWeight: 700, color: BLACK },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 20,
  },
  statusBox: {
    flex: 1,
  },
  totalsBox: {
    width: 220,
    borderWidth: 2,
    borderColor: BLACK,
  },
  totalsHeader: {
    backgroundColor: BLACK,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  totalsTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalsBody: {
    padding: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 700,
    color: BLACK,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 3,
    borderTopColor: RED,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: BLACK,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: RED,
  },
  termsSection: {
    marginTop: 'auto',
    paddingTop: 15,
  },
  termsBox: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderWidth: 2,
    borderColor: BLACK,
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: BLACK,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BLACK,
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
    color: RED,
    fontWeight: 700,
  },
})

interface BoldImpactTemplateProps {
  data: InvoiceData
}

export const BoldImpactTemplate = ({ data }: BoldImpactTemplateProps) => {
  let rowIndex = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.topHeader}>
          <View style={styles.headerContent}>
            <View style={styles.logoSection}>
              {data.company.logoUrl && (
                <Image src={data.company.logoUrl} style={styles.logo} />
              )}
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{data.company.name}</Text>
                <Text style={styles.companyTagline}>{data.company.phone}</Text>
              </View>
            </View>
            <View style={styles.invoiceBox}>
              <Text style={styles.invoiceLabel}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>
            </View>
          </View>
        </View>
        <View style={styles.redStripe} />

        <View style={styles.content}>
          {/* Meta Strip */}
          <View style={styles.metaStrip}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Invoice Date</Text>
              <Text style={styles.metaValue}>{data.invoiceDate}</Text>
            </View>
            {data.dueDate && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{data.dueDate}</Text>
              </View>
            )}
            <View style={[styles.metaItem, styles.metaItemLast]}>
              <Text style={styles.metaLabel}>Total Amount</Text>
              <Text style={[styles.metaValue, { color: RED }]}>{formatCurrency(data.costs.total)}</Text>
            </View>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
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
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardTitle}>From</Text>
              </View>
              <View style={styles.infoCardBody}>
                <Text style={styles.customerName}>{data.company.name}</Text>
                <Text style={styles.infoText}>{data.company.address}</Text>
                <Text style={styles.infoText}>{data.company.email}</Text>
                {data.company.gstNumber && <Text style={styles.infoText}>GST: {data.company.gstNumber}</Text>}
              </View>
            </View>
          </View>

          {/* Device Section */}
          {data.device && (
            <View style={styles.deviceSection}>
              <Text style={styles.deviceTitle}>Device Information</Text>
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
                <Text style={styles.totalsTitle}>Payment Summary</Text>
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
                    <Text style={[styles.totalValue, { color: RED }]}>- {formatCurrency(data.costs.discount)}</Text>
                  </View>
                )}
                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>Total Due</Text>
                  <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
                </View>
                {data.advanceReceived && data.advanceReceived > 0 && (
                  <>
                    <View style={[styles.totalRow, { marginTop: 8 }]}>
                      <Text style={styles.totalLabel}>Advance</Text>
                      <Text style={[styles.totalValue, { color: RED }]}>- {formatCurrency(data.advanceReceived)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={[styles.totalLabel, { fontWeight: 700 }]}>Balance</Text>
                      <Text style={[styles.totalValue, { color: '#dc2626' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Invoice <Text style={styles.footerAccent}>#{data.invoiceNumber}</Text></Text>
          <Text style={styles.footerText}><Text style={styles.footerAccent}>{data.company.name}</Text> - Thank you!</Text>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.topHeader}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>Additional Information</Text>
          </View>
          <View style={styles.redStripe} />
          <View style={styles.content}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 9, color: '#64748b' }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
            </View>
            
            {/* Terms & Conditions */}
            {data.termsAndConditions && (
              <View style={{ backgroundColor: '#f8fafc', padding: 20, borderWidth: 2, borderColor: BLACK, marginBottom: 20 }}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: RED_DARK, marginBottom: 10 }}>Terms & Conditions</Text>
                <Text style={{ fontSize: 10, color: '#334155', lineHeight: 1.8 }}>{data.termsAndConditions}</Text>
              </View>
            )}
            
            {/* Device Condition Photos */}
            {data.device?.images && data.device.images.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: RED_DARK, marginBottom: 10 }}>Device Condition Photos</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {data.device.images.slice(0, 4).map((imageUrl, index) => (
                    <Image 
                      key={index}
                      src={imageUrl} 
                      style={{ width: 115, height: 85, objectFit: 'cover', borderWidth: 2, borderColor: RED }} 
                    />
                  ))}
                </View>
              </View>
            )}
            
            <View style={{ marginTop: 'auto', padding: 15, backgroundColor: RED_LIGHT, borderWidth: 2, borderColor: RED }}>
              <Text style={{ fontSize: 9, fontWeight: 700, color: RED_DARK, marginBottom: 8 }}>Contact Us</Text>
              <Text style={{ fontSize: 9, color: '#475569' }}>{data.company.name}</Text>
              <Text style={{ fontSize: 9, color: '#475569' }}>{data.company.address}</Text>
              <Text style={{ fontSize: 9, color: '#475569' }}>{data.company.phone} • {data.company.email}</Text>
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
