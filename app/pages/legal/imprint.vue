<script setup lang="ts">
useSeoMeta({
  title: 'Imprint - VATSIM VA',
  description: 'Legal notice and contact information for VATSIM VA platform'
})
</script>

<template>
  <UContainer class="py-16">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Imprint
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400">
          Legal Notice and Contact Information
        </p>
      </div>

      <!-- Content -->
      <div class="prose prose-gray dark:prose-invert max-w-none">
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">Information according to § 5 TMG</h2>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold mb-2">Responsible for content</h3>
              <p class="text-gray-600 dark:text-slate-400">
                Linus Odia<br>
                Blumenweg 15<br>
                27711 Osterholz-Scharmbeck<br>
                Germany
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">Contact</h3>
              <p class="text-gray-600 dark:text-slate-400">
                Email: linus@clovo.cloud
              </p>
            </div>

            <div v-if="false">
              <h3 class="text-lg font-semibold mb-2">VAT ID</h3>
              <p class="text-gray-600 dark:text-slate-400">
                VAT identification number according to §27a VAT Tax Act:<br>
                [Your VAT ID]
              </p>
            </div>

            <div v-if="false">
              <h3 class="text-lg font-semibold mb-2">Register Entry</h3>
              <p class="text-gray-600 dark:text-slate-400">
                Entry in the commercial register<br>
                Registration court: [Court Name]<br>
                Registration number: [Number]
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8 mb-8">
          <h2 class="text-2xl font-display font-semibold mb-6">Disclaimer</h2>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold mb-2">Liability for Content</h3>
              <p class="text-gray-600 dark:text-slate-400">
                As a service provider, we are responsible for our own content on these pages in accordance with § 7 Para. 1 TMG (German Telemedia Act). However, according to §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">Liability for Links</h3>
              <p class="text-gray-600 dark:text-slate-400">
                Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-2">Copyright</h3>
              <p class="text-gray-600 dark:text-slate-400">
                The content and works on these pages created by the site operators are subject to copyright law. The reproduction, editing, distribution, and any kind of use outside the limits of copyright require the written consent of the respective author or creator.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-white/10 p-8">
          <h2 class="text-2xl font-display font-semibold mb-6">VATSIM Disclaimer</h2>
          <p class="text-gray-600 dark:text-slate-400">
            This platform is not officially affiliated with or endorsed by VATSIM.net. VATSIM is an independent organization. This platform serves as an independent community service for virtual airline management within the VATSIM network.
          </p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
