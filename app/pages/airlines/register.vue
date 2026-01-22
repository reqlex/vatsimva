<script setup lang="ts">
useSeoMeta({
  title: 'Register Your VA - VATSIM VA',
  description: 'Register your virtual airline on the VATSIM VA platform and connect with pilots worldwide.'
})

const currentStep = ref(1)
const totalSteps = 4

// Form State
const form = reactive({
  // Step 1: Basic Info
  name: '',
  code: '',
  icao: '',
  tagline: '',

  // Step 2: Details
  description: '',
  founded: '',
  website: '',
  discord: '',
  region: '',

  // Step 3: Operations
  hubs: [] as string[],
  fleet: [] as string[],
  routes: '',
  acarsSystem: '',

  // Step 4: Contact
  contactName: '',
  contactEmail: '',
  contactPosition: '',
  agreeTerms: false,
  agreeGuidelines: false
})

const newHub = ref('')
const newFleetType = ref('')

const regions = [
  { value: 'europe', label: 'Europe' },
  { value: 'north-america', label: 'North America' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'south-america', label: 'South America' },
  { value: 'africa', label: 'Africa' },
  { value: 'global', label: 'Global / Multi-Region' }
]

const acarsOptions = [
  { value: 'phpvms', label: 'phpVMS' },
  { value: 'vamsys', label: 'VAMSYS' },
  { value: 'smartcars', label: 'smartCARS' },
  { value: 'xacars', label: 'XACARS' },
  { value: 'fsacars', label: 'FSAcars' },
  { value: 'custom', label: 'Custom System' },
  { value: 'none', label: 'No ACARS System' }
]

const steps = [
  { number: 1, title: 'Basic Info', icon: 'i-lucide-building-2' },
  { number: 2, title: 'Details', icon: 'i-lucide-file-text' },
  { number: 3, title: 'Operations', icon: 'i-lucide-plane' },
  { number: 4, title: 'Contact', icon: 'i-lucide-user' }
]

function addHub() {
  if (newHub.value && newHub.value.length === 4 && !form.hubs.includes(newHub.value.toUpperCase())) {
    form.hubs.push(newHub.value.toUpperCase())
    newHub.value = ''
  }
}

function removeHub(hub: string) {
  form.hubs = form.hubs.filter(h => h !== hub)
}

function addFleetType() {
  if (newFleetType.value && !form.fleet.includes(newFleetType.value.toUpperCase())) {
    form.fleet.push(newFleetType.value.toUpperCase())
    newFleetType.value = ''
  }
}

function removeFleetType(type: string) {
  form.fleet = form.fleet.filter(t => t !== type)
}

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function canProceed(): boolean {
  switch (currentStep.value) {
    case 1:
      return !!form.name && !!form.code && form.code.length === 3
    case 2:
      return !!form.description && !!form.region
    case 3:
      return form.hubs.length > 0
    case 4:
      return !!form.contactName && !!form.contactEmail && form.agreeTerms && form.agreeGuidelines
    default:
      return false
  }
}

const isSubmitting = ref(false)
const isSubmitted = ref(false)

async function submitForm() {
  if (!canProceed()) return

  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))

  isSubmitting.value = false
  isSubmitted.value = true
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Header -->
    <section class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div class="absolute inset-0">
        <div class="absolute inset-0 aviation-grid" />
        <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-sky-500/5 dark:bg-sky-500/10 rounded-full -translate-y-1/2 -translate-x-1/3" />
      </div>

      <UContainer class="relative pt-12 pb-12">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm mb-6">
          <NuxtLink to="/airlines" class="text-gray-500 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Airlines
          </NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-gray-400 dark:text-slate-600" />
          <span class="text-gray-900 dark:text-white">Register</span>
        </nav>

        <div class="max-w-2xl">
          <span class="inline-block font-mono text-sm text-sky-600 dark:text-sky-400 mb-4 tracking-wider">// REGISTRATION</span>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Register Your VA
          </h1>
          <p class="text-lg text-gray-600 dark:text-slate-400">
            Join our platform and connect with pilots worldwide. Registration is free and only takes a few minutes.
          </p>
        </div>
      </UContainer>
    </section>

    <!-- Success State -->
    <section v-if="isSubmitted" class="py-20">
      <UContainer>
        <div class="max-w-lg mx-auto text-center">
          <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-lucide-check-circle" class="w-10 h-10 text-emerald-500" />
          </div>
          <h2 class="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Application Submitted!
          </h2>
          <p class="text-gray-600 dark:text-slate-400 mb-8">
            Thank you for registering {{ form.name }}. We'll review your application and get back to you within 48 hours.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/airlines">
              <UButton variant="outline" size="lg">
                Browse Airlines
              </UButton>
            </NuxtLink>
            <NuxtLink to="/">
              <UButton color="primary" size="lg">
                Back to Home
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Form -->
    <section v-else class="py-12">
      <UContainer>
        <div class="max-w-3xl mx-auto">
          <!-- Progress Steps -->
          <div class="mb-12">
            <div class="flex items-center justify-between">
              <template v-for="(step, index) in steps" :key="step.number">
                <!-- Step -->
                <div class="flex items-center">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300"
                    :class="[
                      currentStep >= step.number
                        ? 'bg-sky-500 border-sky-500 text-white'
                        : 'border-gray-300 dark:border-slate-700 text-gray-400 dark:text-slate-500'
                    ]"
                  >
                    <UIcon v-if="currentStep > step.number" name="i-lucide-check" class="w-5 h-5" />
                    <UIcon v-else :name="step.icon" class="w-5 h-5" />
                  </div>
                  <span
                    class="ml-3 text-sm font-medium hidden sm:block"
                    :class="[
                      currentStep >= step.number
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-slate-500'
                    ]"
                  >
                    {{ step.title }}
                  </span>
                </div>

                <!-- Connector -->
                <div
                  v-if="index < steps.length - 1"
                  class="flex-1 h-0.5 mx-4 transition-colors duration-300"
                  :class="[
                    currentStep > step.number
                      ? 'bg-sky-500'
                      : 'bg-gray-200 dark:bg-slate-800'
                  ]"
                />
              </template>
            </div>
          </div>

          <!-- Form Card -->
          <div class="p-8 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <!-- Step 1: Basic Info -->
            <div v-show="currentStep === 1">
              <h2 class="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic Information</h2>
              <p class="text-gray-500 dark:text-slate-500 mb-8">Tell us about your virtual airline.</p>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Airline Name <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="form.name"
                    placeholder="e.g. Lufthansa Virtual"
                    size="lg"
                  />
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      IATA Code <span class="text-red-500">*</span>
                    </label>
                    <UInput
                      v-model="form.code"
                      placeholder="e.g. LH"
                      maxlength="3"
                      size="lg"
                      class="uppercase"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-slate-500">3-letter airline code</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      ICAO Code
                    </label>
                    <UInput
                      v-model="form.icao"
                      placeholder="e.g. DLH"
                      maxlength="4"
                      size="lg"
                      class="uppercase"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-slate-500">4-letter ICAO code (optional)</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Tagline
                  </label>
                  <UInput
                    v-model="form.tagline"
                    placeholder="e.g. There's no better way to fly"
                    size="lg"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-slate-500">A short slogan for your airline</p>
                </div>
              </div>
            </div>

            <!-- Step 2: Details -->
            <div v-show="currentStep === 2">
              <h2 class="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Airline Details</h2>
              <p class="text-gray-500 dark:text-slate-500 mb-8">Provide more information about your VA.</p>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Description <span class="text-red-500">*</span>
                  </label>
                  <UTextarea
                    v-model="form.description"
                    placeholder="Tell pilots what makes your airline special..."
                    :rows="4"
                  />
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Region <span class="text-red-500">*</span>
                    </label>
                    <USelect
                      v-model="form.region"
                      :items="regions"
                      value-key="value"
                      label-key="label"
                      placeholder="Select region"
                      size="lg"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Year Founded
                    </label>
                    <UInput
                      v-model="form.founded"
                      type="number"
                      placeholder="e.g. 2020"
                      min="1990"
                      :max="new Date().getFullYear()"
                      size="lg"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Website URL
                  </label>
                  <UInput
                    v-model="form.website"
                    type="url"
                    placeholder="https://your-airline.com"
                    size="lg"
                    icon="i-lucide-globe"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Discord Server
                  </label>
                  <UInput
                    v-model="form.discord"
                    placeholder="https://discord.gg/..."
                    size="lg"
                    icon="i-simple-icons-discord"
                  />
                </div>
              </div>
            </div>

            <!-- Step 3: Operations -->
            <div v-show="currentStep === 3">
              <h2 class="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Operations</h2>
              <p class="text-gray-500 dark:text-slate-500 mb-8">Define your airline's operational details.</p>

              <div class="space-y-6">
                <!-- Hubs -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Hub Airports <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-2 mb-3">
                    <UInput
                      v-model="newHub"
                      placeholder="ICAO code (e.g. EDDF)"
                      maxlength="4"
                      class="uppercase flex-1"
                      @keyup.enter="addHub"
                    />
                    <UButton @click="addHub" :disabled="!newHub || newHub.length !== 4">
                      Add
                    </UButton>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="hub in form.hubs"
                      :key="hub"
                      class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-sm"
                    >
                      {{ hub }}
                      <button @click="removeHub(hub)" class="hover:text-red-500 transition-colors">
                        <UIcon name="i-lucide-x" class="w-4 h-4" />
                      </button>
                    </span>
                    <span v-if="form.hubs.length === 0" class="text-sm text-gray-400 dark:text-slate-500">
                      No hubs added yet
                    </span>
                  </div>
                </div>

                <!-- Fleet -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Fleet Types
                  </label>
                  <div class="flex gap-2 mb-3">
                    <UInput
                      v-model="newFleetType"
                      placeholder="Aircraft type (e.g. A320, B737)"
                      class="uppercase flex-1"
                      @keyup.enter="addFleetType"
                    />
                    <UButton @click="addFleetType" :disabled="!newFleetType">
                      Add
                    </UButton>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="type in form.fleet"
                      :key="type"
                      class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-slate-300 font-mono text-sm"
                    >
                      {{ type }}
                      <button @click="removeFleetType(type)" class="hover:text-red-500 transition-colors">
                        <UIcon name="i-lucide-x" class="w-4 h-4" />
                      </button>
                    </span>
                    <span v-if="form.fleet.length === 0" class="text-sm text-gray-400 dark:text-slate-500">
                      No fleet types added yet
                    </span>
                  </div>
                </div>

                <!-- Routes Info -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Route Network Description
                  </label>
                  <UTextarea
                    v-model="form.routes"
                    placeholder="Describe your route network (e.g. European focus with intercontinental long-haul)..."
                    :rows="3"
                  />
                </div>

                <!-- ACARS System -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    ACARS System
                  </label>
                  <USelect
                    v-model="form.acarsSystem"
                    :items="acarsOptions"
                    value-key="value"
                    label-key="label"
                    placeholder="Select your tracking system"
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <!-- Step 4: Contact -->
            <div v-show="currentStep === 4">
              <h2 class="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Information</h2>
              <p class="text-gray-500 dark:text-slate-500 mb-8">How can we reach you about your application?</p>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Contact Name <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="form.contactName"
                    placeholder="Your full name"
                    size="lg"
                    icon="i-lucide-user"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="form.contactEmail"
                    type="email"
                    placeholder="your@email.com"
                    size="lg"
                    icon="i-lucide-mail"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Position in VA
                  </label>
                  <UInput
                    v-model="form.contactPosition"
                    placeholder="e.g. CEO, Staff Manager"
                    size="lg"
                    icon="i-lucide-briefcase"
                  />
                </div>

                <!-- Agreements -->
                <div class="pt-6 border-t border-gray-200 dark:border-white/5 space-y-4">
                  <label class="flex items-start gap-3 cursor-pointer">
                    <UCheckbox v-model="form.agreeTerms" />
                    <span class="text-sm text-gray-600 dark:text-slate-400">
                      I agree to the <NuxtLink to="#" class="text-sky-600 dark:text-sky-400 hover:underline">Terms of Service</NuxtLink> and <NuxtLink to="#" class="text-sky-600 dark:text-sky-400 hover:underline">Privacy Policy</NuxtLink> <span class="text-red-500">*</span>
                    </span>
                  </label>

                  <label class="flex items-start gap-3 cursor-pointer">
                    <UCheckbox v-model="form.agreeGuidelines" />
                    <span class="text-sm text-gray-600 dark:text-slate-400">
                      I confirm that our VA follows the <NuxtLink to="#" class="text-sky-600 dark:text-sky-400 hover:underline">Community Guidelines</NuxtLink> and VATSIM Code of Conduct <span class="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between mt-10 pt-6 border-t border-gray-200 dark:border-white/5">
              <UButton
                v-if="currentStep > 1"
                variant="ghost"
                @click="prevStep"
              >
                <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
                Back
              </UButton>
              <div v-else />

              <UButton
                v-if="currentStep < totalSteps"
                color="primary"
                :disabled="!canProceed()"
                @click="nextStep"
              >
                Continue
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2" />
              </UButton>

              <UButton
                v-else
                color="primary"
                :loading="isSubmitting"
                :disabled="!canProceed()"
                @click="submitForm"
              >
                <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
                Submit Application
              </UButton>
            </div>
          </div>

          <!-- Help Text -->
          <div class="mt-8 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-lightbulb" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 class="font-display font-semibold text-gray-900 dark:text-white mb-1">Need Help?</h4>
                <p class="text-sm text-gray-600 dark:text-slate-400">
                  If you have questions about the registration process, join our
                  <NuxtLink to="#" class="text-sky-600 dark:text-sky-400 hover:underline">Discord server</NuxtLink>
                  or contact us at
                  <a href="mailto:support@vatsimva.com" class="text-sky-600 dark:text-sky-400 hover:underline">support@vatsimva.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
