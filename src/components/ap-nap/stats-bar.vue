<template>
  <div class="stats-bar">
    <div class="stats-bar__timer" :class="{ 'stats-bar__timer--urgent': isUrgent }">
      <span class="stats-bar__timer-label">{{ lang === 'en' ? 'Rest Time Left' : '午休剩余' }}</span>
      <span class="stats-bar__timer-value">{{ gameTimeLeft }}</span>
    </div>

    <div class="stats-bar__stats">
      <div class="stats-bar__item">
        <div class="stats-bar__label">
          <span>{{ lang === 'en' ? '❤️ Health' : '❤️ 健康值' }}</span>
          <span class="stats-bar__num" :class="{ 'stats-bar__num--danger': stats.health <= 20 }">
            {{ stats.health }}
          </span>
        </div>
        <div class="stats-bar__track">
          <div
            class="stats-bar__fill stats-bar__fill--health"
            :style="{ width: `${stats.health}%` }"
          />
        </div>
      </div>

      <div class="stats-bar__item">
        <div class="stats-bar__label">
          <span>{{ lang === 'en' ? '🌐 Diplomacy' : '🌐 外交声誉' }}</span>
          <span class="stats-bar__num" :class="{ 'stats-bar__num--danger': stats.diplomacy <= 20 }">
            {{ stats.diplomacy }}
          </span>
        </div>
        <div class="stats-bar__track">
          <div
            class="stats-bar__fill stats-bar__fill--diplomacy"
            :style="{ width: `${stats.diplomacy}%` }"
          />
        </div>
      </div>

      <div class="stats-bar__item">
        <div class="stats-bar__label">
          <span>{{ lang === 'en' ? '😤 Stress' : '😤 压力值' }}</span>
          <span class="stats-bar__num" :class="{ 'stats-bar__num--danger': stats.stress > 70 }">
            {{ stats.stress }}
          </span>
        </div>
        <div class="stats-bar__track">
          <div
            class="stats-bar__fill stats-bar__fill--stress"
            :class="{ 'stats-bar__fill--stress-high': stats.stress > 70 }"
            :style="{ width: `${stats.stress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameStats } from '@/contents/game-data'
import { useLocale } from '@/composables'

const props = defineProps<{
  stats: GameStats
  gameTimeLeft: string
  timeLeft: number
}>()

const { lang } = useLocale()
const isUrgent = computed(() => props.timeLeft <= 30)
</script>

<style lang="css" scoped>
@reference "@/style.css";

.stats-bar {
  @apply flex flex-col gap-3 rounded-xl border border-border-subtle bg-bg-surface/80 p-4 backdrop-blur-sm;
}

.stats-bar__timer {
  @apply flex items-center justify-between rounded-lg bg-bg-overlay px-4 py-2;
  transition: background 0.3s;
}

.stats-bar__timer--urgent {
  @apply animate-pulse bg-danger/20;
}

.stats-bar__timer-label {
  @apply text-sm text-text-secondary;
}

.stats-bar__timer-value {
  @apply font-mono text-2xl font-bold text-accent-light;
}

.stats-bar__timer--urgent .stats-bar__timer-value {
  @apply text-danger-light;
}

.stats-bar__stats {
  @apply flex flex-col gap-2;
}

.stats-bar__item {
  @apply flex flex-col gap-1;
}

.stats-bar__label {
  @apply flex items-center justify-between text-sm text-text-secondary;
}

.stats-bar__num {
  @apply font-mono font-bold text-text-primary;
}

.stats-bar__num--danger {
  @apply text-danger-light;
}

.stats-bar__track {
  @apply h-2 overflow-hidden rounded-full bg-bg-overlay;
}

.stats-bar__fill {
  @apply h-full rounded-full transition-all duration-500;
}

.stats-bar__fill--health {
  @apply bg-success;
}

.stats-bar__fill--diplomacy {
  @apply bg-accent;
}

.stats-bar__fill--stress {
  @apply bg-text-muted;
  transition: width 0.5s, background 0.3s;
}

.stats-bar__fill--stress-high {
  @apply bg-danger animate-pulse;
}
</style>
