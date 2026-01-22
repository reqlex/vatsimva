<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'My Airlines - VATSIM VA',
  description: 'Manage your virtual airlines and view your membership status.'
})

const { user } = useAuth()

// Fetch airlines and invitations from API
const { data: airlinesData, refresh: refreshAirlines } = await useFetch('/api/pilot/airlines')
const { data: invitationsData, refresh: refreshInvitations } = await useFetch('/api/pilot/invitations')

// Computed properties for template
const myAirlines = computed(() => airlinesData.value?.airlines || [])
const pendingInvites = computed(() => invitationsData.value?.invitations || [])

// Statistics across all airlines
const totalStats = computed(() => ({
  airlines: myAirlines.value.length,
  flights: myAirlines.value.reduce((sum: number, a: any) => sum + (a.flights || 0), 0),
  hours: myAirlines.value.reduce((sum: number, a: any) => sum + (a.hours || 0), 0)
}))

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getRoleColor(role: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    'owner': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
    'admin': { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
    'staff': { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400' },
    'pilot': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' }
  }
  return colors[role?.toLowerCase()] || colors['pilot']
}

function capitalizeRole(role: string): string {
  if (!role) return 'Pilot'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

async function acceptInvite(inviteId: number) {
  try {
    await $fetch(`/api/pilot/invitations/${inviteId}`, {
      method: 'POST',
      body: { action: 'accept' }
    })
    await refreshInvitations()
    await refreshAirlines()
  } catch (error) {
    console.error('Failed to accept invitation:', error)
  }
}

async function declineInvite(inviteId: number) {
  try {
    await $fetch(`/api/pilot/invitations/${inviteId}`, {
      method: 'POST',
      body: { action: 'decline' }
    })
    await refreshInvitations()
  } catch (error) {
    console.error('Failed to decline invitation:', error)
  }
}

async function leaveAirline(airlineId: number) {
  if (!confirm('Are you sure you want to leave this airline?')) return

  try {
    await $fetch(`/api/pilot/airlines/${airlineId}/leave`, {
      method: 'POST'
    })
    await refreshAirlines()
  } catch (error: any) {
    console.error('Failed to leave airline:', error)
    alert(error.data?.message || 'Failed to leave airline')
  }
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden border-b border-gray-200 dark:border-white/5">
      <div class="absolute inset-0">
        <div class="absolute inset-0 aviation-grid" />
        <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full -translate-y-1/2 -translate-x-1/3" />
      </div>

      <UContainer class="relative pt-12 pb-12">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span class="inline-block font-mono text-sm text-emerald-600 dark:text-emerald-400 mb-4 tracking-wider">// MY AIRLINES</span>
            <h1 class="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Airline Memberships
            </h1>
            <p class="text-gray-600 dark:text-slate-400 max-w-2xl">
              Manage your virtual airline memberships, view statistics, and track your progress across all airlines.
            </p>
          </div>

          <NuxtLink to="/airlines/register">
            <UButton size="lg">
              <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
              Register New Airline
            </UButton>
          </NuxtLink>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-3 gap-4 mt-8 max-w-lg">
          <div class="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ totalStats.airlines }}</div>
            <div class="text-xs text-gray-500 dark:text-slate-500">Airlines</div>
          </div>
          <div class="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ totalStats.flights }}</div>
            <div class="text-xs text-gray-500 dark:text-slate-500">Total Flights</div>
          </div>
          <div class="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
            <div class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ totalStats.hours }}h</div>
            <div class="text-xs text-gray-500 dark:text-slate-500">Total Hours</div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="py-12">
      <UContainer>
        <!-- Pending Invitations -->
        <div v-if="pendingInvites.length > 0" class="mb-10">
          <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-mail" class="w-5 h-5 text-amber-500" />
            Pending Invitations
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {{ pendingInvites.length }}
            </span>
          </h2>

          <div class="space-y-3">
            <div
              v-for="invite in pendingInvites"
              :key="invite.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <span class="font-mono font-bold text-amber-600 dark:text-amber-400">{{ invite.airlineCode }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ invite.airlineName }}</h3>
                  <p class="text-sm text-gray-500 dark:text-slate-500">
                    Invited by {{ invite.invitedBy }} as {{ capitalizeRole(invite.role) }} · {{ formatDate(invite.invitedAt) }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2 sm:shrink-0">
                <UButton @click="acceptInvite(invite.id)" size="sm">
                  Accept
                </UButton>
                <UButton @click="declineInvite(invite.id)" variant="outline" size="sm">
                  Decline
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- My Airlines -->
        <div>
          <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Your Airlines</h2>

          <div v-if="myAirlines.length === 0" class="text-center py-16">
            <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-lucide-building-2" class="w-8 h-8 text-gray-400 dark:text-slate-500" />
            </div>
            <h3 class="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">No Airlines Yet</h3>
            <p class="text-gray-500 dark:text-slate-500 mb-6">Join a virtual airline or register your own to get started.</p>
            <div class="flex justify-center gap-3">
              <NuxtLink to="/airlines">
                <UButton variant="outline">Browse Airlines</UButton>
              </NuxtLink>
              <NuxtLink to="/airlines/register">
                <UButton>Register New Airline</UButton>
              </NuxtLink>
            </div>
          </div>

          <div v-else class="grid md:grid-cols-2 gap-6">
            <div
              v-for="airline in myAirlines"
              :key="airline.id"
              class="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-sky-500/30 transition-all"
            >
              <!-- Header -->
              <div class="flex items-start justify-between mb-5">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/20 flex items-center justify-center shrink-0">
                    <span class="font-mono font-bold text-sky-600 dark:text-sky-400">{{ airline.code }}</span>
                  </div>
                  <div>
                    <h3 class="font-display text-lg font-semibold text-gray-900 dark:text-white">{{ airline.name }}</h3>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="[getRoleColor(airline.role).bg, getRoleColor(airline.role).text]"
                      >
                        {{ capitalizeRole(airline.role) }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-slate-500">{{ airline.rank }}</span>
                    </div>
                  </div>
                </div>
                <UDropdownMenu
                  :items="[
                    [
                      { label: 'View Airline', icon: 'i-lucide-external-link', to: `/airlines/${airline.id}` },
                      { label: 'Dispatch Flight', icon: 'i-lucide-plane-takeoff', to: '/routes' }
                    ],
                    airline.isOwner ? [
                      { label: 'Manage Airline', icon: 'i-lucide-settings', to: `/my-airline/${airline.id}/manage` }
                    ] : [
                      { label: 'Leave Airline', icon: 'i-lucide-log-out', color: 'error', onSelect: () => leaveAirline(airline.id) }
                    ]
                  ]"
                >
                  <UButton variant="ghost" size="sm" icon="i-lucide-more-vertical" />
                </UDropdownMenu>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-3 mb-5">
                <div class="p-3 rounded-lg bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
                  <div class="font-display text-xl font-bold text-gray-900 dark:text-white">{{ airline.flights }}</div>
                  <div class="text-xs text-gray-500 dark:text-slate-500">Flights</div>
                </div>
                <div class="p-3 rounded-lg bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
                  <div class="font-display text-xl font-bold text-gray-900 dark:text-white">{{ airline.hours }}h</div>
                  <div class="text-xs text-gray-500 dark:text-slate-500">Hours</div>
                </div>
                <div class="p-3 rounded-lg bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 text-center">
                  <div class="font-display text-xl font-bold text-gray-900 dark:text-white">{{ airline.hubs?.length || 0 }}</div>
                  <div class="text-xs text-gray-500 dark:text-slate-500">Hubs</div>
                </div>
              </div>

              <!-- Info -->
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-4 text-gray-500 dark:text-slate-500">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                    Joined {{ formatDate(airline.joinDate) }}
                  </span>
                </div>
                <span v-if="airline.lastFlight" class="text-xs text-gray-400 dark:text-slate-600">
                  Last flight: {{ formatDate(airline.lastFlight) }}
                </span>
              </div>

              <!-- Hubs -->
              <div v-if="airline.hubs?.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-slate-500">Hubs:</span>
                  <div class="flex gap-1">
                    <span
                      v-for="hub in airline.hubs"
                      :key="hub"
                      class="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-400"
                    >
                      {{ hub }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Owner Actions -->
              <div v-if="airline.isOwner" class="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
                <NuxtLink :to="`/my-airline/${airline.id}/manage`">
                  <UButton variant="soft" size="sm" class="w-full">
                    <UIcon name="i-lucide-settings" class="w-4 h-4 mr-2" />
                    Manage Airline
                  </UButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Join an Airline CTA -->
        <div class="mt-12 p-8 rounded-2xl bg-gradient-to-br from-sky-500/5 to-emerald-500/5 border border-sky-500/10 text-center">
          <UIcon name="i-lucide-search" class="w-10 h-10 text-sky-500 mx-auto mb-4" />
          <h3 class="font-display text-xl font-semibold text-gray-900 dark:text-white mb-2">Looking for a New Airline?</h3>
          <p class="text-gray-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Browse our directory of virtual airlines and find the perfect community to join.
          </p>
          <NuxtLink to="/airlines">
            <UButton variant="outline" size="lg">
              <UIcon name="i-lucide-building-2" class="w-4 h-4 mr-2" />
              Browse Airlines
            </UButton>
          </NuxtLink>
        </div>
      </UContainer>
    </section>
  </div>
</template>
