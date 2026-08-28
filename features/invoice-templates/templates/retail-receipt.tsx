'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Retail Receipt - Teal (#14b8a6)
// Compact list style, smaller header, focused on line items

const TEAL = '#14b8a6'
const TEAL_LIGHT = '#ccfbf1'
const TEAL_DARK = '#0d9488'
const DARK = '#0f172a'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomStyle: 'dashed',
    borderBottomColor: '#e2e8f0',
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
    marginBottom: 6,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    color: DARK,
    textAlign: 'center',
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
  },
  invoiceBanner: {
    backgroundColor: TEAL,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  metaItem: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderLeftWidth: 2,
    borderLeftColor: TEAL,
  },
  metaLabel: {
    fontSize: 6,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: 700,
    color: DARK,
    marginTop: 2,
  },
  customerSection: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: TEAL_DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 10,
    fontWeight: 700,
    color: DARK,
    marginBottom: 2,
  },
  customerDetail: {
    fontSize: 8,
    color: '#475569',
  },
  devicePill: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  pill: {
    backgroundColor: TEAL_LIGHT,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 7,
    color: TEAL_DARK,
    fontWeight: 600,
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DARK,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    fontSize: 8,
    color: '#334155',
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontWeight: 700 },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  dashedDivider: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    borderBottomColor: '#e2e8f0',
    marginVertical: 8,
  },
  totalsSection: {
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 600,
    color: DARK,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: TEAL,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: '#ffffff',
  },
  statusSection: {
    marginBottom: 10,
    alignItems: 'center',
  },
  termsSection: {
    marginTop: 'auto',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopStyle: 'dashed',
    borderTopColor: '#e2e8f0',
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: DARK,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  termsText: {
    fontSize: 7,
    color: '#64748b',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopStyle: 'dashed',
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
    textAlign: 'center',
  },
  thankYou: {
    fontSize: 9,
    fontWeight: 700,
    color: TEAL_DARK,
    textAlign: 'center',
    marginTop: 4,
  },
})

interface RetailReceiptTemplateProps {
  data: InvoiceData
}

export const RetailReceiptTemplate = ({ data }: RetailReceiptTemplateProps) => {
  let rowIndex = 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {data.company.logoUrl && (
            <Image src={data.company.logoUrl} style={styles.logo} />
          )}
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text style={styles.companyDetail}>{data.company.address}</Text>
          <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
          {data.company.gstNumber && <Text style={styles.companyDetail}>GST: {data.company.gstNumber}</Text>}
        </View>

        {/* Invoice Banner */}
        <View style={styles.invoiceBanner}>
          <Text style={styles.invoiceLabel}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>
        </View>

        {/* Meta Info */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{data.invoiceDate}</Text>
          </View>
          {data.dueDate && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Due Date</Text>
              <Text style={styles.metaValue}>{data.dueDate}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={[styles.metaValue, { color: data.paymentStatus === 'paid' ? '#16a34a' : TEAL }]}>
              {data.paymentStatus?.toUpperCase() || 'PENDING'}
            </Text>
          </View>
        </View>

        {/* Customer */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionLabel}>Customer</Text>
          <Text style={styles.customerName}>{data.customer.name}</Text>
          <Text style={styles.customerDetail}>{data.customer.phone}</Text>
          {data.customer.address && <Text style={styles.customerDetail}>{data.customer.address}</Text>}
        </View>

        {/* Device Pills */}
        {data.device && (
          <View style={styles.devicePill}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{data.device.brand} {data.device.model}</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{data.device.type}</Text>
            </View>
            {data.device.imei && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>IMEI: {data.device.imei}</Text>
              </View>
            )}
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>Item</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Amt</Text>
          </View>

          {data.costs.laborCost > 0 && (
            <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, styles.colDescription]}>Labor Charges</Text>
              <Text style={[styles.tableCell, styles.colQty]}>1</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(data.costs.laborCost)}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(data.costs.laborCost)}</Text>
            </View>
          )}

          {data.costs.partsCost > 0 && (
            <View style={[styles.tableRow, rowIndex++ % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, styles.colDescription]}>Parts</Text>
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
              <Text style={[styles.totalValue, { color: TEAL }]}>- {formatCurrency(data.costs.discount)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
          </View>
          {data.advanceReceived && data.advanceReceived > 0 && (
            <>
              <View style={[styles.totalRow, { marginTop: 6 }]}>
                <Text style={styles.totalLabel}>Advance Paid</Text>
                <Text style={[styles.totalValue, { color: TEAL }]}>- {formatCurrency(data.advanceReceived)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { fontWeight: 700 }]}>Balance Due</Text>
                <Text style={[styles.totalValue, { fontWeight: 700, color: '#dc2626' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Status */}
        <View style={styles.statusSection}>
          <PaymentStatusBadge status={data.paymentStatus || 'pending'} balanceDue={data.balanceDue || data.costs.total} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          <Text style={styles.thankYou}>Thank you for your business!</Text>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={{ alignItems: 'center', marginBottom: 15, paddingBottom: 12, borderBottomWidth: 2, borderBottomStyle: 'dashed', borderBottomColor: '#e2e8f0' }}>
            <Text style={{ fontSize: 14, fontWeight: 700, color: DARK }}>Additional Information</Text>
            <Text style={{ fontSize: 7, color: '#64748b', marginTop: 4 }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          </View>
          
          {/* Terms & Conditions */}
          {data.termsAndConditions && (
            <View style={{ backgroundColor: TEAL_LIGHT, padding: 20, borderRadius: 4, marginBottom: 15 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, color: TEAL_DARK, marginBottom: 8 }}>Terms & Conditions</Text>
              <Text style={{ fontSize: 9, color: '#334155', lineHeight: 1.8 }}>{data.termsAndConditions}</Text>
            </View>
          )}
          
          {/* Device Condition Photos */}
          {data.device?.images && data.device.images.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 9, fontWeight: 700, color: TEAL_DARK, marginBottom: 8 }}>Device Condition Photos</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {data.device.images.slice(0, 4).map((imageUrl, index) => (
                  <Image 
                    key={index}
                    src={imageUrl} 
                    style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 4, borderWidth: 1, borderColor: TEAL }} 
                  />
                ))}
              </View>
            </View>
          )}
          
          <View style={{ marginTop: 'auto', padding: 15, backgroundColor: '#f8fafc', borderLeftWidth: 2, borderLeftColor: TEAL }}>
            <Text style={{ fontSize: 7, fontWeight: 700, color: TEAL_DARK, marginBottom: 6 }}>CONTACT US</Text>
            <Text style={{ fontSize: 8, color: '#475569' }}>{data.company.name}</Text>
            <Text style={{ fontSize: 8, color: '#475569' }}>{data.company.address}</Text>
            <Text style={{ fontSize: 8, color: '#475569' }}>{data.company.phone} • {data.company.email}</Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Page 2</Text>
            <Text style={styles.thankYou}>♥</Text>
          </View>
        </Page>
      )}
    </Document>
  )
}
