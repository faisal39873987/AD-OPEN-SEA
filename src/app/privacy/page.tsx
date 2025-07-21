'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <Link href="/">
              <img
                className="mx-auto h-12 w-auto"
                src="/logos/logo-light.png"
                alt="AD Pulse"
              />
            </Link>
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Last updated: June 1, 2023
            </p>
          </div>

          <div className="mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border dark:border-gray-700">
            <div className="px-4 py-5 sm:p-6 prose dark:prose-invert max-w-none">
              <h2>1. Introduction</h2>
              <p>
                This Privacy Policy describes how AD Pulse ("we," "our," or "us") collects, uses, and shares your personal information when you use our website, mobile applications, and services (collectively, the "Services").
              </p>
              <p>
                By using our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, do not use our Services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                <strong>Information You Provide to Us:</strong> We collect information you provide directly to us when you:
              </p>
              <ul>
                <li>Create or modify your account</li>
                <li>Complete a form</li>
                <li>Communicate with us</li>
                <li>Use our Services</li>
              </ul>
              <p>
                This information may include your name, email address, phone number, address, payment information, and any other information you choose to provide.
              </p>

              <p>
                <strong>Information We Collect Automatically:</strong> When you use our Services, we automatically collect certain information, including:
              </p>
              <ul>
                <li>Log information (e.g., IP address, browser type, pages visited)</li>
                <li>Device information (e.g., hardware model, operating system)</li>
                <li>Location information</li>
                <li>Usage information</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize your experience</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>4. How We Share Your Information</h2>
              <p>
                We may share your personal information with:
              </p>
              <ul>
                <li>Service providers who perform services on our behalf</li>
                <li>Business partners with whom we jointly offer products or services</li>
                <li>Law enforcement or other third parties where we are legally required to do so</li>
                <li>In connection with a business transaction such as a merger, acquisition, or sale of assets</li>
              </ul>

              <h2>5. Your Choices</h2>
              <p>
                <strong>Account Information:</strong> You may update, correct, or delete your account information at any time by logging into your account or contacting us.
              </p>
              <p>
                <strong>Communications:</strong> You may opt out of receiving promotional communications from us by following the instructions in those communications.
              </p>
              <p>
                <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies.
              </p>

              <h2>6. Data Security</h2>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
              </p>

              <h2>7. Children's Privacy</h2>
              <p>
                Our Services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13.
              </p>

              <h2>8. International Data Transfers</h2>
              <p>
                Your personal information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country.
              </p>

              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through the Services prior to the change becoming effective.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@adpulse.ae.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-sm font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
            >
              Return to home page
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
