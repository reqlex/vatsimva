<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy - VATSIM VA',
  description: 'Privacy policy explaining how we collect, use, and protect your personal data'
})
</script>

<template>
  <UContainer class="py-16">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400">
          Last updated: {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>

      <!-- Content -->
      <div class="prose prose-gray dark:prose-invert max-w-none">
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">1. Introduction</h2>
          <p class="text-gray-600 dark:text-slate-400">
            Welcome to VATSIM VA. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">2. Data Controller</h2>
          <p class="text-gray-600 dark:text-slate-400 mb-4">
            The data controller responsible for your personal data is:
          </p>
          <p class="text-gray-600 dark:text-slate-400">
            Linus Odia<br>
            linus@clovo.cloud<br>
            Blumenweg 15, 27711 Osterholz-Scharmbeck, Germany
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">3. Data We Collect</h2>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold mb-2">3.1 VATSIM Authentication Data</h3>
              <p class="text-gray-600 dark:text-slate-400">
                When you log in using VATSIM OAuth, we collect:
              </p>
              <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 mt-2 space-y-1">
                <li>Your VATSIM CID (Controller ID)</li>
                <li>Your full name</li>
                <li>Your email address</li>
                <li>Your VATSIM rating and division</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">3.2 Profile Information</h3>
              <p class="text-gray-600 dark:text-slate-400">
                You may optionally provide:
              </p>
              <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 mt-2 space-y-1">
                <li>Profile picture</li>
                <li>Biography</li>
                <li>Virtual airline memberships</li>
                <li>Flight hours and statistics</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">3.3 Usage Data</h3>
              <p class="text-gray-600 dark:text-slate-400">
                We automatically collect:
              </p>
              <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 mt-2 space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">4. How We Use Your Data</h2>

          <p class="text-gray-600 dark:text-slate-400 mb-4">We use your personal data to:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-2">
            <li>Provide and maintain our service</li>
            <li>Authenticate your identity via VATSIM OAuth</li>
            <li>Manage your virtual airline memberships</li>
            <li>Display flight statistics and achievements</li>
            <li>Send important service updates</li>
            <li>Improve our platform and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">5. Legal Basis for Processing</h2>

          <p class="text-gray-600 dark:text-slate-400 mb-4">We process your personal data based on:</p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-2">
            <li><strong>Consent:</strong> You have given explicit consent for authentication via VATSIM OAuth</li>
            <li><strong>Contract:</strong> Processing is necessary for the performance of our service</li>
            <li><strong>Legitimate Interests:</strong> To improve our services and ensure security</li>
            <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">6. Data Sharing and Disclosure</h2>

          <p class="text-gray-600 dark:text-slate-400 mb-4">
            We do not sell your personal data. We may share your data with:
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-2">
            <li><strong>VATSIM.net:</strong> For authentication purposes via OAuth</li>
            <li><strong>Service Providers:</strong> Hosting services, analytics providers (if applicable)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Virtual Airlines:</strong> Your flight data may be visible to airlines you join</li>
          </ul>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">7. Data Retention</h2>

          <p class="text-gray-600 dark:text-slate-400">
            We retain your personal data only as long as necessary for the purposes outlined in this privacy policy. Account data is kept while your account is active and may be retained for a reasonable period after deletion to comply with legal obligations or resolve disputes.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">8. Your Rights</h2>

          <p class="text-gray-600 dark:text-slate-400 mb-4">
            Under GDPR and other data protection laws, you have the right to:
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-2">
            <li><strong>Access:</strong> Request copies of your personal data</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> Request deletion of your data</li>
            <li><strong>Restriction:</strong> Request restriction of processing</li>
            <li><strong>Data Portability:</strong> Request transfer of your data</li>
            <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>

          <p class="text-gray-600 dark:text-slate-400 mt-4">
            To exercise these rights, please contact us at linus@clovo.cloud.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">9. Cookies and Tracking</h2>

          <p class="text-gray-600 dark:text-slate-400">
            We use cookies and similar tracking technologies to track activity on our service. For detailed information about the cookies we use, please see our <NuxtLink to="/legal/cookies" class="text-sky-600 dark:text-sky-400 hover:underline">Cookie Policy</NuxtLink>.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">10. Data Security</h2>

          <p class="text-gray-600 dark:text-slate-400">
            We implement appropriate technical and organizational security measures to protect your personal data. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">11. International Data Transfers</h2>

          <p class="text-gray-600 dark:text-slate-400">
            Your data may be transferred to and processed in countries outside your country of residence. We ensure that appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable laws.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">12. Children's Privacy</h2>

          <p class="text-gray-600 dark:text-slate-400">
            Our service is intended for users who are at least 13 years old. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8">
          <h2 class="text-2xl font-display font-semibold mb-6">13. Changes to This Policy</h2>

          <p class="text-gray-600 dark:text-slate-400">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this privacy policy periodically for any changes.
          </p>
        </div>

        <div class="mt-8 p-6 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-800">
          <h3 class="text-lg font-semibold mb-2 text-sky-900 dark:text-sky-100">Contact Us</h3>
          <p class="text-gray-600 dark:text-slate-400">
            If you have any questions about this Privacy Policy, please contact us at:<br>
            <a href="mailto:linus@clovo.cloud" class="text-sky-600 dark:text-sky-400 hover:underline">linus@clovo.cloud</a>
          </p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
