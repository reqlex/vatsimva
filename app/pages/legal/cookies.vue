<script setup lang="ts">
useSeoMeta({
  title: 'Cookie Policy - VATSIM VA',
  description: 'Information about how we use cookies and similar tracking technologies'
})
</script>

<template>
  <UContainer class="py-16">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Cookie Policy
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400">
          Last updated: {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>

      <!-- Content -->
      <div class="prose prose-gray dark:prose-invert max-w-none">
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">1. What Are Cookies</h2>
          <p class="text-gray-600 dark:text-slate-400">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies help us improve your experience by remembering your preferences and understanding how you use our service.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">2. How We Use Cookies</h2>
          <p class="text-gray-600 dark:text-slate-400 mb-4">
            VATSIM VA uses cookies for various purposes:
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-2">
            <li>To enable certain functions of the Service</li>
            <li>To provide analytics and understand how you use our platform</li>
            <li>To store your preferences (theme, language, etc.)</li>
            <li>To maintain your authentication session</li>
            <li>To improve and optimize the Service</li>
            <li>To remember your consent choices</li>
          </ul>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">3. Types of Cookies We Use</h2>

          <div class="space-y-6">
            <div class="p-6 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Essential Cookies
              </h3>
              <p class="text-gray-600 dark:text-slate-400 mb-3">
                These cookies are necessary for the website to function and cannot be disabled. They are usually set in response to actions you take, such as logging in or filling in forms.
              </p>
              <div class="bg-white dark:bg-slate-900 rounded p-4 mt-3">
                <p class="font-mono text-sm text-gray-700 dark:text-slate-300 mb-2"><strong>Examples:</strong></p>
                <ul class="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 space-y-1">
                  <li><code>auth_token</code> - Maintains your login session</li>
                  <li><code>session_id</code> - Identifies your session</li>
                  <li><code>csrf_token</code> - Security token to prevent attacks</li>
                </ul>
                <p class="text-sm text-gray-500 dark:text-slate-500 mt-2">
                  <strong>Duration:</strong> Session or up to 30 days
                </p>
              </div>
            </div>

            <div class="p-6 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <UIcon name="i-lucide-settings" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Functional Cookies
              </h3>
              <p class="text-gray-600 dark:text-slate-400 mb-3">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
              </p>
              <div class="bg-white dark:bg-slate-900 rounded p-4 mt-3">
                <p class="font-mono text-sm text-gray-700 dark:text-slate-300 mb-2"><strong>Examples:</strong></p>
                <ul class="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 space-y-1">
                  <li><code>theme_preference</code> - Stores your light/dark mode choice</li>
                  <li><code>language</code> - Remembers your language preference</li>
                  <li><code>sidebar_collapsed</code> - Remembers UI preferences</li>
                </ul>
                <p class="text-sm text-gray-500 dark:text-slate-500 mt-2">
                  <strong>Duration:</strong> Up to 1 year
                </p>
              </div>
            </div>

            <div class="p-6 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Analytics Cookies
              </h3>
              <p class="text-gray-600 dark:text-slate-400 mb-3">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <div class="bg-white dark:bg-slate-900 rounded p-4 mt-3">
                <p class="font-mono text-sm text-gray-700 dark:text-slate-300 mb-2"><strong>Examples:</strong></p>
                <ul class="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 space-y-1">
                  <li><code>_ga</code> - Google Analytics identifier (if applicable)</li>
                  <li><code>analytics_session</code> - Anonymous session tracking</li>
                  <li><code>page_views</code> - Tracks page view statistics</li>
                </ul>
                <p class="text-sm text-gray-500 dark:text-slate-500 mt-2">
                  <strong>Duration:</strong> Up to 2 years
                </p>
              </div>
            </div>

            <div class="p-6 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <UIcon name="i-lucide-zap" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Performance Cookies
              </h3>
              <p class="text-gray-600 dark:text-slate-400 mb-3">
                These cookies allow us to count visits and traffic sources to measure and improve the performance of our site.
              </p>
              <div class="bg-white dark:bg-slate-900 rounded p-4 mt-3">
                <p class="font-mono text-sm text-gray-700 dark:text-slate-300 mb-2"><strong>Examples:</strong></p>
                <ul class="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 space-y-1">
                  <li><code>performance_monitoring</code> - Tracks page load times</li>
                  <li><code>error_tracking</code> - Captures error information</li>
                </ul>
                <p class="text-sm text-gray-500 dark:text-slate-500 mt-2">
                  <strong>Duration:</strong> Session or up to 1 year
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">4. Third-Party Cookies</h2>
          <p class="text-gray-600 dark:text-slate-400 mb-4">
            In addition to our own cookies, we may use third-party services that set cookies on your device:
          </p>

          <div class="space-y-4">
            <div class="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <h3 class="text-base font-semibold mb-2">VATSIM OAuth</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">
                When you log in using VATSIM authentication, VATSIM.net may set cookies for authentication purposes. Please refer to VATSIM's privacy policy for more information.
              </p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg" v-if="false">
              <h3 class="text-base font-semibold mb-2">Analytics Services</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">
                We may use analytics services like Google Analytics to understand how users interact with our platform. These services may set their own cookies.
              </p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg" v-if="false">
              <h3 class="text-base font-semibold mb-2">Content Delivery Networks</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">
                We use CDNs to serve static content efficiently. These services may set cookies for performance optimization.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">5. Managing Your Cookie Preferences</h2>

          <p class="text-gray-600 dark:text-slate-400 mb-4">
            You have several options to manage cookies:
          </p>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Browser Settings</h3>
              <p class="text-gray-600 dark:text-slate-400 mb-2">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 space-y-1">
                <li>Delete all cookies</li>
                <li>Block all cookies</li>
                <li>Allow only cookies from specific websites</li>
                <li>Block third-party cookies</li>
                <li>Clear cookies when you close your browser</li>
              </ul>
              <p class="text-sm text-gray-500 dark:text-slate-500 mt-3">
                Note: Blocking or deleting essential cookies may affect the functionality of our Service.
              </p>
            </div>

            <div class="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-lg border border-sky-200 dark:border-sky-800">
              <h3 class="text-base font-semibold mb-2 text-sky-900 dark:text-sky-100">Browser-Specific Instructions</h3>
              <div class="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
                <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
                <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
                <p><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">6. Local Storage and Similar Technologies</h2>
          <p class="text-gray-600 dark:text-slate-400">
            In addition to cookies, we may use similar technologies such as:
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-slate-400 mt-2 space-y-2">
            <li><strong>Local Storage:</strong> For storing user preferences and application state</li>
            <li><strong>Session Storage:</strong> For temporary data that persists only for the current session</li>
            <li><strong>IndexedDB:</strong> For storing larger amounts of structured data locally</li>
          </ul>
          <p class="text-gray-600 dark:text-slate-400 mt-4">
            These technologies serve similar purposes to cookies and are subject to the same management options in your browser settings.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">7. Do Not Track Signals</h2>
          <p class="text-gray-600 dark:text-slate-400">
            Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no uniform standard for how DNT signals should be interpreted. We currently do not respond to DNT signals, but we are committed to respecting your privacy choices.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">8. Updates to This Cookie Policy</h2>
          <p class="text-gray-600 dark:text-slate-400">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies and related technologies.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8">
          <h2 class="text-2xl font-display font-semibold mb-6">9. More Information</h2>
          <p class="text-gray-600 dark:text-slate-400 mb-4">
            For more information about how we protect your privacy, please see our <NuxtLink to="/legal/privacy" class="text-sky-600 dark:text-sky-400 hover:underline">Privacy Policy</NuxtLink>.
          </p>
          <p class="text-gray-600 dark:text-slate-400">
            For general information about cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 hover:underline">www.allaboutcookies.org</a>.
          </p>
        </div>

        <div class="mt-8 p-6 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-800">
          <h3 class="text-lg font-semibold mb-2 text-sky-900 dark:text-sky-100">Contact Us</h3>
          <p class="text-gray-600 dark:text-slate-400">
            If you have questions about our use of cookies, please contact us at:<br>
            <a href="mailto:linus@clovo.cloud" class="text-sky-600 dark:text-sky-400 hover:underline">linus@clovo.cloud</a>
          </p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
