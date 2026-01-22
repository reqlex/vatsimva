<script setup lang="ts">
useSeoMeta({
  title: 'Events & Group Flights - VATSIM VA',
  description: 'Join community events and group flights on VATSIM. Discover fly-ins, tours, and special events.'
})

const selectedCategory = ref('all')
const viewMode = ref<'grid' | 'calendar'>('grid')

const categories = [
  { value: 'all', label: 'All Events', icon: 'i-lucide-calendar' },
  { value: 'group-flight', label: 'Group Flights', icon: 'i-lucide-users' },
  { value: 'fly-in', label: 'Fly-Ins', icon: 'i-lucide-map-pin' },
  { value: 'tour', label: 'Tours', icon: 'i-lucide-route' },
  { value: 'competition', label: 'Competitions', icon: 'i-lucide-trophy' }
]

// Fetch events from API
const apiUrl = computed(() => {
  const params = new URLSearchParams()
  if (selectedCategory.value !== 'all') params.append('category', selectedCategory.value)
  return `/api/events?${params.toString()}`
})

const { data: eventsData, pending: eventsPending } = await useFetch(apiUrl, {
  watch: [selectedCategory]
})

const events = computed(() => eventsData.value?.data || [])

// Mock Events Data (for fallback/demo)
const mockEvents = ref([
  {
    id: 1,
    title: 'Transatlantic Tuesday',
    description: 'Weekly group flight across the Atlantic. This week: New York to London with real-world routing and full ATC coverage.',
    category: 'group-flight',
    date: '2026-01-21',
    time: '18:00',
    duration: '8h',
    airline: 'Multi-Airline',
    route: 'KJFK → EGLL',
    aircraft: 'Any widebody',
    participants: 47,
    maxParticipants: 60,
    image: null,
    featured: true,
    organizer: 'VATSIM VA Community'
  },
  {
    id: 2,
    title: 'Alpine Challenge 2026',
    description: 'Navigate through the challenging Alpine airports. Test your skills at LOWI, LSZS, and LSGS.',
    category: 'competition',
    date: '2026-01-25',
    time: '14:00',
    duration: '4h',
    airline: 'Open',
    route: 'LOWI → LSZS → LSGS',
    aircraft: 'Turboprop only',
    participants: 28,
    maxParticipants: 40,
    image: null,
    featured: true,
    organizer: 'Swiss Virtual'
  },
  {
    id: 3,
    title: 'Frankfurt Hub Day',
    description: 'Celebrate one of Europe\'s busiest hubs. Arrivals and departures from EDDF with full ATC staffing.',
    category: 'fly-in',
    date: '2026-01-23',
    time: '16:00',
    duration: '6h',
    airline: 'Lufthansa Group',
    route: 'Various → EDDF',
    aircraft: 'Any',
    participants: 89,
    maxParticipants: 120,
    image: null,
    featured: false,
    organizer: 'Lufthansa Virtual'
  },
  {
    id: 4,
    title: 'Middle East Explorer Tour',
    description: '5-leg tour exploring the stunning airports of the Middle East. Complete all legs for a special badge.',
    category: 'tour',
    date: '2026-01-20',
    time: '12:00',
    duration: '5 days',
    airline: 'Emirates Virtual',
    route: 'OMDB → OERK → OTHH → OBBI → OMDB',
    aircraft: 'B777/A380',
    participants: 156,
    maxParticipants: 200,
    image: null,
    featured: true,
    organizer: 'Emirates Virtual'
  },
  {
    id: 5,
    title: 'Cargo Night Operations',
    description: 'Experience the world of cargo aviation. Night flights across Europe with realistic cargo procedures.',
    category: 'group-flight',
    date: '2026-01-22',
    time: '22:00',
    duration: '4h',
    airline: 'Open',
    route: 'EHAM → EDDK',
    aircraft: 'Cargo aircraft',
    participants: 23,
    maxParticipants: 30,
    image: null,
    featured: false,
    organizer: 'Cargo VA Alliance'
  },
  {
    id: 6,
    title: 'Asia Pacific Showcase',
    description: 'Discover the beautiful airports of Asia Pacific. Singapore, Hong Kong, Tokyo and more.',
    category: 'fly-in',
    date: '2026-01-26',
    time: '08:00',
    duration: '10h',
    airline: 'Multi-Airline',
    route: 'WSSS Hub',
    aircraft: 'Any',
    participants: 67,
    maxParticipants: 100,
    image: null,
    featured: false,
    organizer: 'Singapore Virtual'
  },
  {
    id: 7,
    title: 'Caribbean Island Hopper',
    description: 'Explore the beautiful Caribbean islands in small aircraft. Perfect for VFR enthusiasts.',
    category: 'tour',
    date: '2026-01-28',
    time: '15:00',
    duration: '3 days',
    airline: 'Open',
    route: 'TFFR → TLPC → TBPB → TNCM',
    aircraft: 'GA/Small aircraft',
    participants: 34,
    maxParticipants: 50,
    image: null,
    featured: false,
    organizer: 'Caribbean VA'
  },
  {
    id: 8,
    title: 'Speed Landing Challenge',
    description: 'Test your landing skills. Compete for the smoothest landing and best centerline accuracy.',
    category: 'competition',
    date: '2026-01-24',
    time: '19:00',
    duration: '2h',
    airline: 'Open',
    route: 'EGLL RWY 27L',
    aircraft: 'A320/B737',
    participants: 52,
    maxParticipants: 60,
    image: null,
    featured: false,
    organizer: 'VATSIM VA Community'
  }
])

// Category filtering is done by API
const filteredEvents = computed(() => events.value)

const featuredEvents = computed(() => events.value.filter(e => e.featured))

const upcomingEvents = computed(() => {
  return [...events.value]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
})

function getCategoryInfo(category: string) {
  const cat = categories.find(c => c.value === category)
  const colors: Record<string, { bg: string; text: string }> = {
    'group-flight': { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400' },
    'fly-in': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    'tour': { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
    'competition': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' }
  }
  return {
    label: cat?.label || category,
    icon: cat?.icon || 'i-lucide-calendar',
    ...colors[category] || { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400' }
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function getParticipationPercentage(participants: number, max: number): number {
  return Math.round((participants / max) * 100)
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div class="absolute inset-0">
        <div class="absolute inset-0 aviation-grid" />
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      <UContainer class="relative pt-12 pb-8">
        <span class="inline-block font-mono text-sm text-amber-600 dark:text-amber-400 mb-4 tracking-wider">// EVENTS</span>
        <h1 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Events & Group Flights
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400 max-w-2xl">
          Join our community events, group flights, and competitions. Fly together with pilots from around the world.
        </p>
      </UContainer>
    </section>

    <!-- Featured Events -->
    <section class="py-12 bg-gray-50 dark:bg-slate-900/50">
      <UContainer>
        <div class="flex items-center justify-between mb-8">
          <h2 class="font-display text-2xl font-bold text-gray-900 dark:text-white">Featured Events</h2>
          <div class="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <UIcon name="i-lucide-star" class="w-4 h-4" />
            <span class="text-sm font-medium">{{ eventsPending ? '...' : featuredEvents.length }} Featured</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="eventsPending" class="py-16 text-center">
          <div class="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p class="mt-4 text-gray-500 dark:text-slate-500">Loading events...</p>
        </div>

        <!-- No Featured Events -->
        <div v-else-if="featuredEvents.length === 0" class="py-16 text-center text-gray-500 dark:text-slate-500">
          <UIcon name="i-lucide-star-off" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No featured events at the moment</p>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in featuredEvents"
            :key="event.id"
            class="group relative rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 overflow-hidden hover:border-amber-500/30 transition-all duration-300 card-lift"
          >
            <!-- Category & Date Header -->
            <div class="p-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
              <div :class="[getCategoryInfo(event.category).bg, getCategoryInfo(event.category).text]" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium">
                <UIcon :name="getCategoryInfo(event.category).icon" class="w-3.5 h-3.5" />
                {{ getCategoryInfo(event.category).label }}
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500">
                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                {{ formatDate(event.date) }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {{ event.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-4">
                {{ event.description }}
              </p>

              <!-- Event Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span class="text-gray-600 dark:text-slate-400">{{ event.time }} UTC · {{ event.duration }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-route" class="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span class="text-gray-600 dark:text-slate-400 font-mono">{{ event.route }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-lucide-plane" class="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span class="text-gray-600 dark:text-slate-400">{{ event.aircraft }}</span>
                </div>
              </div>

              <!-- Participation Bar -->
              <div class="mb-4">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-gray-500 dark:text-slate-500">{{ event.participants }}/{{ event.maxParticipants }} pilots</span>
                  <span class="text-gray-500 dark:text-slate-500">{{ getParticipationPercentage(event.participants, event.maxParticipants) }}%</span>
                </div>
                <div class="h-2 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                    :style="{ width: `${getParticipationPercentage(event.participants, event.maxParticipants)}%` }"
                  />
                </div>
              </div>

              <!-- Organizer & CTA -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-slate-500">by {{ event.organizer }}</span>
                <UButton size="sm" color="primary">
                  Join Event
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- All Events -->
    <section class="py-12">
      <UContainer>
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category.value"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
              :class="selectedCategory === category.value
                ? 'bg-sky-500 text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10'"
              @click="selectedCategory = category.value"
            >
              <UIcon :name="category.icon" class="w-4 h-4" />
              {{ category.label }}
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'grid' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'text-gray-400 hover:text-gray-600'"
              @click="viewMode = 'grid'"
            >
              <UIcon name="i-lucide-grid-3x3" class="w-5 h-5" />
            </button>
            <button
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'calendar' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'text-gray-400 hover:text-gray-600'"
              @click="viewMode = 'calendar'"
            >
              <UIcon name="i-lucide-calendar-days" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="eventsPending" class="py-16 text-center">
          <div class="inline-block w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p class="mt-4 text-gray-500 dark:text-slate-500">Loading events...</p>
        </div>

        <!-- Events Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="group relative rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 overflow-hidden hover:border-sky-500/30 transition-all duration-300 card-lift"
          >
            <!-- Header -->
            <div class="p-4 flex items-center justify-between">
              <div :class="[getCategoryInfo(event.category).bg, getCategoryInfo(event.category).text]" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium">
                <UIcon :name="getCategoryInfo(event.category).icon" class="w-3.5 h-3.5" />
                {{ getCategoryInfo(event.category).label }}
              </div>
              <div v-if="event.featured" class="flex items-center gap-1 text-amber-500">
                <UIcon name="i-lucide-star" class="w-4 h-4 fill-current" />
              </div>
            </div>

            <!-- Content -->
            <div class="px-4 pb-4">
              <h3 class="font-display font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {{ event.title }}
              </h3>

              <p class="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 mb-4">
                {{ event.description }}
              </p>

              <!-- Quick Info -->
              <div class="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-slate-500 mb-4">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                  {{ formatDate(event.date) }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                  {{ event.time }} UTC
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-users" class="w-3.5 h-3.5" />
                  {{ event.participants }}/{{ event.maxParticipants }}
                </span>
              </div>

              <!-- Route Badge -->
              <div class="flex items-center justify-between">
                <span class="px-2 py-1 rounded bg-gray-200 dark:bg-white/5 text-xs font-mono text-gray-600 dark:text-slate-400">
                  {{ event.route }}
                </span>
                <UButton size="xs" variant="ghost" color="primary">
                  Details
                  <UIcon name="i-lucide-arrow-right" class="w-3 h-3 ml-1" />
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredEvents.length === 0" class="text-center py-16">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-calendar-x" class="w-8 h-8 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 class="font-display font-semibold text-gray-900 dark:text-white text-lg mb-2">No events found</h3>
          <p class="text-gray-500 dark:text-slate-500">No events in this category at the moment.</p>
        </div>
      </UContainer>
    </section>

    <!-- Create Event CTA -->
    <section class="py-12 bg-gray-50 dark:bg-slate-900/50">
      <UContainer>
        <div class="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-8 md:p-12">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 class="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Want to host your own event?
              </h3>
              <p class="text-gray-600 dark:text-slate-400">
                Create group flights, organize fly-ins, or start a tour for your virtual airline.
              </p>
            </div>
            <UButton size="lg" color="primary" class="shrink-0">
              <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
              Create Event
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
