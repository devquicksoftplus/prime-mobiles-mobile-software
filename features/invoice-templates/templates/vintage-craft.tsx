'use client'

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from '../types'
import './fonts'

const BROWN = '#6b4423'
const TAN = '#d4a574'
const GREEN = '#2c5f2d'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#faf8f3',
    padding: 30,
  },
  border: {
    borderWidth: 2,
    borderColor: BROWN,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: TAN,
  },
  logo: {
    width: 50,
    height: 50,
    margin: 'auto',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: BROWN,
  },
  companyDetail: {
    fontSize: 7,
    color: '#7a6048',
    marginTop: 2,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: BROWN,
  },
  invoiceNumber: {
    fontSize: 10,
    color: GREEN,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBox: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f9f7f4',
    borderWidth: 1,
    borderColor: TAN,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: GREEN,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 10,
    fontWeight: 700,
    color: BROWN,
  },
  infoText: {
    fontSize: 8,
    color: '#5a452f',
    marginTop: 1,
  },
  deviceRow: {
    backgroundColor: '#f4ede4',
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 15,
    borderWidth: 1,
    borderColor: BROWN,
  },
  deviceItem: {
    flexDirection: 'row',
    gap: 4,
  },
  deviceLabel: {
    fontSize: 7,
    color: '#7a6048',
  },
  deviceValue: {
    fontSize: 8,
    color: BROWN,
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BROWN,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: '#faf8f3',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: TAN,
    backgroundColor: '#fdfcfa',
  },
  tableCell: {
    fontSize: 8,
    color: BROWN,
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
    padding: 10,
    backgroundColor: '#f9f7f4',
    borderWidth: 1,
    borderColor: TAN,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 8,
    color: '#7a6048',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 600,
    color: BROWN,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: BROWN,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: BROWN,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: GREEN,
  },
  statusRow: {
    padding: 10,
    textAlign: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  statusPaid: {
    borderColor: GREEN,
  },
  statusPending: {
    borderColor: '#cd7f32',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 700,
  },
  statusTextPaid: {
    color: GREEN,
  },
  statusTextPending: {
    color: '#cd7f32',
  },
  termsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f7f4',
    borderWidth: 1,
    borderColor: TAN,
  },
  termsTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: GREEN,
    marginBottom: 4,
  },
  termsText: {
    fontSize: 7,
    color: '#5a452f',
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: TAN,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#7a6048',
    fontStyle: 'italic',
  },
})

const formatCurrency = (amount: number): string => {
  return 'Rs. ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

interface VintageCraftTemplateProps {
  data: InvoiceData
}

export const VintageCraftTemplate = ({ data }: VintageCraftTemplateProps) => {
  const isPaid = data.paymentStatus === 'paid'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border}>
          {/* Header */}
          <View style={styles.header}>
            {data.company.logoUrl && (
              <Image src={data.company.logoUrl} style={styles.logo} />
            )}
            <Text style={styles.companyName}>{data.company.name}</Text>
            <Text style={styles.companyDetail}>{data.company.phone} • {data.company.email}</Text>
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
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(data.costs.total)}</Text>
              </View>
              {data.advanceReceived && data.advanceReceived > 0 && (
                <>
                  <View style={[styles.totalRow, { marginTop: 6 }]}>
                    <Text style={styles.totalLabel}>Advance</Text>
                    <Text style={[styles.totalValue, { color: GREEN }]}>- {formatCurrency(data.advanceReceived)}</Text>
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
              {isPaid ? 'PAID' : 'PENDING'}
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
        </View>
      </Page>
    </Document>
  )
}
