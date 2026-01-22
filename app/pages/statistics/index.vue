<script setup lang="ts">
useSeoMeta({
  title: 'Live Statistics - VATSIM VA',
  description: 'Real-time statistics, leaderboards and activity tracking for virtual airlines on VATSIM.'
})

// Fetch platform statistics
const { data: platformData, pending: platformPending } = await useFetch('/api/statistics/platform')
const platformStats = computed(() => platformData.value?.data || {
  totalPilots: 0,
  totalFlights: 0,
  totalHours: 0,
  totalAirlines: 0,
  totalRoutes: 0,
  avgFlightsPerDay: 0,
  vatsimStats: {
    totalPilotHours: 0,
    totalAtcHours: 0
  }
})

// Fetch top pilots
const { data: pilotsData, pending: pilotsPending } = await useFetch('/api/statistics/leaderboard/pilots?limit=10')
const topPilots = computed(() => pilotsData.value?.data || [])

// Fetch top airlines
const { data: airlinesData, pending: airlinesPending } = await useFetch('/api/statistics/leaderboard/airlines?limit=8')
const topAirlines = computed(() => airlinesData.value?.data || [])

// Fetch recent activity
const { data: activityData, pending: activityPending } = await useFetch('/api/statistics/activity?limit=10')
const recentActivity = computed(() => activityData.value?.data || [])

// Live Stats (TODO: Implement real-time data from VATSIM API)
const liveStats = ref({
  activeFlights: 0,
  pilotsOnline: 0,
  flightsToday: 0,
  hoursToday: 0
})

// Activity by Hour (Chart data)
const hourlyActivity = ref([
  { hour: '00:00', flights: 12 },
  { hour: '02:00', flights: 8 },
  { hour: '04:00', flights: 15 },
  { hour: '06:00', flights: 34 },
  { hour: '08:00', flights: 67 },
  { hour: '10:00', flights: 89 },
  { hour: '12:00', flights: 78 },
  { hour: '14:00', flights: 92 },
  { hour: '16:00', flights: 105 },
  { hour: '18:00', flights: 98 },
  { hour: '20:00', flights: 76 },
  { hour: '22:00', flights: 45 }
])

const maxHourlyFlights = computed(() => Math.max(...hourlyActivity.value.map(h => h.flights)))

// Active Leaderboard Tab
const activeLeaderboard = ref<'airlines' | 'pilots'>('airlines')

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getRankChange(change: number): { icon: string; color: string } {
  if (change > 0) return { icon: 'i-lucide-trending-up', color: 'text-emerald-500' }
  if (change < 0) return { icon: 'i-lucide-trending-down', color: 'text-red-500' }
  return { icon: 'i-lucide-minus', color: 'text-gray-400' }
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div class="absolute inset-0">
        <div class="absolute inset-0 aviation-grid" />
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      <UContainer class="relative pt-12 pb-8">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span class="inline-block font-mono text-sm text-emerald-600 dark:text-emerald-400 mb-4 tracking-wider">// LIVE STATISTICS</span>
            <h1 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Statistics
            </h1>
            <p class="text-lg text-gray-600 dark:text-slate-400">
              Real-time insights into the VATSIM VA community activity.
            </p>
          </div>

          <!-- Live Indicator -->
          <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Live Data</span>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Live Stats Bar -->
    <section class="py-6 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-white/5">
      <UContainer>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <UIcon name="i-lucide-plane" class="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ liveStats.activeFlights }}</div>
              <div class="text-sm text-gray-500 dark:text-slate-500">Active Flights</div>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <UIcon name="i-lucide-users" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ liveStats.pilotsOnline }}</div>
              <div class="text-sm text-gray-500 dark:text-slate-500">Pilots Online</div>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <UIcon name="i-lucide-plane-takeoff" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ liveStats.flightsToday }}</div>
              <div class="text-sm text-gray-500 dark:text-slate-500">Flights Today</div>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <UIcon name="i-lucide-clock" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ liveStats.hoursToday }}</div>
              <div class="text-sm text-gray-500 dark:text-slate-500">Hours Today</div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="py-12">
      <UContainer>
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Column: Leaderboards -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Leaderboard Card -->
            <div class="rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 overflow-hidden">
              <!-- Tabs -->
              <div class="flex border-b border-gray-200 dark:border-white/5">
                <button
                  class="flex-1 px-6 py-4 text-sm font-medium transition-colors"
                  :class="activeLeaderboard === 'airlines'
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-500/5 border-b-2 border-sky-500'
                    : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'"
                  @click="activeLeaderboard = 'airlines'"
                >
                  <UIcon name="i-lucide-building-2" class="w-4 h-4 inline mr-2" />
                  Top Airlines
                </button>
                <button
                  class="flex-1 px-6 py-4 text-sm font-medium transition-colors"
                  :class="activeLeaderboard === 'pilots'
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-500/5 border-b-2 border-sky-500'
                    : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'"
                  @click="activeLeaderboard = 'pilots'"
                >
                  <UIcon name="i-lucide-user" class="w-4 h-4 inline mr-2" />
                  Top Pilots
                </button>
              </div>

              <!-- Airlines Leaderboard -->
              <div v-if="activeLeaderboard === 'airlines'" class="divide-y divide-gray-200 dark:divide-white/5">
                <div v-if="airlinesPending" class="p-8 text-center">
                  <div class="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  <p class="mt-2 text-sm text-gray-500 dark:text-slate-500">Loading airlines...</p>
                </div>
                <div v-else-if="topAirlines.length === 0" class="p-8 text-center text-gray-500 dark:text-slate-500">
                  No airlines data available yet
                </div>
                <div
                  v-else
                  v-for="airline in topAirlines"
                  :key="airline.code"
                  class="flex items-center gap-4 p-4 hover:bg-gray-100 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <!-- Rank -->
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold"
                    :class="{
                      'bg-amber-500/20 text-amber-600 dark:text-amber-400': airline.rank === 1,
                      'bg-gray-300/30 text-gray-500 dark:text-slate-400': airline.rank === 2,
                      'bg-orange-500/20 text-orange-600 dark:text-orange-400': airline.rank === 3,
                      'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-slate-500': airline.rank > 3
                    }"
                  >
                    {{ airline.rank }}
                  </div>

                  <!-- Airline Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <NuxtLink :to="`/airlines/${airline.code.toLowerCase()}`" class="font-semibold text-gray-900 dark:text-white truncate hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                        {{ airline.name }}
                      </NuxtLink>
                      <span class="text-xs font-mono text-gray-400 dark:text-slate-500">{{ airline.code }}</span>
                      <UIcon v-if="airline.verified" name="i-lucide-badge-check" class="w-4 h-4 text-sky-500" title="Verified" />
                    </div>
                    <div class="text-sm text-gray-500 dark:text-slate-500">
                      {{ airline.pilots.toLocaleString() }} pilots · {{ airline.region }}
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="hidden sm:flex items-center gap-6 text-sm">
                    <div class="text-right">
                      <div class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(airline.flights) }}</div>
                      <div class="text-gray-500 dark:text-slate-500">flights</div>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(airline.hours) }}</div>
                      <div class="text-gray-500 dark:text-slate-500">hours</div>
                    </div>
                  </div>

                  <!-- Change Indicator -->
                  <div v-if="airline.change !== 0" :class="getRankChange(airline.change).color">
                    <UIcon :name="getRankChange(airline.change).icon" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Pilots Leaderboard -->
              <div v-if="activeLeaderboard === 'pilots'" class="divide-y divide-gray-200 dark:divide-white/5">
                <div v-if="pilotsPending" class="p-8 text-center">
                  <div class="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  <p class="mt-2 text-sm text-gray-500 dark:text-slate-500">Loading pilots...</p>
                </div>
                <div v-else-if="topPilots.length === 0" class="p-8 text-center text-gray-500 dark:text-slate-500">
                  No pilots data available yet
                </div>
                <div
                  v-else
                  v-for="pilot in topPilots"
                  :key="pilot.cid"
                  class="flex items-center gap-4 p-4 hover:bg-gray-100 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <!-- Rank -->
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold"
                    :class="{
                      'bg-amber-500/20 text-amber-600 dark:text-amber-400': pilot.rank === 1,
                      'bg-gray-300/30 text-gray-500 dark:text-slate-400': pilot.rank === 2,
                      'bg-orange-500/20 text-orange-600 dark:text-orange-400': pilot.rank === 3,
                      'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-slate-500': pilot.rank > 3
                    }"
                  >
                    {{ pilot.rank }}
                  </div>

                  <!-- Pilot Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <NuxtLink :to="`/pilot/${pilot.cid}`" class="font-semibold text-gray-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                        {{ pilot.name }}
                      </NuxtLink>
                      <span v-if="pilot.country" class="text-xs">{{ pilot.country }}</span>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-slate-500">
                      {{ pilot.airline }}
                      <span v-if="pilot.vatsimHours > 0" class="ml-2 text-xs text-emerald-600 dark:text-emerald-400">
                        {{ Math.round(pilot.vatsimHours) }}h VATSIM
                      </span>
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="hidden sm:flex items-center gap-6 text-sm">
                    <div class="text-right">
                      <div class="font-semibold text-gray-900 dark:text-white">{{ pilot.flights.toLocaleString() }}</div>
                      <div class="text-gray-500 dark:text-slate-500">flights</div>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(Math.round(pilot.hours)) }}</div>
                      <div class="text-gray-500 dark:text-slate-500">hours</div>
                    </div>
                  </div>

                  <!-- Rating Badge -->
                  <div v-if="pilot.pilotRating" class="flex items-center gap-1 px-2 py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <UIcon name="i-lucide-award" class="w-4 h-4" />
                    <span class="text-xs font-medium">{{ pilot.pilotRating }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Chart -->
            <div class="rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-6">
              <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-6">Today's Activity</h3>

              <!-- Simple Bar Chart -->
              <div class="flex items-end justify-between gap-2 h-40">
                <div
                  v-for="hour in hourlyActivity"
                  :key="hour.hour"
                  class="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    class="w-full bg-sky-500/20 dark:bg-sky-500/30 rounded-t transition-all hover:bg-sky-500/40"
                    :style="{ height: `${(hour.flights / maxHourlyFlights) * 100}%` }"
                  />
                  <span class="text-xs text-gray-400 dark:text-slate-500 hidden sm:block">{{ hour.hour.slice(0, 2) }}</span>
                </div>
              </div>

              <div class="flex justify-between mt-4 text-xs text-gray-500 dark:text-slate-500">
                <span>00:00</span>
                <span>12:00</span>
                <span>24:00</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Activity Feed & Stats -->
          <div class="space-y-8">
            <!-- Platform Stats -->
            <div class="rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-6">
              <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-6">All-Time Statistics</h3>

              <div v-if="platformPending" class="py-8 text-center">
                <div class="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div v-else class="space-y-4">
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Total Pilots</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(platformStats.totalPilots) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Total Flights</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(platformStats.totalFlights) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Platform Hours</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(Math.round(platformStats.totalHours)) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">
                    <span class="flex items-center gap-1">
                      VATSIM Pilot Hours
                      <UIcon name="i-lucide-plane" class="w-3 h-3 text-emerald-500" />
                    </span>
                  </span>
                  <span class="font-display font-bold text-emerald-600 dark:text-emerald-400">{{ formatNumber(platformStats.vatsimStats?.totalPilotHours || 0) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">
                    <span class="flex items-center gap-1">
                      VATSIM ATC Hours
                      <UIcon name="i-lucide-radio-tower" class="w-3 h-3 text-sky-500" />
                    </span>
                  </span>
                  <span class="font-display font-bold text-sky-600 dark:text-sky-400">{{ formatNumber(platformStats.vatsimStats?.totalAtcHours || 0) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Virtual Airlines</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ platformStats.totalAirlines }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Distance Flown</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(platformStats.totalDistance) }} NM</span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <span class="text-gray-600 dark:text-slate-400">Avg. Flights/Day</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ platformStats.avgFlightsPerDay }}</span>
                </div>
              </div>
            </div>

            <!-- Live Activity Feed -->
            <div class="rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg">Recent Activity</h3>
                <span class="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              <div v-if="activityPending" class="py-8 text-center">
                <div class="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <p class="mt-2 text-sm text-gray-500 dark:text-slate-500">Loading activity...</p>
              </div>

              <div v-else-if="recentActivity.length === 0" class="py-8 text-center text-gray-500 dark:text-slate-500">
                <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity yet</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="(activity, index) in recentActivity"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    :class="activity.type === 'takeoff' ? 'bg-emerald-500/10' : 'bg-sky-500/10'"
                  >
                    <UIcon
                      :name="activity.type === 'takeoff' ? 'i-lucide-plane-takeoff' : 'i-lucide-plane-landing'"
                      class="w-4 h-4"
                      :class="activity.type === 'takeoff' ? 'text-emerald-600 dark:text-emerald-400' : 'text-sky-600 dark:text-sky-400'"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <NuxtLink
                        v-if="activity.pilotCid"
                        :to="`/pilot/${activity.pilotCid}`"
                        class="font-medium text-gray-900 dark:text-white text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                      >
                        {{ activity.pilot }}
                      </NuxtLink>
                      <span v-else class="font-medium text-gray-900 dark:text-white text-sm">{{ activity.pilot }}</span>
                      <span class="text-xs font-mono text-gray-400 dark:text-slate-500">{{ activity.flight }}</span>
                      <span v-if="activity.airline" class="text-xs px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium">
                        {{ activity.airline }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-slate-500 truncate">
                      {{ activity.route }} · {{ activity.aircraft }}
                    </div>
                  </div>
                  <span class="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
