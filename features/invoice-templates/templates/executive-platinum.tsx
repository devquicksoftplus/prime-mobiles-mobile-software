'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const PRIMARY = '#1a1a2e'
const GOLD = '#c9a961'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 25,
  },
  goldBar: {
    height: 2,
    backgroundColor: GOLD,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
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
    fontSize: 14,
    fontWeight: 700,
    color: PRIMARY,
    letterSpacing: 0.5,
  },
  companyDetail: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 1,
  },
  invoiceTitle: {
    textAlign: 'right',
  },
  invoiceLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: GOLD,
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 10,
    color: PRIMARY,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBox: {
    width: '48%',
    padding: 10,
    backgroundColor: '#fafafa',
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: GOLD,
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
    color: '#4b5563',
    marginBottom: 1,
  },
  deviceRow: {
    backgroundColor: PRIMARY,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  deviceItem: {
    flexDirection: 'row',
    gap: 4,
  },
  deviceLabel: {
    fontSize: 7,
    color: '#9ca3af',
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
    backgroundColor: PRIMARY,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: GOLD,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableCell: {
    fontSize: 8,
    color: PRIMARY,
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
    color: '#6b7280',
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
    color: GOLD,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: GOLD,
  },
  statusRow: {
    padding: 10,
    textAlign: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  statusPaid: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  statusPending: {
    backgroundColor: '#fffbeb',
    borderColor: GOLD,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 700,
  },
  statusTextPaid: {
    color: '#16a34a',
  },
  statusTextPending: {
    color: '#b8860b',
  },
  termsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: GOLD,
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
    color: '#6b7280',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    right: 25,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: GOLD,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#9ca3af',
  },
})

const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

interface ExecutivePlatinumTemplateProps {
  data: InvoiceData
}

export const ExecutivePlatinumTemplate = ({ data }: ExecutivePlatinumTemplateProps) => {
  const isPaid = data.paymentStatus === 'paid'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.goldBar} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {data.company.logoUrl && (
              <Image src={data.company.logoUrl} style={styles.logo} />
            )}
            <View>
              <Text style={styles.companyName}>{data.company.name}</Text>
              <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
              <Text style={styles.companyDetail}>{data.company.address}</Text>
              {data.company.gstNumber && <Text style={styles.companyDetail}>GST: {data.company.gstNumber}</Text>}
            </View>
          </View>
          <View style={styles.invoiceTitle}>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceDate}</Text>
          </View>
        </View>

        {/* Customer Info */}
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

        {/* Device Info */}
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
            {isPaid ? '✓ PAID IN FULL' : `BALANCE DUE: ${formatCurrency(data.balanceDue || data.costs.total)}`}
          </Text>
        </View>

        {/* Terms */}
        {data.termsAndConditions && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>{data.termsAndConditions}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>#{data.invoiceNumber} • Thank you for your business</Text>
        </View>
      </Page>
    </Document>
  )
}
