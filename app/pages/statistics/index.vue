<script setup lang="ts">
useSeoMeta({
  title: 'Live Statistics - VATSIM VA',
  description: 'Real-time statistics, leaderboards and activity tracking for virtual airlines on VATSIM.'
})

// Live Stats
const liveStats = ref({
  activeFlights: 127,
  pilotsOnline: 89,
  flightsToday: 342,
  hoursToday: 891
})

// Platform Statistics
const platformStats = ref({
  totalPilots: 15423,
  totalFlights: 523847,
  totalHours: 1248392,
  totalAirlines: 52,
  totalRoutes: 8934,
  avgFlightsPerDay: 412
})

// Top Airlines Leaderboard
const topAirlines = ref([
  { rank: 1, name: 'Delta Virtual Airlines', code: 'DAL', flights: 89432, hours: 214567, pilots: 2156, change: 2 },
  { rank: 2, name: 'Emirates Virtual', code: 'UAE', flights: 67234, hours: 178432, pilots: 1876, change: 0 },
  { rank: 3, name: 'Lufthansa Virtual', code: 'DLH', flights: 45892, hours: 112345, pilots: 1247, change: 1 },
  { rank: 4, name: 'Air France Virtual', code: 'AFR', flights: 41234, hours: 98234, pilots: 1123, change: -2 },
  { rank: 5, name: 'Singapore Virtual', code: 'SIA', flights: 34567, hours: 87654, pilots: 943, change: 1 },
  { rank: 6, name: 'Swiss Virtual', code: 'SWR', flights: 28341, hours: 71234, pilots: 834, change: 0 },
  { rank: 7, name: 'Qantas Virtual', code: 'QFA', flights: 25678, hours: 64532, pilots: 687, change: 3 },
  { rank: 8, name: 'LATAM Virtual', code: 'LAN', flights: 21098, hours: 52876, pilots: 567, change: -1 }
])

// Top Pilots Leaderboard
const topPilots = ref([
  { rank: 1, name: 'MaxAviation', airline: 'DAL', flights: 1247, hours: 3421, rating: 4.98 },
  { rank: 2, name: 'SkyCapt_Mike', airline: 'UAE', flights: 1189, hours: 3198, rating: 4.97 },
  { rank: 3, name: 'FlyingDutchman', airline: 'DLH', flights: 1156, hours: 2987, rating: 4.96 },
  { rank: 4, name: 'AeroQueen', airline: 'AFR', flights: 1098, hours: 2876, rating: 4.95 },
  { rank: 5, name: 'JetStreamPro', airline: 'SIA', flights: 1034, hours: 2654, rating: 4.94 },
  { rank: 6, name: 'CaptainCloud', airline: 'DLH', flights: 987, hours: 2543, rating: 4.93 },
  { rank: 7, name: 'WingCommander', airline: 'UAE', flights: 945, hours: 2432, rating: 4.92 },
  { rank: 8, name: 'AltitudePilot', airline: 'DAL', flights: 912, hours: 2321, rating: 4.91 }
])

// Recent Activity Feed
const recentActivity = ref([
  { type: 'landing', pilot: 'MaxAviation', flight: 'DAL421', route: 'KJFK → KLAX', time: '2 min ago', aircraft: 'B777-300ER' },
  { type: 'takeoff', pilot: 'SkyCapt_Mike', flight: 'UAE204', route: 'OMDB → EGLL', time: '5 min ago', aircraft: 'A380-800' },
  { type: 'landing', pilot: 'FlyingDutchman', flight: 'DLH456', route: 'EDDF → KJFK', time: '8 min ago', aircraft: 'A350-900' },
  { type: 'takeoff', pilot: 'AeroQueen', flight: 'AFR089', route: 'LFPG → RJTT', time: '12 min ago', aircraft: 'B787-9' },
  { type: 'landing', pilot: 'JetStreamPro', flight: 'SIA321', route: 'WSSS → VHHH', time: '15 min ago', aircraft: 'A350-900' },
  { type: 'takeoff', pilot: 'CaptainCloud', flight: 'DLH789', route: 'EDDM → LEMD', time: '18 min ago', aircraft: 'A320neo' }
])

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
                <div
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
                      <span class="font-semibold text-gray-900 dark:text-white truncate">{{ airline.name }}</span>
                      <span class="text-xs font-mono text-gray-400 dark:text-slate-500">{{ airline.code }}</span>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-slate-500">
                      {{ airline.pilots.toLocaleString() }} pilots
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
                  <div :class="getRankChange(airline.change).color">
                    <UIcon :name="getRankChange(airline.change).icon" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Pilots Leaderboard -->
              <div v-if="activeLeaderboard === 'pilots'" class="divide-y divide-gray-200 dark:divide-white/5">
                <div
                  v-for="pilot in topPilots"
                  :key="pilot.name"
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
                      <span class="font-semibold text-gray-900 dark:text-white">{{ pilot.name }}</span>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-slate-500">
                      {{ pilot.airline }}
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="hidden sm:flex items-center gap-6 text-sm">
                    <div class="text-right">
                      <div class="font-semibold text-gray-900 dark:text-white">{{ pilot.flights.toLocaleString() }}</div>
                      <div class="text-gray-500 dark:text-slate-500">flights</div>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(pilot.hours) }}</div>
                      <div class="text-gray-500 dark:text-slate-500">hours</div>
                    </div>
                  </div>

                  <!-- Rating -->
                  <div class="flex items-center gap-1 text-amber-500">
                    <UIcon name="i-lucide-star" class="w-4 h-4 fill-current" />
                    <span class="text-sm font-medium">{{ pilot.rating }}</span>
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

              <div class="space-y-4">
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Total Pilots</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(platformStats.totalPilots) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Total Flights</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(platformStats.totalFlights) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Flight Hours</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(platformStats.totalHours) }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Virtual Airlines</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ platformStats.totalAirlines }}</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/5">
                  <span class="text-gray-600 dark:text-slate-400">Available Routes</span>
                  <span class="font-display font-bold text-gray-900 dark:text-white">{{ formatNumber(platformStats.totalRoutes) }}</span>
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
                <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg">Live Activity</h3>
                <span class="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              <div class="space-y-4">
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
                      <span class="font-medium text-gray-900 dark:text-white text-sm">{{ activity.pilot }}</span>
                      <span class="text-xs font-mono text-gray-400 dark:text-slate-500">{{ activity.flight }}</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-slate-500 truncate">
                      {{ activity.route }} · {{ activity.aircraft }}
                    </div>
                  </div>
                  <span class="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">{{ activity.time }}</span>
                </div>
              </div>

              <NuxtLink to="/map" class="block mt-6">
                <UButton variant="outline" class="w-full">
                  <UIcon name="i-lucide-map" class="w-4 h-4 mr-2" />
                  View Live Map
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
