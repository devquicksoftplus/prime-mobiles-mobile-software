'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const PRIMARY = '#18181b'
const AMBER = '#f59e0b'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 0,
  },
  header: {
    backgroundColor: PRIMARY,
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
    objectFit: 'contain',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 3,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
  },
  companyDetail: {
    fontSize: 7,
    color: '#a1a1aa',
  },
  invoiceBox: {
    textAlign: 'right',
  },
  invoiceLabel: {
    fontSize: 16,
    fontWeight: 700,
    color: AMBER,
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#d4d4d8',
    marginTop: 2,
  },
  accentBar: {
    height: 3,
    backgroundColor: AMBER,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBox: {
    width: '48%',
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: AMBER,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 11,
    fontWeight: 700,
    color: PRIMARY,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 8,
    color: '#52525b',
    marginBottom: 1,
  },
  deviceRow: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
    padding: 8,
    marginBottom: 12,
    gap: 15,
    borderLeftWidth: 2,
    borderLeftColor: AMBER,
  },
  deviceItem: {
    flexDirection: 'row',
    gap: 4,
  },
  deviceLabel: {
    fontSize: 7,
    color: '#71717a',
  },
  deviceValue: {
    fontSize: 8,
    color: PRIMARY,
    fontWeight: 600,
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: AMBER,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  tableCell: {
    fontSize: 8,
    color: '#27272a',
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
    width: 180,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 8,
    color: '#71717a',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 600,
    color: PRIMARY,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: PRIMARY,
    padding: 8,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: AMBER,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: '#ffffff',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    borderWidth: 2,
  },
  statusPaid: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  statusPending: {
    backgroundColor: '#fffbeb',
    borderColor: AMBER,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 700,
  },
  statusTextPaid: {
    color: '#16a34a',
  },
  statusTextPending: {
    color: '#d97706',
  },
  termsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fafafa',
    borderLeftWidth: 2,
    borderLeftColor: AMBER,
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: PRIMARY,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  termsText: {
    fontSize: 7,
    color: '#52525b',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#a1a1aa',
  },
})

const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

interface DarkHeaderTemplateProps {
  data: InvoiceData
}

export const DarkHeaderTemplate = ({ data }: DarkHeaderTemplateProps) => {
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
        <View style={styles.accentBar} />

        <View style={styles.content}>
          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.sectionLabel}>Bill To</Text>
              <Text style={styles.customerName}>{data.customer.name}</Text>
              <Text style={styles.infoText}>{data.customer.phone}</Text>
              {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
            </View>
            {data.dueDate && (
              <View style={styles.infoBox}>
                <Text style={styles.sectionLabel}>Due Date</Text>
                <Text style={styles.customerName}>{data.dueDate}</Text>
              </View>
            )}
          </View>

          {/* Device */}
          {data.device && (
            <View style={styles.deviceRow}>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceLabel}>Device:</Text>
                <Text style={styles.deviceValue}>{data.device.brand} {data.device.model}</Text>
              </View>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceLabel}>Type:</Text>
                <Text style={styles.deviceValue}>{data.device.type}</Text>
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
                    <Text style={[styles.totalValue, { color: '#16a34a' }]}>- {formatCurrency(data.advanceReceived)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { fontWeight: 700 }]}>Balance</Text>
                    <Text style={[styles.totalValue, { fontWeight: 700, color: '#dc2626' }]}>{formatCurrency(data.balanceDue || 0)}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Status */}
          <View style={[styles.statusRow, isPaid ? styles.statusPaid : styles.statusPending]}>
            <Text style={[styles.statusText, isPaid ? styles.statusTextPaid : styles.statusTextPending]}>
              {isPaid ? '✓ PAID IN FULL' : 'PAYMENT PENDING'}
            </Text>
            {!isPaid && (
              <Text style={[styles.statusText, styles.statusTextPending]}>
                Balance: {formatCurrency(data.balanceDue || data.costs.total)}
              </Text>
            )}
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
          <Text style={styles.footerText}>#{data.invoiceNumber} • {data.company.address}</Text>
          <Text style={styles.footerText}>Thank you!</Text>
        </View>
      </Page>
    </Document>
  )
}
