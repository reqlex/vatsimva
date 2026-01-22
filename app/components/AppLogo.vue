<template>
  <div class="flex items-center gap-3">
    <!-- Logo Mark - Aviation-inspired geometric design -->
    <div class="relative w-9 h-9">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full"
      >
        <!-- Compass ring -->
        <circle
          cx="18"
          cy="18"
          r="16"
          class="stroke-sky-500/60"
          stroke-width="1.5"
          fill="none"
        />

        <!-- Cardinal markers -->
        <line x1="18" y1="2" x2="18" y2="6" class="stroke-sky-500" stroke-width="2" stroke-linecap="round" />
        <line x1="18" y1="30" x2="18" y2="34" class="stroke-sky-500/40" stroke-width="1" stroke-linecap="round" />
        <line x1="2" y1="18" x2="6" y2="18" class="stroke-sky-500/40" stroke-width="1" stroke-linecap="round" />
        <line x1="30" y1="18" x2="34" y2="18" class="stroke-sky-500/40" stroke-width="1" stroke-linecap="round" />

        <!-- Aircraft symbol -->
        <g transform="translate(18, 18)">
          <!-- Fuselage -->
          <path
            d="M0 -8 L0 6"
            class="stroke-sky-500"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <!-- Wings -->
          <path
            d="M-7 0 L7 0"
            class="stroke-sky-500"
            stroke-width="2"
            stroke-linecap="round"
          />
          <!-- Tail -->
          <path
            d="M-3 5 L3 5"
            class="stroke-sky-500"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <!-- Nose highlight -->
          <circle
            cx="0"
            cy="-8"
            r="1.5"
            class="fill-sky-500"
          />
        </g>
      </svg>
    </div>

    <!-- Wordmark -->
    <div class="flex flex-col">
      <span class="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white leading-none">
        VATSIM<span class="text-sky-500">VA</span>
      </span>
      <span class="text-[10px] font-medium text-gray-400 dark:text-slate-500 tracking-widest uppercase">
        Virtual Airlines
      </span>
    </div>
  </div>
</template>
