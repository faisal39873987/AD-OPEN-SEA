'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Last updated: June 1, 2023
            </p>
          </div>

          <div className="mt-10 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border dark:border-gray-700">
            <div className="px-4 py-5 sm:p-6 prose dark:prose-invert max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to AD Pulse ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our website, products, and services (collectively, the "Services").
              </p>
              <p>
                By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Services.
              </p>

              <h2>2. Use of Services</h2>
              <p>
                <strong>Account Registration:</strong> Some features of our Services require you to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h2>3. User Content</h2>
              <p>
                <strong>Content Responsibility:</strong> You are solely responsible for any content you post, upload, or otherwise make available through our Services ("User Content"). You represent and warrant that you have all necessary rights to your User Content and that it does not violate any law or these Terms.
              </p>
              <p>
                <strong>Content License:</strong> By posting User Content, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, copy, modify, create derivative works based on, distribute, publicly display, publicly perform, and otherwise exploit your User Content in connection with operating and providing the Services.
              </p>

              <h2>4. Prohibited Conduct</h2>
              <p>
                You agree not to:
              </p>
              <ul>
                <li>Violate any applicable law, contract, intellectual property right, or other third-party right</li>
                <li>Use our Services in any manner that could interfere with, disrupt, negatively affect, or inhibit other users from fully enjoying our Services</li>
                <li>Attempt to circumvent any content-filtering techniques we employ</li>
                <li>Use our Services for any illegal or unauthorized purpose</li>
                <li>Use automated means or interfaces not provided by us to access the Services</li>
              </ul>

              <h2>5. Intellectual Property Rights</h2>
              <p>
                <strong>Our Content:</strong> All content included on the Services, such as text, graphics, logos, images, and software, is the property of AD Pulse or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong>Feedback:</strong> If you provide us with any feedback or suggestions regarding the Services, you hereby assign to us all rights in such feedback and agree that we have the right to use and fully exploit such feedback in any manner we deem appropriate.
              </p>

              <h2>6. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to our Services at any time and for any reason, including for violations of these Terms. Upon termination, your right to use the Services will immediately cease.
              </p>

              <h2>7. Disclaimer of Warranties</h2>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL AD PULSE BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, SPECIAL, PUNITIVE, OR INDIRECT DAMAGES.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. If we make material changes, we will provide notice as appropriate under the circumstances, such as by displaying a prominent notice within the Services or by sending you an email.
              </p>

              <h2>10. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the United Arab Emirates, without giving effect to any principles of conflicts of law.
              </p>

              <h2>11. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@adpulse.ae.
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
