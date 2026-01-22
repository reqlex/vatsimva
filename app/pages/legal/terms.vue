<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Service - VATSIM VA',
  description: 'Terms and conditions for using the VATSIM VA platform'
})
</script>

<template>
  <UContainer class="py-16">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400">
          Last updated: {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>

      <!-- Content -->
      <div class="prose prose-gray dark:prose-invert max-w-none">
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">1. Acceptance of Terms</h2>
          <p class="text-gray-600 dark:text-slate-400">
            By accessing and using VATSIM VA ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">2. Description of Service</h2>
          <p class="text-gray-600 dark:text-slate-400">
            VATSIM VA is a platform that enables virtual airline management and operations within the VATSIM network. The Service provides tools for:
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 mt-2 space-y-1">
            <li>Creating and managing virtual airlines</li>
            <li>Flight tracking and statistics</li>
            <li>Route planning and dispatch</li>
            <li>Pilot roster management</li>
            <li>Community features and events</li>
          </ul>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">3. User Accounts</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">3.1 Registration</h3>
              <p class="text-gray-600 dark:text-slate-400">
                To use certain features of the Service, you must authenticate using your VATSIM account. By registering, you agree to provide accurate and current information.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">3.2 Account Security</h3>
              <p class="text-gray-600 dark:text-slate-400">
                You are responsible for maintaining the security of your account. You must notify us immediately of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">3.3 VATSIM Membership</h3>
              <p class="text-gray-600 dark:text-slate-400">
                You must maintain an active VATSIM membership in good standing to use this Service. Any suspension or termination of your VATSIM membership may result in suspension of your access to the Service.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">4. User Conduct</h2>

          <p class="text-gray-600 dark:text-slate-400 mb-4">You agree not to:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload malicious code or viruses</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Impersonate any person or entity</li>
            <li>Manipulate or falsify flight data or statistics</li>
            <li>Use automated systems or bots without permission</li>
            <li>Interfere with the proper functioning of the Service</li>
            <li>Access other users' accounts without authorization</li>
            <li>Use the Service for any commercial purpose without permission</li>
          </ul>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">5. Virtual Airlines</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">5.1 Creation and Management</h3>
              <p class="text-gray-600 dark:text-slate-400">
                Users may create and manage virtual airlines subject to approval. Virtual airline operators are responsible for their airline's content, operations, and compliance with these terms.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">5.2 Naming and Branding</h3>
              <p class="text-gray-600 dark:text-slate-400">
                Virtual airlines must not use names, logos, or branding that infringes on real airlines' intellectual property or could cause confusion with real-world operations.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">5.3 Termination</h3>
              <p class="text-gray-600 dark:text-slate-400">
                We reserve the right to suspend or terminate any virtual airline that violates these terms or engages in inappropriate conduct.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">6. Content and Intellectual Property</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">6.1 User Content</h3>
              <p class="text-gray-600 dark:text-slate-400">
                You retain ownership of content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content in connection with operating the Service.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">6.2 Our Content</h3>
              <p class="text-gray-600 dark:text-slate-400">
                The Service and its original content, features, and functionality are owned by VATSIM VA and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">6.3 VATSIM Affiliation</h3>
              <p class="text-gray-600 dark:text-slate-400">
                This Service is not officially affiliated with or endorsed by VATSIM.net. VATSIM trademarks and content remain the property of VATSIM.net.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">7. Data and Privacy</h2>
          <p class="text-gray-600 dark:text-slate-400">
            Your use of the Service is also governed by our <NuxtLink to="/legal/privacy" class="text-sky-600 dark:text-sky-400 hover:underline">Privacy Policy</NuxtLink>. Please review our Privacy Policy to understand our practices regarding your personal data.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">8. Service Availability</h2>

          <p class="text-gray-600 dark:text-slate-400 mb-4">
            We strive to provide reliable service, but we do not guarantee that:
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-2">
            <li>The Service will be uninterrupted, timely, secure, or error-free</li>
            <li>The results obtained from using the Service will be accurate or reliable</li>
            <li>Any errors in the Service will be corrected</li>
          </ul>

          <p class="text-gray-600 dark:text-slate-400 mt-4">
            We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">9. Disclaimers and Limitation of Liability</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">9.1 Disclaimer of Warranties</h3>
              <p class="text-gray-600 dark:text-slate-400">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">9.2 Limitation of Liability</h3>
              <p class="text-gray-600 dark:text-slate-400">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VATSIM VA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">10. Indemnification</h2>
          <p class="text-gray-600 dark:text-slate-400">
            You agree to indemnify, defend, and hold harmless VATSIM VA and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Service or your violation of these Terms.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">11. Termination</h2>
          <p class="text-gray-600 dark:text-slate-400">
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease. You may also terminate your account at any time by contacting us.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">12. Dispute Resolution</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">12.1 Governing Law</h3>
              <p class="text-gray-600 dark:text-slate-400">
                These Terms shall be governed by and construed in accordance with the laws of Germany, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">12.2 Dispute Resolution</h3>
              <p class="text-gray-600 dark:text-slate-400">
                Any disputes arising out of or relating to these Terms or the Service shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved in the courts of Germany.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">13. Changes to Terms</h2>
          <p class="text-gray-600 dark:text-slate-400">
            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes indicates your acceptance of the new Terms.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">14. Severability</h2>
          <p class="text-gray-600 dark:text-slate-400">
            If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8">
          <h2 class="text-2xl font-display font-semibold mb-6">15. Entire Agreement</h2>
          <p class="text-gray-600 dark:text-slate-400">
            These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and VATSIM VA regarding the Service and supersede any prior agreements.
          </p>
        </div>

        <div class="mt-8 p-6 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-800">
          <h3 class="text-lg font-semibold mb-2 text-sky-900 dark:text-sky-100">Contact Us</h3>
          <p class="text-gray-600 dark:text-slate-400">
            If you have any questions about these Terms of Service, please contact us at:<br>
            <a href="mailto:linus@clovo.cloud" class="text-sky-600 dark:text-sky-400 hover:underline">linus@clovo.cloud</a>
          </p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
