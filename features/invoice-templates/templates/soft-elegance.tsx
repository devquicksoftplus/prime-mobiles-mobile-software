'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import { formatCurrency, PaymentStatusBadge } from '../components/pdf-primitives'

// Soft Elegance - Rose (#fb7185)
// Rounded corners, soft background colors for sections, gentle typography

const ROSE = '#fb7185'
const ROSE_LIGHT = '#ffe4e6'
const ROSE_DARK = '#e11d48'
const SOFT_GRAY = '#f8fafc'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#fffbfb',
    padding: 30,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: ROSE_LIGHT,
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
    borderRadius: 25,
  },
  companyInfo: {},
  companyName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 1,
  },
  invoiceSection: {
    backgroundColor: ROSE_LIGHT,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  invoiceLabel: {
    fontSize: 10,
    color: ROSE_DARK,
    fontWeight: 600,
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: SOFT_GRAY,
    padding: 15,
    borderRadius: 12,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: ROSE,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  deviceSection: {
    backgroundColor: ROSE_LIGHT,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
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
    color: ROSE_DARK,
    textTransform: 'uppercase',
  },
  deviceValue: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1e293b',
    marginTop: 2,
  },
  table: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: ROSE,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
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
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 20,
  },
  statusBox: {
    flex: 1,
  },
  totalsCard: {
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
    fontWeight: 600,
    color: '#1e293b',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: ROSE,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1e293b',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: ROSE,
  },
  termsSection: {
    marginTop: 'auto',
    paddingTop: 15,
  },
  termsCard: {
    backgroundColor: SOFT_GRAY,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  termsTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: '#1e293b',
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
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ROSE_LIGHT,
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
  footerLove: {
    fontSize: 8,
    color: ROSE,
  },
})

interface SoftEleganceTemplateProps {
  data: InvoiceData
}

export const SoftEleganceTemplate = ({ data }: SoftEleganceTemplateProps) => {
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
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{data.company.name}</Text>
              <Text style={styles.companyDetail}>{data.company.address}</Text>
              <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
              {data.company.gstNumber && <Text style={styles.companyDetail}>GST: {data.company.gstNumber}</Text>}
            </View>
          </View>
          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>{data.invoiceDate}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.sectionLabel}>Bill To</Text>
            <Text style={styles.customerName}>{data.customer.name}</Text>
            <Text style={styles.infoText}>{data.customer.phone}</Text>
            {data.customer.alternatePhone && <Text style={styles.infoText}>Alt: {data.customer.alternatePhone}</Text>}
            {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
          </View>
          {data.dueDate && (
            <View style={[styles.infoCard, { flex: 0.5 }]}>
              <Text style={styles.sectionLabel}>Due Date</Text>
              <Text style={styles.customerName}>{data.dueDate}</Text>
              {data.deliveryDate && <Text style={styles.infoText}>Delivery: {data.deliveryDate}</Text>}
            </View>
          )}
        </View>

        {/* Device Section */}
        {data.device && (
          <View style={styles.deviceSection}>
            <Text style={styles.sectionLabel}>Device Details</Text>
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
                <Text style={[styles.totalValue, { color: ROSE }]}>- {formatCurrency(data.costs.discount)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
            </View>
            {data.advanceReceived && data.advanceReceived > 0 && (
              <>
                <View style={[styles.totalRow, { marginTop: 8 }]}>
                  <Text style={styles.totalLabel}>Advance</Text>
                  <Text style={[styles.totalValue, { color: ROSE }]}>- {formatCurrency(data.advanceReceived)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { fontWeight: 700 }]}>Balance</Text>
                  <Text style={[styles.totalValue, { fontWeight: 700, color: '#dc2626' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          <Text style={styles.footerLove}>♥ Thank you for your business!</Text>
        </View>
      </Page>
      
      {/* Terms & Conditions / Device Photos - Second Page */}
      {(data.termsAndConditions || (data.device?.images && data.device.images.length > 0)) && (
        <Page size="A4" style={styles.page}>
          <View style={{ marginBottom: 25, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: ROSE_LIGHT }}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Additional Information</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>Invoice #{data.invoiceNumber} • {data.company.name}</Text>
          </View>
          
          {/* Terms & Conditions */}
          {data.termsAndConditions && (
            <View style={{ backgroundColor: SOFT_GRAY, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: ROSE_DARK, marginBottom: 10 }}>Terms & Conditions</Text>
              <Text style={{ fontSize: 10, color: '#334155', lineHeight: 1.8 }}>{data.termsAndConditions}</Text>
            </View>
          )}
          
          {/* Device Condition Photos */}
          {data.device?.images && data.device.images.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: ROSE_DARK, marginBottom: 10 }}>Device Condition Photos</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {data.device.images.slice(0, 4).map((imageUrl, index) => (
                  <Image 
                    key={index}
                    src={imageUrl} 
                    style={{ width: 115, height: 85, objectFit: 'cover', borderRadius: 8, borderWidth: 1, borderColor: ROSE }} 
                  />
                ))}
              </View>
            </View>
          )}
          
          <View style={{ marginTop: 'auto', padding: 15, backgroundColor: ROSE_LIGHT, borderRadius: 12 }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: ROSE_DARK, marginBottom: 8 }}>CONTACT US</Text>
            <Text style={{ fontSize: 9, color: '#475569' }}>{data.company.name}</Text>
            <Text style={{ fontSize: 9, color: '#475569' }}>{data.company.address}</Text>
            <Text style={{ fontSize: 9, color: '#475569' }}>{data.company.phone} • {data.company.email}</Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Page 2</Text>
            <Text style={styles.footerLove}>♥</Text>
          </View>
        </Page>
      )}
    </Document>
  )
}
