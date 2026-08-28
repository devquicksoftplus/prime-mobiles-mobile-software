'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const CYBER = '#00d9ff'
const PINK = '#ff3366'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: CYBER,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0a0a0a',
  },
  companyDetail: {
    fontSize: 7,
    color: '#6b7280',
  },
  invoiceBox: {
    backgroundColor: '#0a0a0a',
    padding: 8,
    borderRadius: 4,
  },
  invoiceLabel: {
    fontSize: 7,
    color: CYBER,
    marginBottom: 2,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: '#ffffff',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 2,
    borderLeftColor: CYBER,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: '#6b7280',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0a0a0a',
  },
  infoText: {
    fontSize: 8,
    color: '#4b5563',
    marginTop: 1,
  },
  deviceRow: {
    backgroundColor: '#0a0a0a',
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 15,
    borderTopWidth: 2,
    borderTopColor: CYBER,
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
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: CYBER,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableCell: {
    fontSize: 8,
    color: '#1f2937',
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
    color: '#1f2937',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: PINK,
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 12,
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
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  statusText: {
    fontSize: 9,
    fontWeight: 700,
  },
  statusTextPaid: {
    color: '#065f46',
  },
  statusTextPending: {
    color: '#92400e',
  },
  termsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 2,
    borderLeftColor: CYBER,
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: '#0a0a0a',
    marginBottom: 4,
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
    borderTopWidth: 2,
    borderTopColor: CYBER,
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

interface TechMinimalistTemplateProps {
  data: InvoiceData
}

export const TechMinimalistTemplate = ({ data }: TechMinimalistTemplateProps) => {
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

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.sectionLabel}>Bill To</Text>
            <Text style={styles.customerName}>{data.customer.name}</Text>
            <Text style={styles.infoText}>{data.customer.phone}</Text>
            {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.sectionLabel}>Details</Text>
            <Text style={styles.infoText}>Date: {data.invoiceDate}</Text>
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
                  <Text style={[styles.totalValue, { fontWeight: 700 }]}>{formatCurrency(data.balanceDue || 0)}</Text>
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>#{data.invoiceNumber} • {data.company.email}</Text>
        </View>
      </Page>
    </Document>
  )
}
