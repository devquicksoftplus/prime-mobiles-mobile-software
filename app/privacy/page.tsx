import Link from "next/link"
import { ArrowLeft, Wrench } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | Konnect",
  description: "Privacy Policy for Konnect - Mobile Repair Billing Software",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 14, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Konnect (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our mobile repair billing software and related services.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              By using Konnect, you consent to the data practices described in this policy. 
              If you do not agree with our policies, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-gray-800 mb-3">2.1 Account Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Your name and email address</li>
              <li>Phone number (optional)</li>
              <li>Shop/business name</li>
              <li>Password (stored in encrypted form)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-3">2.2 Business Data</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              As you use our service, you may input:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Customer names, phone numbers, and addresses</li>
              <li>Device information (brand, model, IMEI)</li>
              <li>Repair details and job card information</li>
              <li>Photos of device conditions</li>
              <li>Invoice and payment records</li>
              <li>Business financial information</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-3">2.3 Automatically Collected Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We automatically collect certain information when you use our service:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Device type and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and feature interactions</li>
              <li>Error logs and performance data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Provide and maintain our services</li>
              <li>Process your transactions and send invoices</li>
              <li>Send you service-related notifications</li>
              <li>Provide customer support</li>
              <li>Improve and optimize our platform</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We take data security seriously and implement multiple layers of protection:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li><strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest</li>
              <li><strong>Cloud Infrastructure:</strong> We use Google Firebase/Cloud Platform with enterprise-grade security</li>
              <li><strong>Access Controls:</strong> Strict role-based access controls protect your data</li>
              <li><strong>Regular Backups:</strong> Automated backups ensure data recovery capability</li>
              <li><strong>Data Isolation:</strong> Each user&apos;s data is stored separately and isolated</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your data is stored on servers located in secure data centers. We retain your data 
              for as long as your account is active or as needed to provide services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> With trusted partners who help us operate our service (e.g., cloud hosting, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Customer&apos;s Data</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you use Konnect to manage customer information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>You are the data controller for your customers&apos; information</li>
              <li>You are responsible for obtaining necessary consents from your customers</li>
              <li>You should inform customers about how their data is stored</li>
              <li>We act as a data processor on your behalf</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              We recommend maintaining your own privacy policy to inform your customers about 
              your data practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your data in a portable format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences</li>
              <li>Analyze how our service is used</li>
              <li>Improve performance and user experience</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              You can control cookies through your browser settings, but disabling cookies may 
              affect the functionality of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our service integrates with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li><strong>Google Firebase:</strong> Authentication and database services</li>
              <li><strong>WhatsApp:</strong> Invoice sharing (only when you initiate sharing)</li>
              <li><strong>Analytics:</strong> To understand usage patterns</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Konnect is not intended for use by individuals under the age of 18. We do not 
              knowingly collect personal information from children. If you become aware that a 
              child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes by:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Posting the new policy on this page</li>
              <li>Updating the &quot;Last updated&quot; date</li>
              <li>Sending you an email notification for material changes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-700 font-medium">Konnect Privacy Team</p>
              <p className="text-gray-600">Email: privacy@konnect.in</p>
              <p className="text-gray-600">Phone: +91 98765 43210</p>
              <p className="text-gray-600 mt-2">
                For data deletion requests, please email: delete@konnect.in
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2026 Konnect. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
