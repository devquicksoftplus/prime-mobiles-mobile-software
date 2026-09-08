import Link from "next/link"
import { ArrowLeft, Wrench } from "lucide-react"

export const metadata = {
  title: "Terms of Service | Konnect",
  description: "Terms of Service for Konnect - Mobile Repair Billing Software",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/konnect-logo.png" alt="Konnect" className="h-10 w-auto" />
          </Link>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign Up
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: January 14, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By accessing or using Konnect (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our Service. These terms apply to all users, 
              including repair shop owners, technicians, and administrators.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Konnect is a cloud-based software platform designed for mobile phone and electronics repair shops. 
              Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Job card creation and management</li>
              <li>Customer information management</li>
              <li>Invoice generation and billing</li>
              <li>Device condition documentation with photos</li>
              <li>WhatsApp invoice sharing</li>
              <li>Business analytics and reporting</li>
              <li>Inventory management</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To use Konnect, you must create an account by providing accurate and complete information. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your contact information remains current</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Software License & Usage</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Konnect is provided as business management software for your organization. You agree to use the Service in compliance with applicable local laws and standard commercial practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Ownership and Storage</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You retain full ownership of all data you enter into Konnect, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Customer information and contact details</li>
              <li>Job cards and repair records</li>
              <li>Device photos and condition documentation</li>
              <li>Invoices and billing records</li>
              <li>Business and financial data</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              We store your data securely using industry-standard encryption and cloud infrastructure. 
              You may export or delete your data at any time through the application settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree not to use Konnect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Store or transmit malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Share your account credentials with unauthorized users</li>
              <li>Use the service for any illegal or fraudulent purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We strive to maintain 99.9% uptime for our services. However, we do not guarantee 
              uninterrupted access and may occasionally need to perform maintenance or updates. 
              We will provide advance notice for scheduled maintenance when possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To the maximum extent permitted by law, Konnect shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to 
              loss of profits, data, or business opportunities, arising from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Either party may terminate this agreement at any time. Upon termination:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Your access to the Service will be immediately revoked</li>
              <li>You may request an export of your data within 30 days</li>
              <li>We will delete your data after 90 days unless required by law to retain it</li>
              <li>No refunds will be provided for unused subscription periods</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We reserve the right to modify these Terms of Service at any time. We will notify you 
              of significant changes via email or through the application. Your continued use of 
              the Service after changes become effective constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws 
              of India. Any disputes arising from these terms shall be subject to the exclusive 
              jurisdiction of the courts in India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-700 font-medium">Konnect Support</p>
              <p className="text-gray-600">Email: support@konnect.in</p>
              <p className="text-gray-600">Phone: +91 98765 43210</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2026 Konnect. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
