<script setup lang="ts">
useSeoMeta({
  title: 'Routes & Dispatch - VATSIM VA',
  description: 'Plan your flights with our route finder. Search routes, view schedules, and dispatch your next flight.'
})

const departureSearch = ref('')
const arrivalSearch = ref('')
const selectedAirline = ref('all')
const selectedAircraftType = ref('all')

const airlines = [
  { value: 'all', label: 'All Airlines' },
  { value: 'DLH', label: 'Lufthansa Virtual' },
  { value: 'UAE', label: 'Emirates Virtual' },
  { value: 'DAL', label: 'Delta Virtual' },
  { value: 'AFR', label: 'Air France Virtual' },
  { value: 'SIA', label: 'Singapore Virtual' }
]

const aircraftTypes = [
  { value: 'all', label: 'All Aircraft' },
  { value: 'narrowbody', label: 'Narrowbody' },
  { value: 'widebody', label: 'Widebody' },
  { value: 'regional', label: 'Regional' },
  { value: 'cargo', label: 'Cargo' }
]

// Mock Routes Data
const routes = ref([
  {
    id: 1,
    airline: 'DLH',
    airlineName: 'Lufthansa Virtual',
    flightNumber: 'DLH400',
    departure: { icao: 'EDDF', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany' },
    arrival: { icao: 'KJFK', name: 'John F Kennedy', city: 'New York', country: 'USA' },
    aircraft: ['A350-900', 'B747-8'],
    distance: 3456,
    duration: '8h 30m',
    frequency: 'Daily',
    flightLevel: 'FL380',
    type: 'widebody',
    popularity: 94
  },
  {
    id: 2,
    airline: 'DLH',
    airlineName: 'Lufthansa Virtual',
    flightNumber: 'DLH456',
    departure: { icao: 'EDDF', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany' },
    arrival: { icao: 'EGLL', name: 'Heathrow', city: 'London', country: 'UK' },
    aircraft: ['A320neo', 'A321'],
    distance: 398,
    duration: '1h 25m',
    frequency: '8x Daily',
    flightLevel: 'FL350',
    type: 'narrowbody',
    popularity: 87
  },
  {
    id: 3,
    airline: 'UAE',
    airlineName: 'Emirates Virtual',
    flightNumber: 'UAE1',
    departure: { icao: 'OMDB', name: 'Dubai Intl', city: 'Dubai', country: 'UAE' },
    arrival: { icao: 'EGLL', name: 'Heathrow', city: 'London', country: 'UK' },
    aircraft: ['A380-800'],
    distance: 2986,
    duration: '7h 00m',
    frequency: '3x Daily',
    flightLevel: 'FL400',
    type: 'widebody',
    popularity: 98
  },
  {
    id: 4,
    airline: 'DAL',
    airlineName: 'Delta Virtual',
    flightNumber: 'DAL100',
    departure: { icao: 'KJFK', name: 'John F Kennedy', city: 'New York', country: 'USA' },
    arrival: { icao: 'KLAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA' },
    aircraft: ['A330-900', 'B767-400'],
    distance: 2145,
    duration: '5h 30m',
    frequency: '6x Daily',
    flightLevel: 'FL370',
    type: 'widebody',
    popularity: 92
  },
  {
    id: 5,
    airline: 'AFR',
    airlineName: 'Air France Virtual',
    flightNumber: 'AFR006',
    departure: { icao: 'LFPG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    arrival: { icao: 'KJFK', name: 'John F Kennedy', city: 'New York', country: 'USA' },
    aircraft: ['A350-900', 'B777-300ER'],
    distance: 3167,
    duration: '8h 00m',
    frequency: '2x Daily',
    flightLevel: 'FL390',
    type: 'widebody',
    popularity: 89
  },
  {
    id: 6,
    airline: 'SIA',
    airlineName: 'Singapore Virtual',
    flightNumber: 'SIA21',
    departure: { icao: 'WSSS', name: 'Changi', city: 'Singapore', country: 'Singapore' },
    arrival: { icao: 'KJFK', name: 'John F Kennedy', city: 'New York', country: 'USA' },
    aircraft: ['A350-900ULR'],
    distance: 8285,
    duration: '18h 30m',
    frequency: 'Daily',
    flightLevel: 'FL430',
    type: 'widebody',
    popularity: 96
  },
  {
    id: 7,
    airline: 'DLH',
    airlineName: 'Lufthansa Virtual',
    flightNumber: 'DLH112',
    departure: { icao: 'EDDM', name: 'Munich', city: 'Munich', country: 'Germany' },
    arrival: { icao: 'LEMD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain' },
    aircraft: ['A320neo', 'A319'],
    distance: 876,
    duration: '2h 15m',
    frequency: '4x Daily',
    flightLevel: 'FL360',
    type: 'narrowbody',
    popularity: 78
  },
  {
    id: 8,
    airline: 'UAE',
    airlineName: 'Emirates Virtual',
    flightNumber: 'UAE412',
    departure: { icao: 'OMDB', name: 'Dubai Intl', city: 'Dubai', country: 'UAE' },
    arrival: { icao: 'WSSS', name: 'Changi', city: 'Singapore', country: 'Singapore' },
    aircraft: ['B777-300ER', 'A380-800'],
    distance: 3645,
    duration: '7h 20m',
    frequency: '4x Daily',
    flightLevel: 'FL390',
    type: 'widebody',
    popularity: 91
  }
])

// Popular Airports
const popularAirports = ref([
  { icao: 'EDDF', name: 'Frankfurt', flights: 234 },
  { icao: 'KJFK', name: 'New York JFK', flights: 198 },
  { icao: 'EGLL', name: 'London Heathrow', flights: 187 },
  { icao: 'OMDB', name: 'Dubai', flights: 156 },
  { icao: 'LFPG', name: 'Paris CDG', flights: 143 },
  { icao: 'WSSS', name: 'Singapore', flights: 134 }
])

const filteredRoutes = computed(() => {
  let result = [...routes.value]

  if (departureSearch.value) {
    const search = departureSearch.value.toUpperCase()
    result = result.filter(r =>
      r.departure.icao.includes(search) ||
      r.departure.city.toUpperCase().includes(search)
    )
  }

  if (arrivalSearch.value) {
    const search = arrivalSearch.value.toUpperCase()
    result = result.filter(r =>
      r.arrival.icao.includes(search) ||
      r.arrival.city.toUpperCase().includes(search)
    )
  }

  if (selectedAirline.value !== 'all') {
    result = result.filter(r => r.airline === selectedAirline.value)
  }

  if (selectedAircraftType.value !== 'all') {
    result = result.filter(r => r.type === selectedAircraftType.value)
  }

  return result.sort((a, b) => b.popularity - a.popularity)
})

function swapAirports() {
  const temp = departureSearch.value
  departureSearch.value = arrivalSearch.value
  arrivalSearch.value = temp
}

function setDeparture(icao: string) {
  departureSearch.value = icao
}

function formatDistance(nm: number): string {
  return nm.toLocaleString() + ' NM'
}

// Deterministic barcode pattern
const barcodePattern = [2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2]

// Helper to get airport city name from search
function getAirportCity(search: string): string {
  const icao = search.toUpperCase()
  const airport = popularAirports.value.find(a => a.icao === icao)
  if (airport) return airport.name

  // Check routes for more airports
  for (const route of routes.value) {
    if (route.departure.icao === icao) return route.departure.city
    if (route.arrival.icao === icao) return route.arrival.city
  }
  return ''
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div class="absolute inset-0">
        <div class="absolute inset-0 aviation-grid" />
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/5 dark:bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      <UContainer class="relative pt-12 pb-8">
        <span class="inline-block font-mono text-sm text-sky-600 dark:text-sky-400 mb-4 tracking-wider">// DISPATCH</span>
        <h1 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Routes & Dispatch
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400 max-w-2xl">
          Find your next flight. Search routes across all virtual airlines and dispatch your flight with real-world procedures.
        </p>
      </UContainer>
    </section>

    <!-- Search Section -->
    <section class="py-8 md:py-12 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-white/5">
      <UContainer>
        <div class="max-w-5xl mx-auto">
          <!-- Boarding Pass Style Search Card -->
          <div class="search-card relative rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden">
            <!-- Decorative perforated edge -->
            <div class="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around py-6 pointer-events-none">
              <div v-for="n in 12" :key="n" class="w-2 h-2 -ml-1 rounded-full bg-gray-50 dark:bg-slate-900/50" />
            </div>

            <div class="pl-6 pr-6 md:pl-8 md:pr-8 py-6 md:py-8">
              <!-- Airport Search Grid -->
              <div class="grid grid-cols-[1fr,auto,1fr] gap-3 sm:gap-4 md:gap-6 items-end">
                <!-- Departure (From) -->
                <div class="relative">
                  <label class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-slate-500">From</span>
                  </label>
                  <div class="relative">
                    <UInput
                      v-model="departureSearch"
                      placeholder="EDDF"
                      size="xl"
                      :ui="{
                        base: 'font-mono text-2xl md:text-3xl font-bold tracking-wider uppercase bg-transparent border-0 border-b-2 border-gray-200 dark:border-white/10 rounded-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-0 px-0 placeholder:text-gray-300 dark:placeholder:text-slate-700'
                      }"
                    />
                    <span v-if="departureSearch" class="absolute -bottom-5 left-0 text-xs text-gray-400 dark:text-slate-500 truncate max-w-full">
                      {{ getAirportCity(departureSearch) }}
                    </span>
                  </div>
                </div>

                <!-- Swap Button - Center -->
                <div class="flex justify-center items-center px-2 sm:px-4 md:px-8">
                  <button
                    class="group relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50"
                    @click="swapAirports"
                  >
                    <UIcon name="i-lucide-repeat-2" class="w-5 h-5 md:w-6 md:h-6 text-white transition-transform group-hover:rotate-180 duration-500" />
                    <!-- Pulse ring -->
                    <span class="absolute inset-0 rounded-full border-2 border-sky-400 animate-ping opacity-20" />
                  </button>
                </div>

                <!-- Arrival (To) -->
                <div class="relative">
                  <label class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-slate-500">To</span>
                  </label>
                  <div class="relative">
                    <UInput
                      v-model="arrivalSearch"
                      placeholder="KJFK"
                      size="xl"
                      :ui="{
                        base: 'font-mono text-2xl md:text-3xl font-bold tracking-wider uppercase bg-transparent border-0 border-b-2 border-gray-200 dark:border-white/10 rounded-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-0 px-0 placeholder:text-gray-300 dark:placeholder:text-slate-700'
                      }"
                    />
                    <span v-if="arrivalSearch" class="absolute -bottom-5 left-0 text-xs text-gray-400 dark:text-slate-500 truncate max-w-full">
                      {{ getAirportCity(arrivalSearch) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Divider with flight path -->
              <div class="relative my-8 md:my-10">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-dashed border-gray-200 dark:border-white/10" />
                </div>
                <div class="relative flex justify-center">
                  <span class="px-4 bg-white dark:bg-slate-900 text-gray-300 dark:text-slate-600">
                    <UIcon name="i-lucide-plane" class="w-5 h-5 transform rotate-90" />
                  </span>
                </div>
              </div>

              <!-- Filters Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 dark:text-slate-500 mb-1.5 block">Airline</label>
                  <USelect
                    v-model="selectedAirline"
                    :items="airlines"
                    value-key="value"
                    label-key="label"
                    placeholder="All Airlines"
                    size="lg"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 dark:text-slate-500 mb-1.5 block">Aircraft</label>
                  <USelect
                    v-model="selectedAircraftType"
                    :items="aircraftTypes"
                    value-key="value"
                    label-key="label"
                    placeholder="All Types"
                    size="lg"
                    class="w-full"
                  />
                </div>
                <div class="sm:col-span-2 lg:col-span-2 flex items-end">
                  <UButton color="primary" size="xl" class="w-full font-display font-semibold h-[46px]">
                    <UIcon name="i-lucide-search" class="w-5 h-5 mr-2" />
                    Search Routes
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Decorative barcode -->
            <div class="px-6 md:px-8 py-3 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div class="flex gap-[2px]" aria-hidden="true">
                <div v-for="(width, i) in barcodePattern" :key="i" class="h-4 bg-gray-300 dark:bg-slate-600" :style="{ width: width + 'px' }" />
              </div>
              <span class="font-mono text-[10px] text-gray-400 dark:text-slate-600 tracking-wider">VATSIM-VA-DISPATCH</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="py-12">
      <UContainer>
        <div class="grid lg:grid-cols-4 gap-8">
          <!-- Sidebar: Popular Airports -->
          <div class="lg:col-span-1">
            <div class="sticky top-24">
              <h3 class="font-display font-semibold text-gray-900 dark:text-white mb-4">Popular Hubs</h3>
              <div class="space-y-2">
                <button
                  v-for="airport in popularAirports"
                  :key="airport.icao"
                  class="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-colors text-left"
                  @click="setDeparture(airport.icao)"
                >
                  <div>
                    <span class="font-mono font-medium text-gray-900 dark:text-white">{{ airport.icao }}</span>
                    <span class="text-sm text-gray-500 dark:text-slate-500 ml-2">{{ airport.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400 dark:text-slate-500">{{ airport.flights }} routes</span>
                </button>
              </div>

              <!-- Quick Stats -->
              <div class="mt-8 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">Route Database</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-slate-400">Total Routes</span>
                    <span class="font-medium text-gray-900 dark:text-white">8,934</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-slate-400">Airlines</span>
                    <span class="font-medium text-gray-900 dark:text-white">52</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-slate-400">Airports</span>
                    <span class="font-medium text-gray-900 dark:text-white">1,247</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Routes List -->
          <div class="lg:col-span-3">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white">
                Available Routes
                <span class="text-gray-400 dark:text-slate-500 font-normal text-base ml-2">({{ filteredRoutes.length }})</span>
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="route in filteredRoutes"
                :key="route.id"
                class="group p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-all duration-300"
              >
                <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                  <!-- Route Info -->
                  <div class="flex-1">
                    <div class="flex items-center gap-4 mb-4">
                      <!-- Airline Badge -->
                      <div class="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                        <span class="font-display font-bold text-sky-600 dark:text-sky-400">{{ route.airline }}</span>
                      </div>

                      <!-- Flight Number -->
                      <div>
                        <span class="font-mono font-semibold text-gray-900 dark:text-white text-lg">{{ route.flightNumber }}</span>
                        <span class="block text-sm text-gray-500 dark:text-slate-500">{{ route.airlineName }}</span>
                      </div>
                    </div>

                    <!-- Route Visualization -->
                    <div class="flex items-center gap-4">
                      <!-- Departure -->
                      <div class="text-center">
                        <div class="font-mono font-bold text-2xl text-gray-900 dark:text-white">{{ route.departure.icao }}</div>
                        <div class="text-sm text-gray-500 dark:text-slate-500">{{ route.departure.city }}</div>
                      </div>

                      <!-- Flight Path -->
                      <div class="flex-1 flex items-center gap-2 px-4">
                        <div class="w-2 h-2 rounded-full bg-sky-500" />
                        <div class="flex-1 h-px bg-gradient-to-r from-sky-500 via-sky-500/50 to-sky-500 relative">
                          <UIcon name="i-lucide-plane" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
                        </div>
                        <div class="w-2 h-2 rounded-full bg-sky-500" />
                      </div>

                      <!-- Arrival -->
                      <div class="text-center">
                        <div class="font-mono font-bold text-2xl text-gray-900 dark:text-white">{{ route.arrival.icao }}</div>
                        <div class="text-sm text-gray-500 dark:text-slate-500">{{ route.arrival.city }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Flight Details -->
                  <div class="flex flex-wrap lg:flex-col gap-4 lg:gap-2 lg:text-right lg:min-w-[160px]">
                    <div class="flex items-center gap-2 lg:justify-end">
                      <UIcon name="i-lucide-clock" class="w-4 h-4 text-gray-400" />
                      <span class="text-sm text-gray-600 dark:text-slate-400">{{ route.duration }}</span>
                    </div>
                    <div class="flex items-center gap-2 lg:justify-end">
                      <UIcon name="i-lucide-navigation" class="w-4 h-4 text-gray-400" />
                      <span class="text-sm text-gray-600 dark:text-slate-400">{{ formatDistance(route.distance) }}</span>
                    </div>
                    <div class="flex items-center gap-2 lg:justify-end">
                      <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-400" />
                      <span class="text-sm text-gray-600 dark:text-slate-400">{{ route.frequency }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex flex-col gap-2">
                    <UButton color="primary" class="whitespace-nowrap">
                      <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
                      Dispatch
                    </UButton>
                    <UButton variant="outline" class="whitespace-nowrap">
                      <UIcon name="i-lucide-info" class="w-4 h-4 mr-2" />
                      Details
                    </UButton>
                  </div>
                </div>

                <!-- Aircraft & Tags -->
                <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
                  <span class="text-xs text-gray-500 dark:text-slate-500">Aircraft:</span>
                  <span
                    v-for="aircraft in route.aircraft"
                    :key="aircraft"
                    class="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/5 text-xs font-mono text-gray-600 dark:text-slate-400"
                  >
                    {{ aircraft }}
                  </span>
                  <span class="ml-auto text-xs text-gray-400 dark:text-slate-500">{{ route.flightLevel }}</span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredRoutes.length === 0" class="text-center py-16">
              <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-lucide-route-off" class="w-8 h-8 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-2">No routes found</h3>
              <p class="text-gray-500 dark:text-slate-500">Try adjusting your search criteria</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
