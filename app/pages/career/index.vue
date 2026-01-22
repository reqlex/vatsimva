<script setup lang="ts">
useSeoMeta({
  title: 'Career System - VATSIM VA',
  description: 'Progress through ranks, earn badges, and build your virtual aviation career on VATSIM.'
})

// Pilot Career Data (would come from user session/API)
const pilotData = ref({
  name: 'MaxAviation',
  rank: 'Senior First Officer',
  rankLevel: 4,
  airline: 'Lufthansa Virtual',
  airlineCode: 'DLH',
  totalFlights: 247,
  totalHours: 612,
  totalDistance: 487234,
  joinDate: '2024-03-15',
  currentXP: 7850,
  nextRankXP: 10000,
  rating: 4.87
})

// Rank System
const ranks = ref([
  { level: 1, name: 'Student Pilot', minHours: 0, minFlights: 0, icon: 'i-lucide-graduation-cap', color: 'gray' },
  { level: 2, name: 'Private Pilot', minHours: 25, minFlights: 10, icon: 'i-lucide-plane', color: 'emerald' },
  { level: 3, name: 'Second Officer', minHours: 100, minFlights: 40, icon: 'i-lucide-badge', color: 'sky' },
  { level: 4, name: 'Senior First Officer', minHours: 500, minFlights: 150, icon: 'i-lucide-shield', color: 'sky' },
  { level: 5, name: 'First Officer', minHours: 1000, minFlights: 300, icon: 'i-lucide-shield-check', color: 'amber' },
  { level: 6, name: 'Captain', minHours: 2500, minFlights: 600, icon: 'i-lucide-crown', color: 'amber' },
  { level: 7, name: 'Senior Captain', minHours: 5000, minFlights: 1000, icon: 'i-lucide-star', color: 'purple' },
  { level: 8, name: 'Chief Pilot', minHours: 10000, minFlights: 2000, icon: 'i-lucide-award', color: 'rose' }
])

// Achievements/Badges
const achievements = ref([
  { id: 1, name: 'First Flight', description: 'Complete your first flight', icon: 'i-lucide-plane-takeoff', earned: true, earnedDate: '2024-03-15', rarity: 'common' },
  { id: 2, name: 'Night Owl', description: 'Complete 10 night flights', icon: 'i-lucide-moon', earned: true, earnedDate: '2024-05-22', rarity: 'common' },
  { id: 3, name: 'Transatlantic', description: 'Cross the Atlantic Ocean', icon: 'i-lucide-globe', earned: true, earnedDate: '2024-04-10', rarity: 'uncommon' },
  { id: 4, name: 'Century Club', description: 'Complete 100 flights', icon: 'i-lucide-trophy', earned: true, earnedDate: '2024-08-15', rarity: 'uncommon' },
  { id: 5, name: 'Long Hauler', description: 'Complete a flight over 12 hours', icon: 'i-lucide-clock', earned: true, earnedDate: '2024-06-30', rarity: 'rare' },
  { id: 6, name: 'Perfect Landing', description: 'Achieve a butter landing under 50fpm', icon: 'i-lucide-target', earned: true, earnedDate: '2024-07-12', rarity: 'rare' },
  { id: 7, name: 'Globe Trotter', description: 'Visit 50 different airports', icon: 'i-lucide-map', earned: false, progress: 42, target: 50, rarity: 'rare' },
  { id: 8, name: 'Fleet Master', description: 'Fly 10 different aircraft types', icon: 'i-lucide-layers', earned: true, earnedDate: '2024-09-01', rarity: 'uncommon' },
  { id: 9, name: 'Event Champion', description: 'Participate in 25 community events', icon: 'i-lucide-calendar-check', earned: false, progress: 18, target: 25, rarity: 'epic' },
  { id: 10, name: 'Mentor', description: 'Help 10 new pilots get started', icon: 'i-lucide-users', earned: false, progress: 3, target: 10, rarity: 'epic' },
  { id: 11, name: 'Iron Pilot', description: 'Fly every day for 30 days', icon: 'i-lucide-flame', earned: false, progress: 12, target: 30, rarity: 'legendary' },
  { id: 12, name: 'Million Miler', description: 'Fly 1,000,000 nautical miles', icon: 'i-lucide-zap', earned: false, progress: 487234, target: 1000000, rarity: 'legendary' }
])

// Recent Flights
const recentFlights = ref([
  { id: 1, date: '2026-01-18', flight: 'DLH456', route: 'EDDF → KJFK', aircraft: 'A350-900', duration: '8h 45m', distance: 3456, xp: 175 },
  { id: 2, date: '2026-01-16', flight: 'DLH789', route: 'EDDM → LEMD', aircraft: 'A320neo', duration: '2h 15m', distance: 876, xp: 45 },
  { id: 3, date: '2026-01-14', flight: 'DLH123', route: 'EDDF → EGLL', aircraft: 'A320neo', duration: '1h 25m', distance: 398, xp: 30 },
  { id: 4, date: '2026-01-12', flight: 'DLH654', route: 'EDDF → LFPG', aircraft: 'A319', duration: '1h 05m', distance: 262, xp: 25 },
  { id: 5, date: '2026-01-10', flight: 'DLH321', route: 'EDDF → LIRF', aircraft: 'A321', duration: '1h 40m', distance: 524, xp: 35 }
])

const currentRank = computed(() => ranks.value.find(r => r.level === pilotData.value.rankLevel))
const nextRank = computed(() => ranks.value.find(r => r.level === pilotData.value.rankLevel + 1))

const progressToNextRank = computed(() => {
  return Math.round((pilotData.value.currentXP / pilotData.value.nextRankXP) * 100)
})

const earnedAchievements = computed(() => achievements.value.filter(a => a.earned))
const inProgressAchievements = computed(() => achievements.value.filter(a => !a.earned))

function getRarityColor(rarity: string) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    common: { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-500/20' },
    uncommon: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
    rare: { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/20' },
    epic: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' },
    legendary: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' }
  }
  return colors[rarity] || colors.common
}

function getRankColor(color: string) {
  const colors: Record<string, string> = {
    gray: 'text-gray-500',
    emerald: 'text-emerald-500',
    sky: 'text-sky-500',
    amber: 'text-amber-500',
    purple: 'text-purple-500',
    rose: 'text-rose-500'
  }
  return colors[color] || colors.gray
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Hero Section with Pilot Card -->
    <section class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div class="absolute inset-0">
        <div class="absolute inset-0 aviation-grid" />
        <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full -translate-y-1/2 -translate-x-1/3" />
      </div>

      <UContainer class="relative pt-12 pb-12">
        <span class="inline-block font-mono text-sm text-purple-600 dark:text-purple-400 mb-4 tracking-wider">// CAREER</span>

        <!-- Pilot Card -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Info -->
          <div class="lg:col-span-2">
            <div class="flex items-start gap-6">
              <!-- Avatar/Rank Badge -->
              <div class="relative">
                <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-sky-500/20 border-2 border-purple-500/30 flex items-center justify-center">
                  <UIcon :name="currentRank?.icon || 'i-lucide-user'" :class="getRankColor(currentRank?.color || 'gray')" class="w-12 h-12" />
                </div>
                <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {{ pilotData.rankLevel }}
                </div>
              </div>

              <!-- Pilot Info -->
              <div class="flex-1">
                <h1 class="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {{ pilotData.name }}
                </h1>
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-lg text-purple-600 dark:text-purple-400 font-medium">{{ pilotData.rank }}</span>
                  <span class="text-gray-300 dark:text-slate-700">|</span>
                  <span class="text-gray-600 dark:text-slate-400">{{ pilotData.airline }}</span>
                </div>

                <!-- XP Progress -->
                <div class="max-w-md">
                  <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-gray-600 dark:text-slate-400">Progress to {{ nextRank?.name || 'Max Rank' }}</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ pilotData.currentXP.toLocaleString() }} / {{ pilotData.nextRankXP.toLocaleString() }} XP</span>
                  </div>
                  <div class="h-3 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-purple-500 to-sky-500 transition-all duration-500"
                      :style="{ width: `${progressToNextRank}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
              <UIcon name="i-lucide-plane" class="w-5 h-5 text-sky-500 mb-2" />
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotData.totalFlights }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Flights</div>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-emerald-500 mb-2" />
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotData.totalHours }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Hours</div>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
              <UIcon name="i-lucide-navigation" class="w-5 h-5 text-amber-500 mb-2" />
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(pilotData.totalDistance) }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">NM Flown</div>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
              <UIcon name="i-lucide-star" class="w-5 h-5 text-purple-500 mb-2" />
              <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ pilotData.rating }}</div>
              <div class="text-xs text-gray-500 dark:text-slate-500">Rating</div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Rank Progression -->
    <section class="py-12 bg-gray-50 dark:bg-slate-900/50">
      <UContainer>
        <h2 class="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">Rank Progression</h2>

        <div class="relative">
          <!-- Progress Line -->
          <div class="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-white/5 rounded-full">
            <div
              class="h-full rounded-full bg-gradient-to-r from-purple-500 to-sky-500"
              :style="{ width: `${((pilotData.rankLevel - 1) / (ranks.length - 1)) * 100}%` }"
            />
          </div>

          <!-- Rank Nodes -->
          <div class="relative grid grid-cols-4 lg:grid-cols-8 gap-4">
            <div
              v-for="rank in ranks"
              :key="rank.level"
              class="flex flex-col items-center"
            >
              <div
                class="w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all"
                :class="[
                  pilotData.rankLevel >= rank.level
                    ? 'bg-gradient-to-br from-purple-500/20 to-sky-500/20 border-2 border-purple-500/30'
                    : 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5'
                ]"
              >
                <UIcon
                  :name="rank.icon"
                  class="w-8 h-8"
                  :class="pilotData.rankLevel >= rank.level ? getRankColor(rank.color) : 'text-gray-300 dark:text-slate-600'"
                />
              </div>
              <span
                class="text-xs font-medium text-center"
                :class="pilotData.rankLevel >= rank.level ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'"
              >
                {{ rank.name }}
              </span>
              <span class="text-xs text-gray-400 dark:text-slate-500 mt-1">{{ rank.minHours }}h</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="py-12">
      <UContainer>
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Achievements -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Earned Achievements -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
                <span class="text-sm text-gray-500 dark:text-slate-500">{{ earnedAchievements.length }}/{{ achievements.length }} earned</span>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div
                  v-for="achievement in earnedAchievements"
                  :key="achievement.id"
                  class="flex items-start gap-4 p-4 rounded-xl border"
                  :class="[getRarityColor(achievement.rarity).bg, getRarityColor(achievement.rarity).border]"
                >
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    :class="getRarityColor(achievement.rarity).bg"
                  >
                    <UIcon :name="achievement.icon" class="w-6 h-6" :class="getRarityColor(achievement.rarity).text" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ achievement.name }}</span>
                      <span class="text-xs px-1.5 py-0.5 rounded capitalize" :class="[getRarityColor(achievement.rarity).bg, getRarityColor(achievement.rarity).text]">
                        {{ achievement.rarity }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-slate-500 mt-1">{{ achievement.description }}</p>
                    <p class="text-xs text-gray-400 dark:text-slate-600 mt-2">Earned {{ achievement.earnedDate }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- In Progress -->
            <div>
              <h3 class="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">In Progress</h3>

              <div class="space-y-3">
                <div
                  v-for="achievement in inProgressAchievements"
                  :key="achievement.id"
                  class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5"
                >
                  <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <UIcon :name="achievement.icon" class="w-5 h-5 text-gray-400 dark:text-slate-500" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-medium text-gray-900 dark:text-white text-sm">{{ achievement.name }}</span>
                      <span class="text-xs text-gray-500 dark:text-slate-500">{{ achievement.progress }}/{{ achievement.target }}</span>
                    </div>
                    <div class="h-1.5 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                      <div
                        class="h-full rounded-full bg-sky-500 transition-all"
                        :style="{ width: `${(achievement.progress! / achievement.target!) * 100}%` }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Flights -->
          <div>
            <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Flights</h2>

            <div class="space-y-3">
              <div
                v-for="flight in recentFlights"
                :key="flight.id"
                class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono font-medium text-gray-900 dark:text-white">{{ flight.flight }}</span>
                  <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+{{ flight.xp }} XP</span>
                </div>
                <div class="text-sm text-gray-600 dark:text-slate-400 mb-2">{{ flight.route }}</div>
                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                  <span>{{ flight.aircraft }}</span>
                  <span>{{ flight.duration }}</span>
                  <span>{{ flight.distance }} NM</span>
                </div>
              </div>
            </div>

            <UButton variant="outline" class="w-full mt-4">
              View All Flights
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
