<script setup lang="ts">
useSeoMeta({
  title: 'Community - VATSIM VA',
  description: 'Connect with pilots from around the world. Find flight partners, join discussions, and be part of our community.'
})

const searchQuery = ref('')
const selectedTab = ref<'pilots' | 'news' | 'discord'>('pilots')

// Mock Pilots Data
const pilots = ref([
  { id: 1, name: 'MaxAviation', airline: 'Lufthansa Virtual', airlineCode: 'DLH', rank: 'Captain', flights: 1247, hours: 3421, online: true, country: 'DE' },
  { id: 2, name: 'SkyCapt_Mike', airline: 'Emirates Virtual', airlineCode: 'UAE', rank: 'Senior Captain', flights: 1189, hours: 3198, online: true, country: 'US' },
  { id: 3, name: 'FlyingDutchman', airline: 'Lufthansa Virtual', airlineCode: 'DLH', rank: 'First Officer', flights: 1156, hours: 2987, online: false, country: 'NL' },
  { id: 4, name: 'AeroQueen', airline: 'Air France Virtual', airlineCode: 'AFR', rank: 'Captain', flights: 1098, hours: 2876, online: true, country: 'FR' },
  { id: 5, name: 'JetStreamPro', airline: 'Singapore Virtual', airlineCode: 'SIA', rank: 'First Officer', flights: 1034, hours: 2654, online: false, country: 'SG' },
  { id: 6, name: 'CaptainCloud', airline: 'Lufthansa Virtual', airlineCode: 'DLH', rank: 'Captain', flights: 987, hours: 2543, online: true, country: 'DE' },
  { id: 7, name: 'WingCommander', airline: 'Emirates Virtual', airlineCode: 'UAE', rank: 'Senior First Officer', flights: 945, hours: 2432, online: false, country: 'UK' },
  { id: 8, name: 'AltitudePilot', airline: 'Delta Virtual', airlineCode: 'DAL', rank: 'Captain', flights: 912, hours: 2321, online: true, country: 'US' },
  { id: 9, name: 'SkywayFlyer', airline: 'Swiss Virtual', airlineCode: 'SWR', rank: 'First Officer', flights: 876, hours: 2198, online: false, country: 'CH' },
  { id: 10, name: 'AviatorX', airline: 'Qantas Virtual', airlineCode: 'QFA', rank: 'Second Officer', flights: 654, hours: 1654, online: true, country: 'AU' }
])

// News/Blog Posts
const news = ref([
  {
    id: 1,
    title: 'VATSIM Cross The Pond 2026 Announced',
    excerpt: 'The biggest transatlantic event of the year is back. Join thousands of pilots for the annual CTP westbound event.',
    date: '2026-01-18',
    author: 'VATSIM Events Team',
    category: 'Event',
    image: null
  },
  {
    id: 2,
    title: 'New Partner Airline: Japan Airlines Virtual',
    excerpt: 'We are excited to welcome JAL Virtual to our platform. Explore routes across Asia and beyond.',
    date: '2026-01-15',
    author: 'Platform Admin',
    category: 'Announcement',
    image: null
  },
  {
    id: 3,
    title: 'Career System Update: New Ranks & Badges',
    excerpt: 'We have expanded the career system with new achievements, special badges, and improved XP calculations.',
    date: '2026-01-12',
    author: 'Development Team',
    category: 'Update',
    image: null
  },
  {
    id: 4,
    title: 'Tips for Realistic Long-Haul Operations',
    excerpt: 'Learn how to plan and execute realistic long-haul flights with proper procedures and fuel management.',
    date: '2026-01-10',
    author: 'Community Guide',
    category: 'Tutorial',
    image: null
  }
])

// Community Stats
const communityStats = ref({
  totalPilots: 15423,
  onlineNow: 89,
  discordMembers: 8934,
  postsThisWeek: 234
})

const filteredPilots = computed(() => {
  if (!searchQuery.value) return pilots.value
  const query = searchQuery.value.toLowerCase()
  return pilots.value.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.airline.toLowerCase().includes(query)
  )
})

const onlinePilots = computed(() => pilots.value.filter(p => p.online))

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Event: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    Announcement: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    Update: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    Tutorial: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
  }
  return colors[category] || 'bg-gray-500/10 text-gray-600'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div class="absolute inset-0">
        <div class="absolute inset-0 aviation-grid" />
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      </div>

      <UContainer class="relative pt-12 pb-8">
        <span class="inline-block font-mono text-sm text-indigo-600 dark:text-indigo-400 mb-4 tracking-wider">// COMMUNITY</span>
        <h1 class="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Community Hub
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400 max-w-2xl">
          Connect with fellow pilots, share experiences, and be part of the VATSIM VA community.
        </p>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div class="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(communityStats.totalPilots) }}</div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Registered Pilots</div>
          </div>
          <div class="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span class="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ communityStats.onlineNow }}</span>
            </div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Online Now</div>
          </div>
          <div class="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(communityStats.discordMembers) }}</div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Discord Members</div>
          </div>
          <div class="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ communityStats.postsThisWeek }}</div>
            <div class="text-sm text-gray-500 dark:text-slate-500">Posts This Week</div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Tab Navigation -->
    <section class="sticky top-16 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-white/5">
      <UContainer>
        <div class="flex gap-1 py-2">
          <button
            class="px-6 py-3 text-sm font-medium rounded-lg transition-colors"
            :class="selectedTab === 'pilots'
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
              : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'"
            @click="selectedTab = 'pilots'"
          >
            <UIcon name="i-lucide-users" class="w-4 h-4 inline mr-2" />
            Pilots
          </button>
          <button
            class="px-6 py-3 text-sm font-medium rounded-lg transition-colors"
            :class="selectedTab === 'news'
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
              : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'"
            @click="selectedTab = 'news'"
          >
            <UIcon name="i-lucide-newspaper" class="w-4 h-4 inline mr-2" />
            News
          </button>
          <button
            class="px-6 py-3 text-sm font-medium rounded-lg transition-colors"
            :class="selectedTab === 'discord'
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
              : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'"
            @click="selectedTab = 'discord'"
          >
            <UIcon name="i-simple-icons-discord" class="w-4 h-4 inline mr-2" />
            Discord
          </button>
        </div>
      </UContainer>
    </section>

    <!-- Content -->
    <section class="py-12">
      <UContainer>
        <!-- Pilots Tab -->
        <div v-if="selectedTab === 'pilots'">
          <div class="grid lg:grid-cols-4 gap-8">
            <!-- Sidebar -->
            <div class="lg:col-span-1">
              <div class="sticky top-36 space-y-6">
                <!-- Search -->
                <UInput
                  v-model="searchQuery"
                  placeholder="Search pilots..."
                  icon="i-lucide-search"
                />

                <!-- Online Now -->
                <div class="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <h3 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online Now
                  </h3>
                  <div class="space-y-2">
                    <div
                      v-for="pilot in onlinePilots.slice(0, 5)"
                      :key="pilot.id"
                      class="flex items-center gap-2 text-sm"
                    >
                      <span class="font-medium text-gray-900 dark:text-white">{{ pilot.name }}</span>
                      <span class="text-gray-400 dark:text-slate-500">{{ pilot.airlineCode }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pilots List -->
            <div class="lg:col-span-3">
              <div class="grid sm:grid-cols-2 gap-4">
                <div
                  v-for="pilot in filteredPilots"
                  :key="pilot.id"
                  class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-colors"
                >
                  <div class="flex items-start gap-4">
                    <!-- Avatar -->
                    <div class="relative">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center">
                        <span class="font-display font-bold text-sky-600 dark:text-sky-400">{{ pilot.name.slice(0, 2).toUpperCase() }}</span>
                      </div>
                      <span
                        v-if="pilot.online"
                        class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950"
                      />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-gray-900 dark:text-white">{{ pilot.name }}</span>
                        <span class="text-xs">{{ pilot.country }}</span>
                      </div>
                      <div class="text-sm text-gray-500 dark:text-slate-500">{{ pilot.rank }} · {{ pilot.airline }}</div>
                      <div class="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-slate-500">
                        <span>{{ pilot.flights }} flights</span>
                        <span>{{ formatNumber(pilot.hours) }}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- News Tab -->
        <div v-if="selectedTab === 'news'">
          <div class="max-w-3xl mx-auto space-y-6">
            <div
              v-for="post in news"
              :key="post.id"
              class="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-3 mb-3">
                <span :class="getCategoryColor(post.category)" class="px-2.5 py-1 rounded-full text-xs font-medium">
                  {{ post.category }}
                </span>
                <span class="text-sm text-gray-500 dark:text-slate-500">{{ formatDate(post.date) }}</span>
              </div>
              <h3 class="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">{{ post.title }}</h3>
              <p class="text-gray-600 dark:text-slate-400 mb-4">{{ post.excerpt }}</p>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-slate-500">by {{ post.author }}</span>
                <UButton variant="ghost" size="sm" color="primary">
                  Read More
                  <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-1" />
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Discord Tab -->
        <div v-if="selectedTab === 'discord'">
          <div class="max-w-2xl mx-auto text-center">
            <div class="w-24 h-24 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-simple-icons-discord" class="w-12 h-12 text-[#5865F2]" />
            </div>
            <h2 class="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Join Our Discord</h2>
            <p class="text-lg text-gray-600 dark:text-slate-400 mb-8">
              Connect with {{ formatNumber(communityStats.discordMembers) }} pilots, find flight partners, get help, and stay updated with the latest news.
            </p>

            <div class="grid sm:grid-cols-3 gap-4 mb-8">
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                <UIcon name="i-lucide-message-circle" class="w-6 h-6 text-sky-500 mx-auto mb-2" />
                <div class="font-medium text-gray-900 dark:text-white">Live Chat</div>
                <div class="text-sm text-gray-500 dark:text-slate-500">Real-time discussions</div>
              </div>
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                <UIcon name="i-lucide-users" class="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <div class="font-medium text-gray-900 dark:text-white">Find Partners</div>
                <div class="text-sm text-gray-500 dark:text-slate-500">Group flight coordination</div>
              </div>
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                <UIcon name="i-lucide-help-circle" class="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <div class="font-medium text-gray-900 dark:text-white">Get Support</div>
                <div class="text-sm text-gray-500 dark:text-slate-500">Help from the community</div>
              </div>
            </div>

            <UButton size="xl" class="bg-[#5865F2] hover:bg-[#4752C4]">
              <UIcon name="i-simple-icons-discord" class="w-5 h-5 mr-2" />
              Join Discord Server
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
