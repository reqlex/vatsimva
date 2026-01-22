<script setup lang="ts">
useSeoMeta({
  title: 'Live Map - VATSIM VA',
  description: 'Track flights in real-time on our live map. See all active VATSIM VA pilots and their current positions.'
})

// Live Stats
const liveStats = ref({
  activeFlights: 127,
  onlineATC: 43,
  totalOnline: 2847
})

// Filter State
const showVAOnly = ref(true)
const selectedAirline = ref('all')
const showATC = ref(true)

const airlines = [
  { value: 'all', label: 'All Airlines' },
  { value: 'DLH', label: 'Lufthansa Virtual' },
  { value: 'UAE', label: 'Emirates Virtual' },
  { value: 'DAL', label: 'Delta Virtual' },
  { value: 'AFR', label: 'Air France Virtual' }
]

// Mock Active Flights
const activeFlights = ref([
  {
    id: 1,
    callsign: 'DLH456',
    pilot: 'MaxAviation',
    aircraft: 'A350-900',
    departure: 'EDDF',
    arrival: 'KJFK',
    altitude: 38000,
    speed: 487,
    heading: 285,
    progress: 45,
    status: 'cruise',
    airline: 'DLH'
  },
  {
    id: 2,
    callsign: 'UAE1',
    pilot: 'SkyCapt_Mike',
    aircraft: 'A380-800',
    departure: 'OMDB',
    arrival: 'EGLL',
    altitude: 40000,
    speed: 512,
    heading: 315,
    progress: 62,
    status: 'cruise',
    airline: 'UAE'
  },
  {
    id: 3,
    callsign: 'DAL100',
    pilot: 'AltitudePilot',
    aircraft: 'A330-900',
    departure: 'KJFK',
    arrival: 'KLAX',
    altitude: 37000,
    speed: 465,
    heading: 270,
    progress: 78,
    status: 'descent',
    airline: 'DAL'
  },
  {
    id: 4,
    callsign: 'AFR006',
    pilot: 'AeroQueen',
    aircraft: 'B777-300ER',
    departure: 'LFPG',
    arrival: 'KJFK',
    altitude: 39000,
    speed: 498,
    heading: 290,
    progress: 33,
    status: 'cruise',
    airline: 'AFR'
  },
  {
    id: 5,
    callsign: 'DLH789',
    pilot: 'CaptainCloud',
    aircraft: 'A320neo',
    departure: 'EDDM',
    arrival: 'LEMD',
    altitude: 36000,
    speed: 445,
    heading: 225,
    progress: 55,
    status: 'cruise',
    airline: 'DLH'
  },
  {
    id: 6,
    callsign: 'SIA21',
    pilot: 'JetStreamPro',
    aircraft: 'A350-900ULR',
    departure: 'WSSS',
    arrival: 'KJFK',
    altitude: 43000,
    speed: 478,
    heading: 5,
    progress: 28,
    status: 'cruise',
    airline: 'SIA'
  }
])

// Mock ATC Stations
const atcStations = ref([
  { callsign: 'EDDF_TWR', frequency: '119.900', name: 'Frankfurt Tower', type: 'TWR' },
  { callsign: 'EGLL_APP', frequency: '119.725', name: 'Heathrow Approach', type: 'APP' },
  { callsign: 'KJFK_CTR', frequency: '128.300', name: 'New York Center', type: 'CTR' },
  { callsign: 'OMDB_GND', frequency: '118.350', name: 'Dubai Ground', type: 'GND' }
])

const selectedFlight = ref<typeof activeFlights.value[0] | null>(null)

const filteredFlights = computed(() => {
  let result = activeFlights.value
  if (selectedAirline.value !== 'all') {
    result = result.filter(f => f.airline === selectedAirline.value)
  }
  return result
})

function selectFlight(flight: typeof activeFlights.value[0]) {
  selectedFlight.value = flight
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    ground: 'text-gray-500',
    takeoff: 'text-emerald-500',
    climb: 'text-sky-500',
    cruise: 'text-sky-500',
    descent: 'text-amber-500',
    approach: 'text-amber-500',
    landing: 'text-emerald-500'
  }
  return colors[status] || 'text-gray-500'
}

function getATCTypeColor(type: string) {
  const colors: Record<string, string> = {
    DEL: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    GND: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    TWR: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    APP: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    CTR: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
  }
  return colors[type] || 'bg-gray-500/10 text-gray-600'
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Full Height Map Layout -->
    <div class="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      <!-- Sidebar -->
      <div class="w-full lg:w-96 bg-white dark:bg-slate-950 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/5 flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-white/5">
          <div class="flex items-center justify-between mb-4">
            <h1 class="font-display text-xl font-bold text-gray-900 dark:text-white">Live Map</h1>
            <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-sm font-medium">Live</span>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-3 gap-2">
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-white/[0.02] text-center">
              <div class="font-display font-bold text-gray-900 dark:text-white">{{ liveStats.activeFlights }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Flights</div>
            </div>
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-white/[0.02] text-center">
              <div class="font-display font-bold text-gray-900 dark:text-white">{{ liveStats.onlineATC }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">ATC</div>
            </div>
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-white/[0.02] text-center">
              <div class="font-display font-bold text-gray-900 dark:text-white">{{ liveStats.totalOnline }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">VATSIM</div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="p-4 border-b border-gray-200 dark:border-white/5 space-y-3">
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="showVAOnly" />
              <span class="text-sm text-gray-700 dark:text-slate-300">VA flights only</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="showATC" />
              <span class="text-sm text-gray-700 dark:text-slate-300">Show ATC</span>
            </label>
          </div>
          <USelect
            v-model="selectedAirline"
            :items="airlines"
            value-key="value"
            label-key="label"
            placeholder="Filter by airline"
            size="sm"
          />
        </div>

        <!-- Flight List -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-2">
            <h3 class="px-2 py-1 text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
              Active Flights ({{ filteredFlights.length }})
            </h3>
            <div class="space-y-1 mt-2">
              <button
                v-for="flight in filteredFlights"
                :key="flight.id"
                class="w-full p-3 rounded-xl text-left transition-colors"
                :class="selectedFlight?.id === flight.id
                  ? 'bg-sky-500/10 border border-sky-500/30'
                  : 'bg-gray-50 dark:bg-white/[0.02] border border-transparent hover:border-gray-200 dark:hover:border-white/5'"
                @click="selectFlight(flight)"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ flight.callsign }}</span>
                  <span class="text-xs capitalize" :class="getStatusColor(flight.status)">{{ flight.status }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="font-mono text-gray-600 dark:text-slate-400">{{ flight.departure }}</span>
                  <UIcon name="i-lucide-arrow-right" class="w-3 h-3 text-gray-400" />
                  <span class="font-mono text-gray-600 dark:text-slate-400">{{ flight.arrival }}</span>
                </div>
                <div class="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-slate-500">
                  <span>{{ flight.aircraft }}</span>
                  <span>FL{{ Math.round(flight.altitude / 100) }} · {{ flight.speed }}kt</span>
                </div>
                <!-- Progress Bar -->
                <div class="mt-2 h-1 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-sky-500 transition-all"
                    :style="{ width: `${flight.progress}%` }"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- ATC Section -->
          <div v-if="showATC" class="p-2 border-t border-gray-200 dark:border-white/5">
            <h3 class="px-2 py-1 text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
              Online ATC ({{ atcStations.length }})
            </h3>
            <div class="space-y-1 mt-2">
              <div
                v-for="atc in atcStations"
                :key="atc.callsign"
                class="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-medium text-gray-900 dark:text-white">{{ atc.callsign }}</span>
                  <span :class="getATCTypeColor(atc.type)" class="px-2 py-0.5 rounded text-xs font-medium">
                    {{ atc.type }}
                  </span>
                </div>
                <div class="flex items-center justify-between mt-1 text-sm">
                  <span class="text-gray-500 dark:text-slate-500">{{ atc.name }}</span>
                  <span class="font-mono text-gray-600 dark:text-slate-400">{{ atc.frequency }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Area -->
      <div class="flex-1 relative bg-slate-900">
        <!-- Placeholder Map -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="absolute inset-0 opacity-20">
            <!-- World Map SVG Placeholder -->
            <svg viewBox="0 0 1000 500" class="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.1)" stroke-width="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <!-- Simplified continent outlines -->
              <ellipse cx="200" cy="200" rx="80" ry="60" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
              <ellipse cx="450" cy="180" rx="120" ry="80" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
              <ellipse cx="750" cy="200" rx="100" ry="70" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
              <ellipse cx="500" cy="350" rx="60" ry="40" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
              <ellipse cx="800" cy="380" rx="50" ry="35" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
            </svg>
          </div>

          <!-- Flight Icons (Positioned roughly) -->
          <div class="absolute" style="top: 35%; left: 30%;">
            <div class="relative group cursor-pointer">
              <div class="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center animate-pulse">
                <UIcon name="i-lucide-plane" class="w-4 h-4 text-white transform -rotate-45" />
              </div>
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                DLH456
              </span>
            </div>
          </div>

          <div class="absolute" style="top: 30%; left: 55%;">
            <div class="relative group cursor-pointer">
              <div class="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center animate-pulse">
                <UIcon name="i-lucide-plane" class="w-4 h-4 text-white transform -rotate-30" />
              </div>
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                UAE1
              </span>
            </div>
          </div>

          <div class="absolute" style="top: 40%; left: 20%;">
            <div class="relative group cursor-pointer">
              <div class="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                <UIcon name="i-lucide-plane" class="w-4 h-4 text-white transform -rotate-90" />
              </div>
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                DAL100
              </span>
            </div>
          </div>

          <!-- Center Message -->
          <div class="text-center z-10">
            <div class="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-lucide-map" class="w-10 h-10 text-sky-500" />
            </div>
            <h3 class="font-display text-xl font-semibold text-white mb-2">Interactive Map</h3>
            <p class="text-slate-400 text-sm max-w-xs">
              Integration with mapping library (Leaflet/Mapbox) would display live flight positions here.
            </p>
          </div>
        </div>

        <!-- Selected Flight Info Panel -->
        <div
          v-if="selectedFlight"
          class="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-xl"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="font-mono font-bold text-xl text-gray-900 dark:text-white">{{ selectedFlight.callsign }}</span>
              <span class="ml-2 text-sm text-gray-500 dark:text-slate-500">{{ selectedFlight.pilot }}</span>
            </div>
            <button
              class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              @click="selectedFlight = null"
            >
              <UIcon name="i-lucide-x" class="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <!-- Route -->
          <div class="flex items-center justify-between mb-4">
            <div class="text-center">
              <div class="font-mono font-bold text-lg text-gray-900 dark:text-white">{{ selectedFlight.departure }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Departure</div>
            </div>
            <div class="flex-1 px-4">
              <div class="h-1 rounded-full bg-gray-200 dark:bg-white/10 relative overflow-hidden">
                <div
                  class="h-full rounded-full bg-sky-500"
                  :style="{ width: `${selectedFlight.progress}%` }"
                />
              </div>
              <div class="text-center text-xs text-gray-500 dark:text-slate-500 mt-1">{{ selectedFlight.progress }}%</div>
            </div>
            <div class="text-center">
              <div class="font-mono font-bold text-lg text-gray-900 dark:text-white">{{ selectedFlight.arrival }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Arrival</div>
            </div>
          </div>

          <!-- Flight Data -->
          <div class="grid grid-cols-4 gap-2">
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-white/[0.02] text-center">
              <div class="text-xs text-gray-500 dark:text-slate-500">ALT</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white">{{ (selectedFlight.altitude / 1000).toFixed(0) }}K</div>
            </div>
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-white/[0.02] text-center">
              <div class="text-xs text-gray-500 dark:text-slate-500">SPD</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white">{{ selectedFlight.speed }}</div>
            </div>
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-white/[0.02] text-center">
              <div class="text-xs text-gray-500 dark:text-slate-500">HDG</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white">{{ selectedFlight.heading }}°</div>
            </div>
            <div class="p-2 rounded-lg bg-gray-50 dark:bg-white/[0.02] text-center">
              <div class="text-xs text-gray-500 dark:text-slate-500">A/C</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white text-xs">{{ selectedFlight.aircraft.split('-')[0] }}</div>
            </div>
          </div>
        </div>

        <!-- Map Controls -->
        <div class="absolute top-4 right-4 flex flex-col gap-2">
          <button class="w-10 h-10 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <UIcon name="i-lucide-plus" class="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
          <button class="w-10 h-10 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <UIcon name="i-lucide-minus" class="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
          <button class="w-10 h-10 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <UIcon name="i-lucide-maximize-2" class="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
