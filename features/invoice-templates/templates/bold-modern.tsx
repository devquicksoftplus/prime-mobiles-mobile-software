'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const ORANGE = '#ff6b35'
const BLUE = '#004e89'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 0,
  },
  header: {
    backgroundColor: BLUE,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
  },
  companyDetail: {
    fontSize: 7,
    color: '#bfdbfe',
  },
  invoiceBox: {
    backgroundColor: ORANGE,
    padding: 8,
    borderRadius: 4,
  },
  invoiceLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: '#ffffff',
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: ORANGE,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: BLUE,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  infoText: {
    fontSize: 8,
    color: '#4a4a4a',
    marginTop: 1,
  },
  deviceRow: {
    backgroundColor: ORANGE,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 15,
  },
  deviceItem: {
    flexDirection: 'row',
    gap: 4,
  },
  deviceLabel: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.7)',
  },
  deviceValue: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 600,
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: ORANGE,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 8,
    color: '#1a1a1a',
    fontWeight: 600,
  },
  colDescription: { width: '50%' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '19%', textAlign: 'right' },
  colTotal: { width: '19%', textAlign: 'right', fontWeight: 700 },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  totalsBox: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: '#4a4a4a',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 700,
    color: BLUE,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ORANGE,
    padding: 10,
    borderRadius: 4,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
  },
  statusRow: {
    padding: 10,
    textAlign: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 4,
  },
  statusPaid: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  statusPending: {
    backgroundColor: '#fff7ed',
    borderColor: ORANGE,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 700,
  },
  statusTextPaid: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#ea580c',
  },
  termsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: ORANGE,
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: BLUE,
    marginBottom: 4,
  },
  termsText: {
    fontSize: 7,
    color: '#4b5563',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: ORANGE,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    fontWeight: 700,
    color: BLUE,
  },
})

const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

interface BoldModernTemplateProps {
  data: InvoiceData
}

export const BoldModernTemplate = ({ data }: BoldModernTemplateProps) => {
  const isPaid = data.paymentStatus === 'paid'

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
              <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
            </View>
          </View>
          <View style={styles.invoiceBox}>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceDate}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.sectionLabel}>Bill To</Text>
              <Text style={styles.customerName}>{data.customer.name}</Text>
              <Text style={styles.infoText}>{data.customer.phone}</Text>
              {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.sectionLabel}>Date</Text>
              <Text style={styles.infoText}>{data.invoiceDate}</Text>
              {data.dueDate && <Text style={styles.infoText}>Due: {data.dueDate}</Text>}
            </View>
          </View>

          {/* Device */}
          {data.device && (
            <View style={styles.deviceRow}>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceLabel}>Device:</Text>
                <Text style={styles.deviceValue}>{data.device.brand} {data.device.model}</Text>
              </View>
              {data.device.imei && (
                <View style={styles.deviceItem}>
                  <Text style={styles.deviceLabel}>IMEI:</Text>
                  <Text style={styles.deviceValue}>{data.device.imei}</Text>
                </View>
              )}
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
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colDescription]}>Labor / Service</Text>
                <Text style={[styles.tableCell, styles.colQty]}>1</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(data.costs.laborCost)}</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(data.costs.laborCost)}</Text>
              </View>
            )}

            {data.costs.partsCost > 0 && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colDescription]}>Parts</Text>
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

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>{formatCurrency(data.costs.subtotal)}</Text>
              </View>
              {data.costs.taxAmount && data.costs.taxAmount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax</Text>
                  <Text style={styles.totalValue}>{formatCurrency(data.costs.taxAmount)}</Text>
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
                    <Text style={[styles.totalValue, { color: '#10b981' }]}>- {formatCurrency(data.advanceReceived)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { fontWeight: 700 }]}>Balance</Text>
                    <Text style={[styles.totalValue, { color: ORANGE }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Status */}
          <View style={[styles.statusRow, isPaid ? styles.statusPaid : styles.statusPending]}>
            <Text style={[styles.statusText, isPaid ? styles.statusTextPaid : styles.statusTextPending]}>
              {isPaid ? '✓ PAID' : `DUE: ${formatCurrency(data.balanceDue || data.costs.total)}`}
            </Text>
          </View>

          {/* Terms */}
          {data.termsAndConditions && (
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
              <Text style={styles.termsText}>{data.termsAndConditions}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>#{data.invoiceNumber} • THANK YOU</Text>
        </View>
      </Page>

      {/* Second Page for Device Images */}
      {data.device?.images && data.device.images.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.companyName}>Device Condition Photos</Text>
            <Text style={styles.companyDetail}>Invoice #{data.invoiceNumber}</Text>
          </View>
          
          <View style={styles.content}>
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
              {data.device.images.map((imageUrl, index) => (
                <Image 
                  key={index}
                  src={imageUrl} 
                  style={{ 
                    width: 250, 
                    height: 180, 
                    objectFit: 'cover', 
                    borderRadius: 4, 
                    borderWidth: 2, 
                    borderColor: '#f3f4f6' 
                  }} 
                />
              ))}
            </View>
          </View>

          <View style={styles.footer}>
             <Text style={styles.footerText}>#{data.invoiceNumber} • PAGE 2</Text>
          </View>
        </Page>
      )}
    </Document>
  )
}
