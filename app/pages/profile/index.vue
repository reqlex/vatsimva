<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'My Profile - VATSIM VA',
  description: 'Manage your pilot profile, settings, and preferences.'
})

const { user } = useAuth()

// Fetch profile data from API
const { data: profileData, refresh: refreshProfile } = await useFetch('/api/pilot/profile')

// Profile settings (reactive, synced with API data)
const settings = ref({
  displayName: '',
  bio: '',
  homeAirport: '',
  timezone: 'UTC',
  notifications: {
    email: true,
    browser: false,
    flightReminders: true,
    eventUpdates: true,
    weeklyDigest: false
  },
  privacy: {
    showEmail: false,
    showFlights: true,
    showStatistics: true,
    showAirlines: true
  }
})

// Sync settings when profile data loads
watch(profileData, (data) => {
  if (data?.pilot) {
    settings.value = {
      displayName: data.pilot.displayName || '',
      bio: data.pilot.bio || '',
      homeAirport: data.pilot.homeAirport || '',
      timezone: data.pilot.timezone || 'UTC',
      notifications: {
        email: data.pilot.notifications?.email ?? true,
        browser: data.pilot.notifications?.browser ?? false,
        flightReminders: data.pilot.notifications?.flightReminders ?? true,
        eventUpdates: data.pilot.notifications?.eventUpdates ?? true,
        weeklyDigest: data.pilot.notifications?.weeklyDigest ?? false
      },
      privacy: {
        showEmail: data.pilot.privacy?.showEmail ?? false,
        showFlights: data.pilot.privacy?.showFlights ?? true,
        showStatistics: data.pilot.privacy?.showStatistics ?? true,
        showAirlines: data.pilot.privacy?.showAirlines ?? true
      }
    }
  }
}, { immediate: true })

// Pilot stats from API
const pilotStats = computed(() => ({
  totalFlights: profileData.value?.pilot?.stats?.totalFlights || 0,
  totalHours: profileData.value?.pilot?.stats?.totalHours || 0,
  totalDistance: profileData.value?.pilot?.stats?.totalDistance || 0,
  memberSince: profileData.value?.pilot?.createdAt?.split('T')[0] || '',
  landings: 0,
  averageLandingRate: 0,
  favoriteAircraft: '-',
  favoriteRoute: '-',
  lastFlight: '-'
}))

// Timezones for select
const timezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Europe/Berlin (CET)', value: 'Europe/Berlin' },
  { label: 'Europe/London (GMT)', value: 'Europe/London' },
  { label: 'America/New_York (EST)', value: 'America/New_York' },
  { label: 'America/Los_Angeles (PST)', value: 'America/Los_Angeles' },
  { label: 'Asia/Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Australia/Sydney (AEST)', value: 'Australia/Sydney' }
]

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'i-lucide-user' },
  { id: 'settings', label: 'Settings', icon: 'i-lucide-settings' },
  { id: 'notifications', label: 'Notifications', icon: 'i-lucide-bell' },
  { id: 'privacy', label: 'Privacy', icon: 'i-lucide-shield' }
]

const isSaving = ref(false)

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getRatingColor(rating: string): string {
  const ratingColors: Record<string, string> = {
    'OBS': 'text-gray-500',
    'S1': 'text-emerald-500',
    'S2': 'text-emerald-600',
    'S3': 'text-sky-500',
    'C1': 'text-sky-600',
    'C3': 'text-purple-500',
    'I1': 'text-purple-600',
    'I3': 'text-amber-500',
    'SUP': 'text-rose-500',
    'ADM': 'text-rose-600'
  }
  return ratingColors[rating] || 'text-gray-500'
}

async function saveSettings() {
  isSaving.value = true
  try {
    await $fetch('/api/pilot/profile', {
      method: 'PUT',
      body: settings.value
    })
    await refreshProfile()
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    isSaving.value = false
  }
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

      <UContainer class="relative pt-12 pb-12">
        <span class="inline-block font-mono text-sm text-sky-600 dark:text-sky-400 mb-4 tracking-wider">// PROFILE</span>

        <!-- Profile Header -->
        <div class="flex flex-col md:flex-row md:items-start gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-28 h-28 rounded-2xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 border-2 border-sky-500/30 flex items-center justify-center">
              <span class="font-display text-4xl font-bold text-sky-600 dark:text-sky-400">
                {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
              </span>
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
            </div>
          </div>

          <!-- User Info -->
          <div class="flex-1">
            <h1 class="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ user?.fullName || 'Loading...' }}
            </h1>
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <span class="font-mono text-sky-600 dark:text-sky-400">CID: {{ user?.cid }}</span>
              <span class="text-gray-300 dark:text-slate-700">|</span>
              <span :class="getRatingColor(user?.rating || '')" class="font-medium">{{ user?.rating || 'N/A' }}</span>
              <span class="text-gray-300 dark:text-slate-700">|</span>
              <span class="text-gray-600 dark:text-slate-400">{{ user?.division }}</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <UIcon name="i-lucide-map-pin" class="w-3 h-3 inline mr-1" />
                {{ user?.country }}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <UIcon name="i-lucide-award" class="w-3 h-3 inline mr-1" />
                Pilot Rating: {{ user?.pilotRating || 'P0' }}
              </span>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-3">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotStats.totalFlights }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Flights</div>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotStats.totalHours }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Hours</div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Tabs Navigation -->
    <section class="border-b border-gray-200 dark:border-white/5 sticky top-16 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <UContainer>
        <div class="flex gap-1 overflow-x-auto py-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            :class="activeTab === tab.id
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5'"
          >
            <UIcon :name="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="py-12">
      <UContainer>
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="grid lg:grid-cols-3 gap-8">
          <!-- Stats Grid -->
          <div class="lg:col-span-2 space-y-8">
            <div>
              <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Flight Statistics</h2>
              <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                  <UIcon name="i-lucide-plane" class="w-6 h-6 text-sky-500 mb-3" />
                  <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotStats.totalFlights }}</div>
                  <div class="text-sm text-gray-500 dark:text-slate-500">Total Flights</div>
                </div>
                <div class="p-5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                  <UIcon name="i-lucide-clock" class="w-6 h-6 text-emerald-500 mb-3" />
                  <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotStats.totalHours }}h</div>
                  <div class="text-sm text-gray-500 dark:text-slate-500">Flight Hours</div>
                </div>
                <div class="p-5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                  <UIcon name="i-lucide-navigation" class="w-6 h-6 text-amber-500 mb-3" />
                  <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(pilotStats.totalDistance) }}</div>
                  <div class="text-sm text-gray-500 dark:text-slate-500">NM Flown</div>
                </div>
                <div class="p-5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                  <UIcon name="i-lucide-plane-landing" class="w-6 h-6 text-purple-500 mb-3" />
                  <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotStats.averageLandingRate || '-' }}</div>
                  <div class="text-sm text-gray-500 dark:text-slate-500">Avg Landing (fpm)</div>
                </div>
              </div>
            </div>

            <!-- VATSIM Information -->
            <div>
              <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">VATSIM Information</h2>
              <div class="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                <div class="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">VATSIM CID</label>
                    <p class="font-mono text-lg text-gray-900 dark:text-white mt-1">{{ user?.cid }}</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Controller Rating</label>
                    <p class="text-lg text-gray-900 dark:text-white mt-1" :class="getRatingColor(user?.rating || '')">{{ user?.rating || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Pilot Rating</label>
                    <p class="text-lg text-gray-900 dark:text-white mt-1">{{ user?.pilotRating || 'P0' }}</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Division</label>
                    <p class="text-lg text-gray-900 dark:text-white mt-1">{{ user?.division }}</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Email</label>
                    <p class="text-lg text-gray-900 dark:text-white mt-1">{{ user?.email }}</p>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Country</label>
                    <p class="text-lg text-gray-900 dark:text-white mt-1">{{ user?.country }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <div class="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
              <h3 class="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Details</h3>
              <div class="space-y-4">
                <div>
                  <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Member Since</label>
                  <p class="text-gray-900 dark:text-white mt-1">{{ formatDate(pilotStats.memberSince) }}</p>
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Home Airport</label>
                  <p class="text-gray-900 dark:text-white mt-1">{{ profileData?.pilot?.homeAirport || '-' }}</p>
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">Timezone</label>
                  <p class="text-gray-900 dark:text-white mt-1">{{ profileData?.pilot?.timezone || 'UTC' }}</p>
                </div>
              </div>
            </div>

            <NuxtLink to="/career">
              <div class="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-sky-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                <div class="flex items-center gap-3 mb-3">
                  <UIcon name="i-lucide-trophy" class="w-6 h-6 text-purple-500" />
                  <h3 class="font-display text-lg font-semibold text-gray-900 dark:text-white">Career Progress</h3>
                </div>
                <p class="text-sm text-gray-600 dark:text-slate-400 mb-3">View your rank progression, achievements, and career milestones.</p>
                <span class="text-sm text-purple-600 dark:text-purple-400 font-medium">View Career →</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="max-w-2xl">
          <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>

          <div class="space-y-6">
            <div class="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Display Name</label>
                <UInput v-model="settings.displayName" :placeholder="user?.fullName || 'Your display name'" size="lg" />
                <p class="text-xs text-gray-500 dark:text-slate-500 mt-1">This name will be shown to other pilots</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Bio</label>
                <UTextarea v-model="settings.bio" placeholder="Tell us about yourself..." rows="3" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Home Airport</label>
                <UInput v-model="settings.homeAirport" placeholder="ICAO code (e.g. EDDF)" maxlength="4" class="uppercase" size="lg" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">Timezone</label>
                <USelect v-model="settings.timezone" :items="timezones" size="lg" />
              </div>
            </div>

            <UButton @click="saveSettings" size="lg" :loading="isSaving">
              <UIcon name="i-lucide-save" class="w-4 h-4 mr-2" />
              Save Changes
            </UButton>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="max-w-2xl">
          <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Receive important updates via email</p>
              </div>
              <UCheckbox v-model="settings.notifications.email" />
            </div>

            <div class="border-t border-gray-200 dark:border-white/5" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Browser Notifications</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Get notified in your browser</p>
              </div>
              <UCheckbox v-model="settings.notifications.browser" />
            </div>

            <div class="border-t border-gray-200 dark:border-white/5" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Flight Reminders</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Remind me before booked flights</p>
              </div>
              <UCheckbox v-model="settings.notifications.flightReminders" />
            </div>

            <div class="border-t border-gray-200 dark:border-white/5" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Event Updates</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Get notified about community events</p>
              </div>
              <UCheckbox v-model="settings.notifications.eventUpdates" />
            </div>

            <div class="border-t border-gray-200 dark:border-white/5" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Weekly summary of your flying activity</p>
              </div>
              <UCheckbox v-model="settings.notifications.weeklyDigest" />
            </div>
          </div>

          <UButton @click="saveSettings" size="lg" class="mt-6" :loading="isSaving">
            <UIcon name="i-lucide-save" class="w-4 h-4 mr-2" />
            Save Preferences
          </UButton>
        </div>

        <!-- Privacy Tab -->
        <div v-if="activeTab === 'privacy'" class="max-w-2xl">
          <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>

          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Show Email Address</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Allow other pilots to see your email</p>
              </div>
              <UCheckbox v-model="settings.privacy.showEmail" />
            </div>

            <div class="border-t border-gray-200 dark:border-white/5" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Public Flight Log</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Show your flight history to others</p>
              </div>
              <UCheckbox v-model="settings.privacy.showFlights" />
            </div>

            <div class="border-t border-gray-200 dark:border-white/5" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Public Statistics</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Display your stats on leaderboards</p>
              </div>
              <UCheckbox v-model="settings.privacy.showStatistics" />
            </div>

            <div class="border-t border-gray-200 dark:border-white/5" />

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Show Airline Memberships</p>
                <p class="text-sm text-gray-500 dark:text-slate-500">Display your VA memberships publicly</p>
              </div>
              <UCheckbox v-model="settings.privacy.showAirlines" />
            </div>
          </div>

          <UButton @click="saveSettings" size="lg" class="mt-6" :loading="isSaving">
            <UIcon name="i-lucide-save" class="w-4 h-4 mr-2" />
            Save Privacy Settings
          </UButton>

          <div class="mt-8 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <h3 class="font-display text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">Danger Zone</h3>
            <p class="text-sm text-gray-600 dark:text-slate-400 mb-4">Permanently delete your account and all associated data.</p>
            <UButton variant="outline" color="error">
              <UIcon name="i-lucide-trash-2" class="w-4 h-4 mr-2" />
              Delete Account
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
