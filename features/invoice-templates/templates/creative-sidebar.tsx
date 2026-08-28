'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const PRIMARY = '#7c3aed'
const SECONDARY = '#a78bfa'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  sidebar: {
    width: 140,
    backgroundColor: PRIMARY,
    padding: 15,
    paddingTop: 25,
  },
  sidebarLogo: {
    width: 50,
    height: 50,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 3,
  },
  sidebarCompanyName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 15,
  },
  sidebarSection: {
    marginBottom: 12,
  },
  sidebarLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: SECONDARY,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sidebarText: {
    fontSize: 8,
    color: '#e9d5ff',
    marginBottom: 2,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: SECONDARY,
    marginVertical: 12,
    opacity: 0.5,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: PRIMARY,
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
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
    color: PRIMARY,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 8,
    color: '#4b5563',
    marginBottom: 1,
  },
  deviceRow: {
    flexDirection: 'row',
    backgroundColor: '#faf5ff',
    padding: 8,
    marginBottom: 12,
    gap: 15,
    borderLeftWidth: 2,
    borderLeftColor: PRIMARY,
  },
  deviceItem: {
    flexDirection: 'row',
    gap: 4,
  },
  deviceLabel: {
    fontSize: 7,
    color: '#6b7280',
  },
  deviceValue: {
    fontSize: 8,
    color: '#374151',
    fontWeight: 600,
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: PRIMARY,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCell: {
    fontSize: 8,
    color: '#374151',
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
    width: 160,
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
    backgroundColor: PRIMARY,
    padding: 8,
    marginTop: 4,
    borderRadius: 4,
  },
  grandTotalLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
  },
  statusRow: {
    padding: 10,
    textAlign: 'center',
    marginBottom: 12,
    borderRadius: 4,
  },
  statusPaid: {
    backgroundColor: '#dcfce7',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
})

const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

interface CreativeSidebarTemplateProps {
  data: InvoiceData
}

export const CreativeSidebarTemplate = ({ data }: CreativeSidebarTemplateProps) => {
  const isPaid = data.paymentStatus === 'paid'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {data.company.logoUrl && (
            <Image src={data.company.logoUrl} style={styles.sidebarLogo} />
          )}
          <Text style={styles.sidebarCompanyName}>{data.company.name}</Text>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Contact</Text>
            <Text style={styles.sidebarText}>{data.company.phone}</Text>
            {data.company.email && <Text style={styles.sidebarText}>{data.company.email}</Text>}
          </View>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Address</Text>
            <Text style={styles.sidebarText}>{data.company.address}</Text>
          </View>

          {data.company.gstNumber && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarLabel}>GST</Text>
              <Text style={styles.sidebarText}>{data.company.gstNumber}</Text>
            </View>
          )}

          <View style={styles.sidebarDivider} />

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Invoice Date</Text>
            <Text style={styles.sidebarText}>{data.invoiceDate}</Text>
          </View>

          {data.dueDate && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarLabel}>Due Date</Text>
              <Text style={styles.sidebarText}>{data.dueDate}</Text>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>{data.invoiceDate}</Text>
            </View>
          </View>

          {/* Bill To */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.sectionLabel}>Bill To</Text>
              <Text style={styles.customerName}>{data.customer.name}</Text>
              <Text style={styles.infoText}>{data.customer.phone}</Text>
              {data.customer.address && <Text style={styles.infoText}>{data.customer.address}</Text>}
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
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
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
              {isPaid ? '✓ PAID' : `Due: ${formatCurrency(data.balanceDue || data.costs.total)}`}
            </Text>
          </View>

          {/* Terms */}
          {data.termsAndConditions && (
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
              <Text style={styles.termsText}>{data.termsAndConditions}</Text>
            </View>
          )}
          
          {/* Invoice Ref */}
          <Text style={{ fontSize: 6, color: '#9ca3af', marginTop: 10 }}>Ref: #{data.invoiceNumber}</Text>
        </View>
      </Page>
    </Document>
  )
}
