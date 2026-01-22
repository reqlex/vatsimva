<script setup lang="ts">
const features = [
  {
    icon: 'i-lucide-plane',
    title: 'Realistic Operations',
    description: 'Real routes, professional dispatch systems and authentic flight procedures.',
    accent: 'sky'
  },
  {
    icon: 'i-lucide-bar-chart-3',
    title: 'Live Statistics',
    description: 'Track your flights and analyze your performance in real-time.',
    accent: 'emerald'
  },
  {
    icon: 'i-lucide-calendar',
    title: 'Events & Group Flights',
    description: 'Organized events and shared flights with your airline.',
    accent: 'amber'
  },
]

// Fetch top airlines from API (show 8 on desktop, 4 on mobile)
const { data: airlinesData, pending: airlinesPending } = await useFetch('/api/airlines?sortBy=members')
const airlines = computed(() => (airlinesData.value?.data || []).slice(0, 8))

// Fetch platform statistics
const { data: platformData } = await useFetch('/api/statistics/platform')
const platformStats = computed(() => platformData.value?.data || {
  totalPilots: 0,
  totalFlights: 0,
  totalAirlines: 0
})

const stats = computed(() => [
  {
    value: platformStats.value.totalAirlines > 0 ? `${platformStats.value.totalAirlines}` : '50+',
    label: 'Virtual Airlines',
    icon: 'i-lucide-building-2'
  },
  {
    value: platformStats.value.totalPilots > 0 ? formatStatNumber(platformStats.value.totalPilots) : '15K+',
    label: 'Active Pilots',
    icon: 'i-lucide-users'
  },
  {
    value: platformStats.value.totalFlights > 0 ? formatStatNumber(platformStats.value.totalFlights) : '500K+',
    label: 'Flights Completed',
    icon: 'i-lucide-plane-takeoff'
  }
])

function formatStatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0">
        <!-- Grid pattern -->
        <div class="absolute inset-0 aviation-grid" />

        <!-- Gradient orbs -->
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-500/5 dark:bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/3 dark:bg-sky-500/5 rounded-full translate-y-1/2 -translate-x-1/3" />

        <!-- Decorative flight path -->
        <svg class="absolute top-1/4 right-0 w-full h-64 opacity-10 dark:opacity-20" viewBox="0 0 1200 200" fill="none">
          <path
            d="M0 100 Q300 50 600 100 T1200 100"
            stroke="url(#flightPath)"
            stroke-width="2"
            stroke-dasharray="8 8"
            fill="none"
          />
          <defs>
            <linearGradient id="flightPath" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="transparent" />
              <stop offset="50%" stop-color="#0ea5e9" />
              <stop offset="100%" stop-color="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <UContainer class="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Left Content -->
          <div class="max-w-2xl">
            <!-- Badge -->
            <div class="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 mb-8">
              <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span class="text-sm font-medium text-sky-600 dark:text-sky-400">VATSIM Virtual Airlines Platform</span>
            </div>

            <!-- Headline -->
            <h1 class="animate-fade-up animation-delay-100 font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
              Find your
              <span class="block text-gradient">Virtual Airline</span>
            </h1>

            <!-- Subheadline -->
            <p class="animate-fade-up animation-delay-200 text-lg sm:text-xl text-gray-600 dark:text-slate-400 leading-relaxed mb-10 max-w-lg">
              Discover virtual airlines on VATSIM. Fly realistic routes and become part of an active pilot community.
            </p>

            <!-- CTAs -->
            <div class="animate-fade-up animation-delay-300 flex flex-wrap gap-4">
              <NuxtLink to="/airlines">
                <UButton
                  size="xl"
                  color="primary"
                  class="font-display font-semibold px-8"
                >
                  <UIcon name="i-lucide-search" class="w-5 h-5 mr-2" />
                  Discover Airlines
                </UButton>
              </NuxtLink>
              <NuxtLink to="/airlines/register">
                <UButton
                  size="xl"
                  variant="outline"
                  color="neutral"
                  class="font-display font-semibold px-8"
                >
                  <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
                  Register VA
                </UButton>
              </NuxtLink>
            </div>
          </div>

          <!-- Right Visual - Radar Display -->
          <div class="hidden lg:block relative">
            <div class="relative w-full aspect-square max-w-md mx-auto">
              <!-- Radar circles -->
              <div class="absolute inset-0 rounded-full border border-sky-500/20" />
              <div class="absolute inset-[15%] rounded-full border border-sky-500/15" />
              <div class="absolute inset-[30%] rounded-full border border-sky-500/10" />
              <div class="absolute inset-[45%] rounded-full border border-sky-500/5" />

              <!-- Radar sweep -->
              <div class="absolute inset-0 animate-radar origin-center">
                <div class="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-sky-500/60 to-transparent origin-left" />
              </div>

              <!-- Center dot -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]" />

              <!-- Aircraft blips -->
              <div class="absolute top-[25%] left-[60%] w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <div class="absolute top-[45%] left-[75%] w-2 h-2 rounded-full bg-sky-500 animate-pulse animation-delay-200" />
              <div class="absolute top-[70%] left-[35%] w-2 h-2 rounded-full bg-amber-500 animate-pulse animation-delay-400" />
              <div class="absolute top-[30%] left-[25%] w-2 h-2 rounded-full bg-sky-500 animate-pulse animation-delay-300" />

              <!-- Cardinal labels -->
              <span class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-xs font-mono text-sky-600/60 dark:text-sky-400/60">N</span>
              <span class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs font-mono text-sky-600/40 dark:text-sky-400/40">S</span>
              <span class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 text-xs font-mono text-sky-600/40 dark:text-sky-400/40">W</span>
              <span class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 text-xs font-mono text-sky-600/40 dark:text-sky-400/40">E</span>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="mt-20 lg:mt-32">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(stat, index) in stats"
              :key="stat.label"
              class="animate-fade-up group relative p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-all duration-300"
              :class="`animation-delay-${(index + 1) * 100}`"
            >
              <!-- Glow effect on hover -->
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div class="relative flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <UIcon :name="stat.icon" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <div class="font-display text-3xl font-bold text-gray-900 dark:text-white stat-number">
                    {{ stat.value }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-slate-500 mt-1">
                    {{ stat.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Features Section -->
    <section id="features" class="relative py-32 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gray-50 dark:bg-slate-900/50" />

      <UContainer class="relative">
        <!-- Section Header -->
        <div class="max-w-2xl mb-16">
          <span class="inline-block font-mono text-sm text-sky-600 dark:text-sky-400 mb-4 tracking-wider">// FEATURES</span>
          <h2 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything you need
          </h2>
          <p class="text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
            Modern tools and features for an authentic airline experience on the VATSIM network.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="group relative p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-all duration-500 card-lift"
          >
            <!-- Accent line -->
            <div
              class="absolute top-0 left-8 right-8 h-px"
              :class="{
                'bg-gradient-to-r from-transparent via-sky-500/50 to-transparent': feature.accent === 'sky',
                'bg-gradient-to-r from-transparent via-amber-500/50 to-transparent': feature.accent === 'amber',
                'bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent': feature.accent === 'emerald'
              }"
            />

            <!-- Icon -->
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
              :class="{
                'bg-sky-500/10': feature.accent === 'sky',
                'bg-amber-500/10': feature.accent === 'amber',
                'bg-emerald-500/10': feature.accent === 'emerald'
              }"
            >
              <UIcon
                :name="feature.icon"
                class="w-7 h-7"
                :class="{
                  'text-sky-600 dark:text-sky-400': feature.accent === 'sky',
                  'text-amber-600 dark:text-amber-400': feature.accent === 'amber',
                  'text-emerald-600 dark:text-emerald-400': feature.accent === 'emerald'
                }"
              />
            </div>

            <!-- Content -->
            <h3 class="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
              {{ feature.description }}
            </p>

            <!-- Number -->
            <span class="absolute bottom-6 right-8 font-mono text-6xl font-bold text-gray-100 dark:text-white/[0.02] group-hover:text-sky-500/10 transition-colors">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Airlines Section -->
    <section id="airlines" class="relative py-32 bg-white dark:bg-slate-950">
      <UContainer>
        <!-- Section Header -->
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div class="max-w-xl">
            <span class="inline-block font-mono text-sm text-sky-600 dark:text-sky-400 mb-4 tracking-wider">// AIRLINES</span>
            <h2 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Airlines
            </h2>
            <p class="text-lg text-gray-600 dark:text-slate-400">
              Discover some of the most active virtual airlines worldwide.
            </p>
          </div>

          <NuxtLink to="/airlines">
            <UButton
              variant="ghost"
              color="primary"
              class="self-start lg:self-auto font-medium"
            >
              All Airlines
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2" />
            </UButton>
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="airlinesPending" class="py-16 text-center">
          <div class="inline-block w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p class="mt-4 text-gray-500 dark:text-slate-500">Loading airlines...</p>
        </div>

        <!-- No Airlines -->
        <div v-else-if="airlines.length === 0" class="py-16 text-center text-gray-500 dark:text-slate-500">
          <UIcon name="i-lucide-building-2" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No airlines available yet</p>
        </div>

        <!-- Airlines Grid -->
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="airline in airlines"
            :key="airline.code"
            :to="`/airlines/${airline.code.toLowerCase()}`"
            class="group relative p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-all duration-300 cursor-pointer card-lift"
          >
            <!-- Airline Code Badge -->
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 border border-sky-500/20 flex items-center justify-center">
                <span class="font-display font-bold text-xl text-sky-600 dark:text-sky-400">{{ airline.code }}</span>
              </div>
              <div class="flex items-center gap-1 text-amber-500">
                <UIcon name="i-lucide-star" class="w-4 h-4 fill-current" />
                <span class="text-sm font-medium">{{ Number(airline.rating).toFixed(1) }}</span>
              </div>
            </div>

            <!-- Airline Name -->
            <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {{ airline.name }}
            </h3>

            <!-- Stats -->
            <div class="flex items-center gap-6 text-sm">
              <div>
                <span class="text-gray-900 dark:text-white font-semibold">{{ airline.members.toLocaleString() }}</span>
                <span class="text-gray-500 dark:text-slate-500 ml-1">Pilots</span>
              </div>
              <div>
                <span class="text-gray-900 dark:text-white font-semibold">{{ formatNumber(airline.flights) }}</span>
                <span class="text-gray-500 dark:text-slate-500 ml-1">Flights</span>
              </div>
            </div>

            <!-- Hover Arrow -->
            <div class="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-sky-500/0 group-hover:bg-sky-500/10 flex items-center justify-center transition-all">
              <UIcon name="i-lucide-arrow-up-right" class="w-4 h-4 text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- Community Section -->
    <section id="community" class="relative py-32 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gray-50 dark:bg-slate-900/50" />

      <UContainer class="relative">
        <div class="max-w-4xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <span class="inline-block font-mono text-sm text-sky-600 dark:text-sky-400 mb-4 tracking-wider">// COMMUNITY</span>
            <h2 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join the Community
            </h2>
            <p class="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Connect with other pilots, find flight partners and stay up to date.
            </p>
          </div>

          <!-- Community Cards -->
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Discord -->
            <div class="group relative p-8 rounded-2xl bg-[#5865F2]/5 dark:bg-[#5865F2]/10 border border-[#5865F2]/20 hover:border-[#5865F2]/40 transition-all text-center card-lift">
              <div class="w-16 h-16 rounded-2xl bg-[#5865F2]/10 dark:bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-simple-icons-discord" class="w-8 h-8 text-[#5865F2]" />
              </div>
              <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-2">Discord Server</h3>
              <p class="text-gray-600 dark:text-slate-400 text-sm mb-6">
                Chat live with the community and find flight partners.
              </p>
              <UButton
                variant="outline"
                class="w-full border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/10"
              >
                Join Now
              </UButton>
            </div>

            <!-- News -->
            <div class="group relative p-8 rounded-2xl bg-sky-500/5 border border-sky-500/20 hover:border-sky-500/40 transition-all text-center card-lift">
              <div class="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-lucide-newspaper" class="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-2">News & Updates</h3>
              <p class="text-gray-600 dark:text-slate-400 text-sm mb-6">
                Get the latest news from the VA world delivered to you.
              </p>
              <UButton
                variant="outline"
                class="w-full border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10"
              >
                Subscribe
              </UButton>
            </div>

            <!-- Events -->
            <div class="group relative p-8 rounded-2xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all text-center card-lift">
              <div class="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-lucide-calendar-days" class="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-2">Events</h3>
              <p class="text-gray-600 dark:text-slate-400 text-sm mb-6">
                Don't miss any group flights and community events.
              </p>
              <UButton
                variant="outline"
                class="w-full border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              >
                Calendar
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="relative py-32 bg-white dark:bg-slate-950">
      <UContainer>
        <div class="relative rounded-3xl overflow-hidden">
          <!-- Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700" />

          <!-- Pattern overlay -->
          <div class="absolute inset-0 aviation-grid opacity-100" />

          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <!-- Content -->
          <div class="relative px-8 py-20 lg:px-16 lg:py-24 text-center">
            <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready for Takeoff?
            </h2>
            <p class="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Sign up now and discover the world of virtual airlines on VATSIM.
              Free and no commitment.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NuxtLink to="/api/auth/login">
                <UButton
                  size="xl"
                  color="white"
                  class="font-display font-semibold px-10 text-sky-600"
                >
                  <UIcon name="i-lucide-log-in" class="w-5 h-5 mr-2" />
                  Login with VATSIM
                </UButton>
              </NuxtLink>
              <NuxtLink to="/airlines">
                <UButton
                  size="xl"
                  variant="outline"
                  class="font-display font-semibold px-10 border-white/30 text-white hover:bg-white/10"
                >
                  Browse Airlines
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
