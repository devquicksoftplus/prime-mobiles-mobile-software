'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const GRAY = '#363636'
const ORANGE = '#ff9800'
const STEEL = '#607d8b'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#fafafa',
    padding: 0,
  },
  header: {
    backgroundColor: GRAY,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: ORANGE,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 35,
    height: 35,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  companyDetail: {
    fontSize: 7,
    color: '#b0b0b0',
  },
  invoiceBox: {
    borderWidth: 2,
    borderColor: ORANGE,
    padding: 6,
  },
  invoiceLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: '#ffffff',
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: ORANGE,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    borderWidth: 1,
    borderColor: STEEL,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: STEEL,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 10,
    fontWeight: 700,
    color: GRAY,
  },
  infoText: {
    fontSize: 8,
    color: '#5a5a5a',
    marginTop: 1,
  },
  deviceRow: {
    backgroundColor: GRAY,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 15,
    borderLeftWidth: 3,
    borderLeftColor: ORANGE,
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
    color: '#e0e0e0',
  },
  table: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GRAY,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: ORANGE,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 8,
    color: GRAY,
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: STEEL,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: 600,
    color: '#5a5a5a',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 700,
    color: GRAY,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: ORANGE,
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
  statusRow: {
    padding: 10,
    textAlign: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  statusPaid: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  statusPending: {
    backgroundColor: '#fff3e0',
    borderColor: ORANGE,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  statusTextPaid: {
    color: '#2e7d32',
  },
  statusTextPending: {
    color: '#e65100',
  },
  termsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderLeftWidth: 3,
    borderLeftColor: STEEL,
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: GRAY,
    marginBottom: 4,
  },
  termsText: {
    fontSize: 7,
    color: '#5a5a5a',
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
    fontSize: 7,
    fontWeight: 700,
    color: STEEL,
    textTransform: 'uppercase',
  },
})

const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

interface IndustrialModernTemplateProps {
  data: InvoiceData
}

export const IndustrialModernTemplate = ({ data }: IndustrialModernTemplateProps) => {
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
              <Text style={styles.companyDetail}>{data.company.phone}</Text>
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
              <Text style={styles.sectionLabel}>Info</Text>
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
                <Text style={[styles.tableCell, styles.colDescription]}>Labor & Service</Text>
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
                  <View style={[styles.totalRow, { backgroundColor: '#f5f5f5' }]}>
                    <Text style={styles.totalLabel}>Advance</Text>
                    <Text style={[styles.totalValue, { color: '#4caf50' }]}>- {formatCurrency(data.advanceReceived)}</Text>
                  </View>
                  <View style={[styles.totalRow, { backgroundColor: '#f5f5f5', borderBottomWidth: 0 }]}>
                    <Text style={styles.totalLabel}>Balance</Text>
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
          <Text style={styles.footerText}>#{data.invoiceNumber} • Thank You</Text>
        </View>
      </Page>
    </Document>
  )
}
