<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'VATSIM VA - Virtual Airlines Platform'
const description = 'Discover virtual airlines on VATSIM. Find your community, fly realistic routes and become part of an active pilot community.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

// Auth
const { user, isAuthenticated, isLoading, login, logout } = useAuth()

// User dropdown menu
const userDropdown = computed(() => [
  [
    {
      label: user.value?.fullName || 'User',
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'My Profile',
      icon: 'i-lucide-user',
      to: '/profile'
    },
    {
      label: 'My Airlines',
      icon: 'i-lucide-building-2',
      to: '/my-airline'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: () => logout()
    }
  ]
])

// User initials for avatar
const userInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`
})

// Navigation with dropdowns
const flyDropdown = [
  [
    {
      label: 'Routes & Dispatch',
      icon: 'i-lucide-route',
      to: '/routes'
    },
    {
      label: 'Events',
      icon: 'i-lucide-calendar',
      to: '/events'
    }
  ]
]

// Mobile menu
const mobileMenuOpen = ref(false)

const mobileNavLinks = [
  { label: 'Airlines', to: '/airlines', icon: 'i-lucide-building-2' },
  { label: 'Routes & Dispatch', to: '/routes', icon: 'i-lucide-route' },
  { label: 'Events', to: '/events', icon: 'i-lucide-calendar' },
  { label: 'Statistics', to: '/statistics', icon: 'i-lucide-bar-chart-3' }
]

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <UApp>
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-saturate-150 backdrop-blur-sm">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <AppLogo />
          </NuxtLink>

          <!-- Center Nav -->
          <nav class="hidden md:flex items-center gap-1">
            <!-- Airlines Link -->
            <NuxtLink
              to="/airlines"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Airlines
            </NuxtLink>

            <!-- Fly Dropdown -->
            <UDropdownMenu
              :items="flyDropdown"
              :popper="{ placement: 'bottom-start' }"
              :modal="false"
              :ui="{
                content: 'min-w-52 p-2',
                item: 'px-3 py-2.5 text-sm gap-3',
                itemLeadingIcon: 'w-5 h-5'
              }"
            >
              <button class="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                Fly
                <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
              </button>
            </UDropdownMenu>

            <!-- Statistics Link -->
            <NuxtLink
              to="/statistics"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Statistics
            </NuxtLink>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <UColorModeButton />

            <!-- Loading State -->
            <div v-if="isLoading" class="hidden sm:flex">
              <USkeleton class="w-28 h-9 rounded-lg" />
            </div>

            <!-- Authenticated: User Dropdown -->
            <UDropdownMenu
              v-else-if="isAuthenticated"
              :items="userDropdown"
              :popper="{ placement: 'bottom-end' }"
              :modal="false"
              :ui="{
                content: 'min-w-48 p-2',
                item: 'px-3 py-2.5 text-sm gap-3',
                itemLeadingIcon: 'w-5 h-5'
              }"
              class="hidden sm:block"
            >
              <button style="display: flex; flex-direction: row; align-items: center; gap: 0.5rem;" class="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                <div style="width: 32px; height: 32px; flex-shrink: 0;" class="rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-semibold">
                  {{ userInitials }}
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-slate-300">{{ user?.firstName }}</span>
                <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-gray-500 dark:text-slate-400" />
              </button>
            </UDropdownMenu>

            <!-- Not Authenticated: Login Button -->
            <UButton
              v-else
              label="VATSIM Login"
              icon="i-lucide-log-in"
              color="primary"
              variant="solid"
              class="font-medium hidden sm:flex"
              @click="login"
            />

            <!-- Mobile Menu Button -->
            <button
              class="md:hidden w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <UIcon :name="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="w-5 h-5 text-gray-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div
          v-show="mobileMenuOpen"
          class="md:hidden border-t border-gray-200 dark:border-white/5 py-4"
        >
          <nav class="flex flex-col gap-1">
            <NuxtLink
              v-for="link in mobileNavLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              @click="mobileMenuOpen = false"
            >
              <UIcon :name="link.icon" class="w-5 h-5" />
              {{ link.label }}
            </NuxtLink>
          </nav>
          <div class="mt-4 px-4">
            <!-- Mobile: Loading State -->
            <USkeleton v-if="isLoading" class="w-full h-10 rounded-lg" />

            <!-- Mobile: Authenticated -->
            <div v-else-if="isAuthenticated" class="space-y-3">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-white/5">
                <div class="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold">
                  {{ userInitials }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ user?.fullName }}</p>
                  <p class="text-sm text-gray-500 dark:text-slate-400">CID: {{ user?.cid }}</p>
                </div>
              </div>
              <UButton
                label="Logout"
                icon="i-lucide-log-out"
                color="neutral"
                variant="soft"
                class="w-full font-medium"
                @click="logout"
              />
            </div>

            <!-- Mobile: Not Authenticated -->
            <UButton
              v-else
              label="VATSIM Login"
              icon="i-lucide-log-in"
              color="primary"
              variant="solid"
              class="w-full font-medium"
              @click="login"
            />
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Spacer for fixed header -->
    <div class="h-16" />

    <UMain class="min-h-screen">
      <NuxtPage />
    </UMain>

    <!-- Footer -->
    <footer class="relative border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-slate-950">
      <!-- Subtle grid pattern -->
      <div class="absolute inset-0 aviation-grid" />

      <UContainer class="relative py-16">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
          <!-- Brand Column -->
          <div class="md:col-span-4">
            <AppLogo class="mb-6" />
            <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              The central platform for virtual airlines on the VATSIM network. Connect with pilots worldwide.
            </p>

            <!-- Social Links -->
            <div class="flex items-center gap-2 mt-6">
              <a
                href="https://discord.com"
                target="_blank"
                class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-sky-100 dark:hover:bg-sky-500/20 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
              >
                <UIcon name="i-simple-icons-discord" class="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-sky-100 dark:hover:bg-sky-500/20 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
              >
                <UIcon name="i-simple-icons-github" class="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-sky-100 dark:hover:bg-sky-500/20 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
              >
                <UIcon name="i-simple-icons-x" class="w-5 h-5" />
              </a>
            </div>
          </div>

          <!-- Links Columns -->
          <div class="md:col-span-2">
            <h4 class="font-display font-semibold text-gray-900 dark:text-white mb-4 text-sm tracking-wide uppercase">Platform</h4>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/airlines" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Discover Airlines
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/events" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Events & Flights
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/statistics" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Statistics
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="md:col-span-2">
            <h4 class="font-display font-semibold text-gray-900 dark:text-white mb-4 text-sm tracking-wide uppercase">Pilots</h4>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/routes" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Routes & Dispatch
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/airlines/register" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Register VA
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="#" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Documentation
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="md:col-span-2">
            <h4 class="font-display font-semibold text-gray-900 dark:text-white mb-4 text-sm tracking-wide uppercase">Legal</h4>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/legal/privacy" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Privacy Policy
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/legal/imprint" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Imprint
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/legal/terms" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Terms of Service
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/legal/cookies" class="text-sm text-gray-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Cookie Policy
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-500 dark:text-slate-500">
            {{ new Date().getFullYear() }} vatsimva.com - Not officially affiliated with VATSIM.
          </p>
          <div class="flex items-center gap-6 text-sm text-gray-500 dark:text-slate-500">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </UContainer>
    </footer>
  </UApp>
</template>
