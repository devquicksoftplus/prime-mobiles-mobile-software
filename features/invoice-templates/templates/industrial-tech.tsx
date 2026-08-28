'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { TermsSection, formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Industrial Tech - Orange (#f97316)
// Monospaced font for numbers, technical lines, "blueprint" aesthetic

const ORANGE = '#f97316'
const ORANGE_LIGHT = '#ffedd5'
const ORANGE_DARK = '#ea580c'
const GRAY = '#374151'
const DARK = '#1f2937'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#fafafa',
    padding: 25,
    paddingBottom: 60,
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: ORANGE,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 45,
    height: 45,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: DARK,
    letterSpacing: 1,
  },
  companyDetail: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: GRAY,
    marginTop: 2,
  },
  invoiceSection: {
    textAlign: 'right',
    backgroundColor: DARK,
    padding: 12,
  },
  invoiceLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 14,
    color: ORANGE,
    letterSpacing: 2,
  },
  invoiceNumber: {
    fontFamily: 'Courier',
    fontSize: 10,
    color: '#ffffff',
    marginTop: 4,
  },
  metaSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 3,
    borderLeftColor: ORANGE,
  },
  metaLabel: {
    fontFamily: 'Courier',
    fontSize: 7,
    color: ORANGE_DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontFamily: 'Courier-Bold',
    fontSize: 10,
    color: DARK,
    marginTop: 3,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoCardHeader: {
    backgroundColor: GRAY,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  infoCardTitle: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoCardBody: {
    padding: 10,
  },
  customerName: {
    fontSize: 11,
    fontWeight: 700,
    color: DARK,
    marginBottom: 3,
  },
  infoText: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: GRAY,
    marginBottom: 2,
  },
  deviceSection: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 15,
  },
  deviceHeader: {
    backgroundColor: ORANGE,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deviceIcon: {
    fontSize: 10,
    color: '#ffffff',
  },
  deviceTitle: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 15,
  },
  deviceItem: {
    minWidth: 80,
  },
  deviceLabel: {
    fontFamily: 'Courier',
    fontSize: 7,
    color: GRAY,
    textTransform: 'uppercase',
  },
  deviceValue: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    color: DARK,
    marginTop: 2,
  },
  table: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DARK,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    color: ORANGE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 9,
    color: GRAY,
  },
  tableCellMono: {
    fontFamily: 'Courier',
    fontSize: 9,
    color: DARK,
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontWeight: 700 },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    gap: 15,
  },
  statusBox: {
    flex: 1,
  },
  totalsBox: {
    width: 220,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  totalsHeader: {
    backgroundColor: DARK,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  totalsTitle: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    color: ORANGE,
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
    fontFamily: 'Courier',
    fontSize: 9,
    color: GRAY,
  },
  totalValue: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    color: DARK,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: ORANGE,
  },
  grandTotalLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 11,
    color: DARK,
  },
  grandTotalValue: {
    fontFamily: 'Courier-Bold',
    fontSize: 12,
    color: ORANGE,
  },
  termsSection: {
    marginTop: 'auto',
    paddingTop: 10,
  },
  termsBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 3,
    borderLeftColor: ORANGE,
  },
  termsTitle: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    color: DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  termsText: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: GRAY,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 25,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: ORANGE,
  },
  footerText: {
    fontFamily: 'Courier',
    fontSize: 7,
    color: GRAY,
  },
})

interface IndustrialTechTemplateProps {
  data: InvoiceData
}

export const IndustrialTechTemplate = ({ data }: IndustrialTechTemplateProps) => {
  let rowIndex = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {data.company.logoUrl && (
              <Image src={data.company.logoUrl} style={styles.logo} />
            )}
            <View>
              <Text style={styles.companyName}>{data.company.name}</Text>
              <Text style={styles.companyDetail}>{data.company.address}</Text>
              <Text style={styles.companyDetail}>{data.company.phone} | {data.company.email}</Text>
              {data.company.gstNumber && <Text style={styles.companyDetail}>GST: {data.company.gstNumber}</Text>}
            </View>
          </View>
          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceLabel}># INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Meta Section */}
        <View style={styles.metaSection}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Invoice Date</Text>
            <Text style={styles.metaValue}>{data.invoiceDate}</Text>
          </View>
          {data.dueDate && (
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Due Date</Text>
              <Text style={styles.metaValue}>{data.dueDate}</Text>
            </View>
          )}
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={[styles.metaValue, { color: data.paymentStatus === 'paid' ? '#16a34a' : ORANGE }]}>
              {data.paymentStatus?.toUpperCase() || 'PENDING'}
            </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Text style={styles.infoCardTitle}>&gt; Bill To</Text>
            </View>
            <View style={styles.infoCardBody}>
              <Text style={styles.customerName}>{data.customer.name}</Text>
              <Text style={styles.infoText}>{data.customer.phone}</Text>
              {data.customer.alternatePhone && <Text style={styles.infoText}>ALT: {data.customer.alternatePhone}</Text>}
              {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
            </View>
          </View>
          {data.deliveryDate && (
            <View style={[styles.infoCard, { flex: 0.6 }]}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardTitle}>&gt; Delivery</Text>
              </View>
              <View style={styles.infoCardBody}>
                <Text style={styles.customerName}>{data.deliveryDate}</Text>
                {data.warrantyPeriod && <Text style={styles.infoText}>WARRANTY: {data.warrantyPeriod}</Text>}
              </View>
            </View>
          )}
        </View>

        {/* Device Section */}
        {data.device && (
          <View style={styles.deviceSection}>
            <View style={styles.deviceHeader}>
              <Text style={styles.deviceIcon}>⚙</Text>
              <Text style={styles.deviceTitle}>Device Specifications</Text>
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
              {data.device.condition && (
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceLabel}>Condition</Text>
                  <Text style={styles.deviceValue}>{data.device.condition}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>SERVICE / ITEM</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>QTY</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>RATE</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>AMOUNT</Text>
          </View>

          {data.costs.laborCost > 0 && (
            <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, styles.colDescription]}>Labor / Service Charges</Text>
              <Text style={[styles.tableCellMono, styles.colQty]}>1</Text>
              <Text style={[styles.tableCellMono, styles.colPrice]}>{formatCurrency(data.costs.laborCost)}</Text>
              <Text style={[styles.tableCellMono, styles.colTotal]}>{formatCurrency(data.costs.laborCost)}</Text>
            </View>
          )}

          {data.costs.partsCost > 0 && (
            <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, styles.colDescription]}>Parts & Components</Text>
              <Text style={[styles.tableCellMono, styles.colQty]}>1</Text>
              <Text style={[styles.tableCellMono, styles.colPrice]}>{formatCurrency(data.costs.partsCost)}</Text>
              <Text style={[styles.tableCellMono, styles.colTotal]}>{formatCurrency(data.costs.partsCost)}</Text>
            </View>
          )}

          {data.costs.serviceCost > 0 && (
            <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, styles.colDescription]}>Service Fee</Text>
              <Text style={[styles.tableCellMono, styles.colQty]}>1</Text>
              <Text style={[styles.tableCellMono, styles.colPrice]}>{formatCurrency(data.costs.serviceCost)}</Text>
              <Text style={[styles.tableCellMono, styles.colTotal]}>{formatCurrency(data.costs.serviceCost)}</Text>
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
              <Text style={styles.totalsTitle}>// PAYMENT SUMMARY</Text>
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
                  <Text style={[styles.totalValue, { color: ORANGE }]}>- {formatCurrency(data.costs.discount)}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>TOTAL</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
              </View>
              {data.advanceReceived && data.advanceReceived > 0 && (
                <>
                  <View style={[styles.totalRow, { marginTop: 6 }]}>
                    <Text style={styles.totalLabel}>Advance</Text>
                    <Text style={[styles.totalValue, { color: ORANGE }]}>- {formatCurrency(data.advanceReceived)}</Text>
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}># {data.invoiceNumber} | {data.company.name}</Text>
          <Text style={styles.footerText}>Generated: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={{ marginBottom: 20, paddingBottom: 15, borderBottomWidth: 3, borderBottomColor: ORANGE }}>
            <Text style={{ fontFamily: 'Courier-Bold', fontSize: 14, color: DARK, letterSpacing: 1 }}>/* ADDITIONAL INFO */</Text>
            <Text style={{ fontFamily: 'Courier', fontSize: 8, color: GRAY, marginTop: 4 }}>Invoice #{data.invoiceNumber} | {data.company.name}</Text>
          </View>
          
          {/* Terms & Conditions */}
          {data.termsAndConditions && (
            <View style={{ backgroundColor: '#ffffff', padding: 20, borderWidth: 1, borderColor: '#e5e7eb', borderLeftWidth: 3, borderLeftColor: ORANGE, marginBottom: 20 }}>
              <Text style={{ fontFamily: 'Courier-Bold', fontSize: 10, color: DARK, marginBottom: 10 }}>// TERMS & CONDITIONS</Text>
              <Text style={{ fontFamily: 'Courier', fontSize: 9, color: GRAY, lineHeight: 1.8 }}>{data.termsAndConditions}</Text>
            </View>
          )}
          
          {/* Device Condition Photos */}
          {data.device?.images && data.device.images.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontFamily: 'Courier-Bold', fontSize: 10, color: DARK, marginBottom: 10 }}>// DEVICE PHOTOS</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {data.device.images.slice(0, 4).map((imageUrl, index) => (
                  <Image 
                    key={index}
                    src={imageUrl} 
                    style={{ width: 115, height: 85, objectFit: 'cover', borderWidth: 1, borderColor: ORANGE }} 
                  />
                ))}
              </View>
            </View>
          )}
          
          <View style={{ marginTop: 'auto', backgroundColor: '#ffffff', padding: 15, borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Text style={{ fontFamily: 'Courier-Bold', fontSize: 8, color: DARK, marginBottom: 8 }}>// CONTACT INFO</Text>
            <Text style={{ fontFamily: 'Courier', fontSize: 8, color: GRAY }}>{data.company.name}</Text>
            <Text style={{ fontFamily: 'Courier', fontSize: 8, color: GRAY }}>{data.company.address}</Text>
            <Text style={{ fontFamily: 'Courier', fontSize: 8, color: GRAY }}>{data.company.phone} | {data.company.email}</Text>
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
