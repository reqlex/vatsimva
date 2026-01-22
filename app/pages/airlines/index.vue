<script setup lang="ts">
useSeoMeta({
  title: 'Virtual Airlines - VATSIM VA',
  description: 'Discover and join virtual airlines on VATSIM. Browse hundreds of VAs from around the world.'
})

const searchQuery = ref('')
const selectedRegion = ref('all')
const selectedSize = ref('all')
const sortBy = ref('members')

const regions = [
  { value: 'all', label: 'All Regions' },
  { value: 'europe', label: 'Europe' },
  { value: 'north-america', label: 'North America' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'south-america', label: 'South America' },
  { value: 'africa', label: 'Africa' }
]

const sizes = [
  { value: 'all', label: 'All Sizes' },
  { value: 'large', label: 'Large (500+ pilots)' },
  { value: 'medium', label: 'Medium (100-500 pilots)' },
  { value: 'small', label: 'Small (< 100 pilots)' }
]

const sortOptions = [
  { value: 'members', label: 'Most Members' },
  { value: 'flights', label: 'Most Flights' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' }
]

// Fetch airlines from API
const apiUrl = computed(() => {
  const params = new URLSearchParams()
  if (searchQuery.value) params.append('search', searchQuery.value)
  if (selectedRegion.value !== 'all') params.append('region', selectedRegion.value)
  if (selectedSize.value !== 'all') params.append('size', selectedSize.value)
  params.append('sortBy', sortBy.value)
  return `/api/airlines?${params.toString()}`
})

const { data: airlinesData, pending: airlinesPending, refresh: refreshAirlines } = await useFetch(apiUrl, {
  watch: [searchQuery, selectedRegion, selectedSize, sortBy]
})

const airlines = computed(() => airlinesData.value?.data || [])

// Fallback mock data for demo purposes
const mockAirlines = ref([
  {
    id: 1,
    name: 'Lufthansa Virtual',
    code: 'DLH',
    icao: 'DLHV',
    logo: null,
    description: 'Official virtual counterpart of Lufthansa. Experience German precision and quality in the virtual skies.',
    members: 1247,
    flights: 45892,
    rating: 4.9,
    region: 'europe',
    founded: '2015',
    hubs: ['EDDF', 'EDDM'],
    fleet: ['A320', 'A350', 'B747', 'B787'],
    verified: true
  },
  {
    id: 2,
    name: 'Swiss Virtual',
    code: 'SWR',
    icao: 'SWRV',
    logo: null,
    description: 'Fly the Swiss way with our virtual airline. Premium service and stunning alpine routes.',
    members: 834,
    flights: 28341,
    rating: 4.8,
    region: 'europe',
    founded: '2016',
    hubs: ['LSZH'],
    fleet: ['A220', 'A320', 'A330', 'B777'],
    verified: true
  },
  {
    id: 3,
    name: 'Austrian Virtual',
    code: 'AUA',
    icao: 'AUAV',
    logo: null,
    description: 'Your gateway to Central Europe. Connecting Vienna with the world.',
    members: 612,
    flights: 19234,
    rating: 4.7,
    region: 'europe',
    founded: '2017',
    hubs: ['LOWW'],
    fleet: ['A320', 'B767', 'B777'],
    verified: true
  },
  {
    id: 4,
    name: 'Eurowings Virtual',
    code: 'EWG',
    icao: 'EWGV',
    logo: null,
    description: 'Low-cost carrier with high standards. Fly across Europe with Eurowings Virtual.',
    members: 423,
    flights: 12567,
    rating: 4.6,
    region: 'europe',
    founded: '2018',
    hubs: ['EDDK', 'EDDL'],
    fleet: ['A319', 'A320'],
    verified: false
  },
  {
    id: 5,
    name: 'Delta Virtual Airlines',
    code: 'DAL',
    icao: 'DALV',
    logo: null,
    description: 'Keep climbing. Americas largest virtual airline with routes spanning the globe.',
    members: 2156,
    flights: 89432,
    rating: 4.8,
    region: 'north-america',
    founded: '2014',
    hubs: ['KATL', 'KJFK', 'KLAX', 'KMSP'],
    fleet: ['A220', 'A320', 'A330', 'A350', 'B737', 'B757', 'B767', 'B777'],
    verified: true
  },
  {
    id: 6,
    name: 'Emirates Virtual',
    code: 'UAE',
    icao: 'UAEV',
    logo: null,
    description: 'Hello Tomorrow. Experience luxury aviation in the virtual world.',
    members: 1876,
    flights: 67234,
    rating: 4.9,
    region: 'middle-east',
    founded: '2015',
    hubs: ['OMDB'],
    fleet: ['A380', 'B777'],
    verified: true
  },
  {
    id: 7,
    name: 'Singapore Virtual Airlines',
    code: 'SIA',
    icao: 'SIAV',
    logo: null,
    description: 'A Great Way to Fly. Premium Asian carrier with worldwide connections.',
    members: 943,
    flights: 34567,
    rating: 4.9,
    region: 'asia',
    founded: '2016',
    hubs: ['WSSS'],
    fleet: ['A350', 'A380', 'B777', 'B787'],
    verified: true
  },
  {
    id: 8,
    name: 'LATAM Virtual',
    code: 'LAN',
    icao: 'LANV',
    logo: null,
    description: 'Connecting South America with the world. Experience the warmth of Latin hospitality.',
    members: 567,
    flights: 21098,
    rating: 4.5,
    region: 'south-america',
    founded: '2017',
    hubs: ['SCEL', 'SBGR'],
    fleet: ['A320', 'A350', 'B767', 'B787'],
    verified: true
  },
  {
    id: 9,
    name: 'Ethiopian Virtual',
    code: 'ETH',
    icao: 'ETHV',
    logo: null,
    description: 'The New Spirit of Africa. Connect with the continent through Addis Ababa.',
    members: 234,
    flights: 8976,
    rating: 4.4,
    region: 'africa',
    founded: '2019',
    hubs: ['HAAB'],
    fleet: ['A350', 'B737', 'B777', 'B787'],
    verified: false
  },
  {
    id: 10,
    name: 'Ryanair Virtual',
    code: 'RYR',
    icao: 'RYRV',
    logo: null,
    description: 'Europes favorite airline, now in the virtual world. Low fares, lots of fun.',
    members: 756,
    flights: 43210,
    rating: 4.3,
    region: 'europe',
    founded: '2018',
    hubs: ['EIDW', 'EGSS'],
    fleet: ['B737'],
    verified: false
  },
  {
    id: 11,
    name: 'Qantas Virtual',
    code: 'QFA',
    icao: 'QFAV',
    logo: null,
    description: 'The Spirit of Australia. Long-haul specialists connecting the land down under.',
    members: 687,
    flights: 25678,
    rating: 4.7,
    region: 'asia',
    founded: '2016',
    hubs: ['YSSY', 'YMML'],
    fleet: ['A330', 'A380', 'B737', 'B787'],
    verified: true
  },
  {
    id: 12,
    name: 'Air France Virtual',
    code: 'AFR',
    icao: 'AFRV',
    logo: null,
    description: 'France is in the air. Elegance and excellence in virtual aviation.',
    members: 1123,
    flights: 41234,
    rating: 4.6,
    region: 'europe',
    founded: '2015',
    hubs: ['LFPG'],
    fleet: ['A220', 'A320', 'A330', 'A350', 'A380', 'B777', 'B787'],
    verified: true
  }
])

// Filtering and sorting is now done by API
const filteredAirlines = computed(() => airlines.value)

const stats = computed(() => ({
  totalAirlines: airlines.value.length,
  totalPilots: airlines.value.reduce((sum, a) => sum + a.members, 0),
  totalFlights: airlines.value.reduce((sum, a) => sum + a.flights, 0),
  verifiedAirlines: airlines.value.filter(a => a.verified).length
}))

function getRegionLabel(region: string): string {
  return regions.find(r => r.value === region)?.label || region
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
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

      <UContainer class="relative pt-12 pb-16">
        <div class="max-w-3xl">
          <span class="inline-block font-mono text-sm text-sky-600 dark:text-sky-400 mb-4 tracking-wider">// VIRTUAL AIRLINES</span>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Airlines
          </h1>
          <p class="text-lg text-gray-600 dark:text-slate-400 mb-8">
            Browse our directory of virtual airlines on VATSIM. Find the perfect VA for your flying style.
          </p>

          <!-- CTA Button -->
          <NuxtLink to="/airlines/register">
            <UButton
              size="lg"
              color="primary"
              class="font-display font-semibold"
            >
              <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
              Register Your VA
            </UButton>
          </NuxtLink>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalAirlines }}</div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Virtual Airlines</div>
          </div>
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalPilots) }}</div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Total Pilots</div>
          </div>
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalFlights) }}</div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Flights Completed</div>
          </div>
          <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="font-display text-2xl font-bold text-sky-600 dark:text-sky-400">{{ stats.verifiedAirlines }}</div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Verified VAs</div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Filters & Search Section -->
    <section class="sticky top-16 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-white/5">
      <UContainer class="py-4">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              placeholder="Search airlines by name or code..."
              icon="i-lucide-search"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-3">
            <USelect
              v-model="selectedRegion"
              :items="regions"
              value-key="value"
              label-key="label"
              placeholder="Region"
              class="w-40"
            />
            <USelect
              v-model="selectedSize"
              :items="sizes"
              value-key="value"
              label-key="label"
              placeholder="Size"
              class="w-44"
            />
            <USelect
              v-model="sortBy"
              :items="sortOptions"
              value-key="value"
              label-key="label"
              placeholder="Sort by"
              class="w-40"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Airlines Grid -->
    <section class="py-12">
      <UContainer>
        <!-- Results count -->
        <div class="mb-6 text-sm text-gray-500 dark:text-slate-500">
          <span v-if="!airlinesPending">Showing {{ filteredAirlines.length }} airlines</span>
          <span v-else>Loading...</span>
        </div>

        <!-- Loading State -->
        <div v-if="airlinesPending" class="py-16 text-center">
          <div class="inline-block w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p class="mt-4 text-gray-500 dark:text-slate-500">Loading airlines...</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="airline in filteredAirlines"
            :key="airline.id"
            class="group relative p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-all duration-300 cursor-pointer card-lift"
          >
            <!-- Airline Header -->
            <div class="flex items-start gap-4 mb-4">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 border border-sky-500/20 flex items-center justify-center shrink-0">
                <span class="font-display font-bold text-xl text-sky-600 dark:text-sky-400">{{ airline.code }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-tight">
                  {{ airline.name }}
                </h3>
                <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
                  <span class="text-xs text-gray-500 dark:text-slate-500">{{ airline.icao }}</span>
                  <span class="text-gray-300 dark:text-slate-700">|</span>
                  <span class="text-xs text-gray-500 dark:text-slate-500">{{ getRegionLabel(airline.region) }}</span>
                  <!-- Verified Badge -->
                  <div
                    v-if="airline.verified"
                    class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  >
                    <UIcon name="i-lucide-badge-check" class="w-3.5 h-3.5" />
                    <span class="text-xs font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-4">
              {{ airline.description }}
            </p>

            <!-- Hubs -->
            <div class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="hub in airline.hubs"
                :key="hub"
                class="px-2 py-0.5 text-xs font-mono bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-slate-400 rounded"
              >
                {{ hub }}
              </span>
            </div>

            <!-- Stats Row -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/5">
              <div class="flex items-center gap-4 text-sm">
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-users" class="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span class="text-gray-900 dark:text-white font-medium">{{ airline.members.toLocaleString() }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-plane" class="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span class="text-gray-900 dark:text-white font-medium">{{ formatNumber(airline.flights) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1 text-amber-500">
                  <UIcon name="i-lucide-star" class="w-4 h-4 fill-current" />
                  <span class="text-sm font-medium">{{ airline.rating }}</span>
                </div>
                <!-- Hover Arrow -->
                <div class="w-8 h-8 rounded-full bg-sky-500/0 group-hover:bg-sky-500/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <UIcon name="i-lucide-arrow-up-right" class="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredAirlines.length === 0"
          class="text-center py-16"
        >
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-search-x" class="w-8 h-8 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-2">No airlines found</h3>
          <p class="text-gray-500 dark:text-slate-500 mb-6">Try adjusting your search or filters</p>
          <UButton
            variant="outline"
            @click="searchQuery = ''; selectedRegion = 'all'; selectedSize = 'all'"
          >
            Clear Filters
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gray-50 dark:bg-slate-900/50">
      <UContainer>
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Don't see your airline?
          </h2>
          <p class="text-gray-600 dark:text-slate-400 mb-8">
            Register your virtual airline on our platform and connect with pilots worldwide.
          </p>
          <NuxtLink to="/airlines/register">
            <UButton
              size="lg"
              color="primary"
              class="font-display font-semibold"
            >
              <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
              Register Your VA
            </UButton>
          </NuxtLink>
        </div>
      </UContainer>
    </section>
  </div>
</template>
