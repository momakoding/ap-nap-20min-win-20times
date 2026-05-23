<template>
  <div class="health-actions">
    <h3 class="health-actions__title">{{ lang === 'en' ? '🛋️ Rest Actions' : '🛋️ 午休行动' }}</h3>
    <div class="health-actions__grid">
      <button
        v-for="action in HEALTH_ACTIONS"
        :key="action.id"
        class="health-actions__btn"
        :class="{
          'health-actions__btn--active':    busyAction?.id === action.id,
          'health-actions__btn--disabled':  isBusy && busyAction?.id !== action.id,
          'health-actions__btn--used-once': !isBusy && action.id === streakActionId && streakCount === 1,
          'health-actions__btn--exhausted': action.id === streakActionId && streakCount >= 2,
        }"
        :disabled="isBusy || (action.id === streakActionId && streakCount >= 2)"
        :title="lang === 'en' ? (ACTION_LOCALE_EN[action.id]?.tooltip ?? action.tooltip) : action.tooltip"
        @click="$emit('execute', action)"
      >
        <div class="health-actions__name-row">
          <span class="health-actions__name">{{ lang === 'en' ? (ACTION_LOCALE_EN[action.id]?.name ?? action.name) : action.name }}</span>
          <span v-if="action.id === streakActionId && streakCount === 1" class="health-actions__half-badge">×½</span>
          <span v-if="action.id === streakActionId && streakCount >= 2" class="health-actions__lock-badge">🔒</span>
        </div>
        <span class="health-actions__meta">
          +{{ action.healthGain }} ❤️ &nbsp;·&nbsp;
          <span :class="action.stressDelta < 0 ? 'health-actions__stress--down' : 'health-actions__stress--up'">
            {{ action.stressDelta > 0 ? '+' : '' }}{{ action.stressDelta }} 😤
          </span>
          &nbsp;·&nbsp; {{ action.realSeconds }}s
        </span>
        <!-- 进行中的倒计时条 -->
        <div
          v-if="busyAction?.id === action.id"
          class="health-actions__progress"
        >
          <div
            class="health-actions__progress-fill"
            :style="{ width: `${(busyTimeLeft / action.realSeconds) * 100}%` }"
          />
        </div>
      </button>
    </div>

    <!-- 当前行动反馈（固定高度防止跳动） -->
    <div class="health-actions__feedback-slot">
      <Transition name="fade-up">
        <div v-if="busyAction" class="health-actions__feedback">
          <span class="health-actions__feedback-label">{{ lang === 'en' ? (ACTION_LOCALE_EN[busyAction.id]?.name ?? busyAction.name) : busyAction.name }}</span>
          <span class="health-actions__feedback-timer">{{ busyTimeLeft }}s</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthAction } from '@/contents/game-data'
import { HEALTH_ACTIONS, ACTION_LOCALE_EN } from '@/contents/game-data'
import { useLocale } from '@/composables'

defineProps<{
  isBusy: boolean
  busyAction: HealthAction | null
  busyTimeLeft: number
  streakActionId: string | null
  streakCount: number
}>()

defineEmits<{
  execute: [action: HealthAction]
}>()

const { lang } = useLocale()
</script>

<style lang="css" scoped>
@reference "@/style.css";

.health-actions__title {
  @apply mb-3 text-sm font-semibold text-text-secondary;
}

.health-actions__grid {
  @apply grid grid-cols-2 gap-2 sm:grid-cols-4;
}

.health-actions__btn {
  @apply relative flex flex-col items-start gap-1 overflow-hidden rounded-lg border border-border-subtle
         bg-bg-surface/60 px-3 py-2 text-left transition
         hover:border-accent/50 hover:bg-bg-surface;
}

.health-actions__btn--active {
  @apply border-accent bg-accent/10;
}

.health-actions__btn--disabled {
  @apply cursor-not-allowed opacity-40;
}

.health-actions__name-row {
  @apply flex items-center gap-1.5;
}

.health-actions__name {
  @apply text-sm font-medium text-text-primary;
}

.health-actions__half-badge {
  @apply rounded px-1 text-xs font-bold bg-accent/20 text-accent-light;
}

.health-actions__lock-badge {
  @apply text-xs opacity-60;
}

.health-actions__btn--used-once {
  @apply border-accent/40;
}

.health-actions__btn--exhausted {
  @apply cursor-not-allowed opacity-40;
}

.health-actions__meta {
  @apply text-xs text-text-muted;
}

.health-actions__stress--down {
  @apply text-success-light;
}

.health-actions__stress--up {
  @apply text-danger-light;
}

.health-actions__progress {
  @apply absolute bottom-0 left-0 h-0.5 w-full bg-bg-overlay;
}

.health-actions__progress-fill {
  @apply h-full bg-accent transition-all duration-1000;
}

.health-actions__feedback-slot {
  height: 2.25rem;
  margin-top: 0.5rem;
  position: relative;
}

.health-actions__feedback {
  @apply absolute inset-0 flex items-center justify-between rounded-lg bg-accent/10 px-3 text-sm;
}

.health-actions__feedback-label {
  @apply text-accent-light;
}

.health-actions__feedback-timer {
  @apply font-mono font-bold text-accent;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
