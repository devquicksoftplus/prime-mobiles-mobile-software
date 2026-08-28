'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const BLACK = '#000000'
const GOLD = '#d4af37'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    padding: 30,
  },
  goldBar: {
    height: 3,
    backgroundColor: GOLD,
    marginBottom: 15,
  },
  header: {
    backgroundColor: BLACK,
    padding: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    margin: 'auto',
    marginBottom: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: GOLD,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 700,
    color: GOLD,
    letterSpacing: 2,
  },
  companyDetail: {
    fontSize: 7,
    color: '#ffffff',
    marginTop: 4,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: BLACK,
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 10,
    color: GOLD,
    fontWeight: 600,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBox: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: GOLD,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: GOLD,
    marginBottom: 4,
    textAlign: 'center',
  },
  customerName: {
    fontSize: 11,
    fontWeight: 700,
    color: BLACK,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 8,
    color: '#4a4a4a',
    marginTop: 2,
    textAlign: 'center',
  },
  deviceRow: {
    backgroundColor: '#fafafa',
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  deviceItem: {
    flexDirection: 'row',
    gap: 4,
  },
  deviceLabel: {
    fontSize: 7,
    color: '#7a7a7a',
  },
  deviceValue: {
    fontSize: 8,
    color: BLACK,
  },
  table: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BLACK,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BLACK,
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
    borderBottomColor: '#d1d5db',
  },
  tableCell: {
    fontSize: 8,
    color: BLACK,
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
    borderWidth: 1,
    borderColor: GOLD,
    padding: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 8,
    color: '#4a4a4a',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 600,
    color: BLACK,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: BLACK,
    padding: 8,
    marginTop: 4,
    marginHorizontal: -10,
    marginBottom: -10,
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
    borderColor: '#10b981',
  },
  statusPending: {
    borderColor: GOLD,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 700,
  },
  statusTextPaid: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#b8860b',
  },
  termsSection: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: GOLD,
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: GOLD,
    marginBottom: 4,
    textAlign: 'center',
  },
  termsText: {
    fontSize: 7,
    color: '#4a4a4a',
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: GOLD,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#7a7a7a',
    fontStyle: 'italic',
  },
})

const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

interface LuxuryBoutiqueTemplateProps {
  data: InvoiceData
}

export const LuxuryBoutiqueTemplate = ({ data }: LuxuryBoutiqueTemplateProps) => {
  const isPaid = data.paymentStatus === 'paid'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.goldBar} />

        {/* Header */}
        <View style={styles.header}>
          {data.company.logoUrl && (
            <Image src={data.company.logoUrl} style={styles.logo} />
          )}
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
          {data.company.gstNumber && <Text style={styles.companyDetail}>GST: {data.company.gstNumber}</Text>}
        </View>

        {/* Invoice Info */}
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <View>
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
          </View>
        </View>

        {data.advanceReceived && data.advanceReceived > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
            <View style={{ width: 200, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 8, color: '#4a4a4a' }}>Balance Due:</Text>
              <Text style={{ fontSize: 10, fontWeight: 700, color: '#dc2626' }}>{formatCurrency(data.balanceDue || 0)}</Text>
            </View>
          </View>
        )}

        {/* Status */}
        <View style={[styles.statusRow, isPaid ? styles.statusPaid : styles.statusPending]}>
          <Text style={[styles.statusText, isPaid ? styles.statusTextPaid : styles.statusTextPending]}>
            {isPaid ? '✓ PAID IN FULL' : `DUE: ${formatCurrency(data.balanceDue || data.costs.total)}`}
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
          <Text style={styles.footerText}>#{data.invoiceNumber} • Thank you for choosing luxury service</Text>
        </View>
      </Page>
    </Document>
  )
}
