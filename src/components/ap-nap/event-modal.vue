<template>
  <Transition name="modal">
    <div v-if="event" class="event-modal__backdrop">
      <div class="event-modal__box">
        <!-- 头部 -->
        <div class="event-modal__header">
          <span class="event-modal__source">{{ lang === 'en' ? (enEvent?.source ?? event.source) : event.source }}</span>
          <div class="event-modal__countdown" :class="{ 'event-modal__countdown--urgent': decisionTimeLeft <= 3 }">
            {{ decisionTimeLeft }}s
          </div>
        </div>

        <h3 class="event-modal__title">{{ lang === 'en' ? (enEvent?.title ?? event.title) : event.title }}</h3>

        <!-- 倒计时进度条 -->
        <div class="event-modal__timer-track">
          <div
            class="event-modal__timer-fill"
            :class="{ 'event-modal__timer-fill--urgent': decisionTimeLeft <= 2 }"
            :style="{ width: `${(decisionTimeLeft / 8) * 100}%` }"
          />
        </div>

        <!-- 事件正文 -->
        <p class="event-modal__body">{{ lang === 'en' ? (enEvent?.body ?? event.body) : event.body }}</p>

        <!-- 立绘插槽 -->
        <slot name="portrait" />

        <!-- 选项 -->
        <div class="event-modal__options">
          <button
            v-for="(option, i) in event.options"
            :key="i"
            class="event-modal__option"
            :class="`event-modal__option--${['a', 'b', 'c'][i]}`"
            @click="$emit('choose', i as 0 | 1 | 2)"
          >
            <span class="event-modal__option-tag">{{ ['A', 'B', 'C'][i] }}</span>
            <span class="event-modal__option-label">{{ lang === 'en' ? (enEvent?.options[i]?.label ?? option.label) : option.label }}</span>
          </button>
        </div>

        <p class="event-modal__hint">{{ lang === 'en' ? 'Auto-selects C on timeout' : '超时自动选 C' }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InterruptEvent } from '@/contents/game-data'
import { EVENT_LOCALE_EN } from '@/contents/game-data'
import { useLocale } from '@/composables'

const props = defineProps<{
  event: InterruptEvent | null
  decisionTimeLeft: number
}>()

defineEmits<{
  choose: [index: 0 | 1 | 2]
}>()

const { lang } = useLocale()
const enEvent = computed(() => props.event ? EVENT_LOCALE_EN[props.event.id] : null)
</script>

<style lang="css" scoped>
@reference "@/style.css";

.event-modal__backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-overlay-scrim/70 backdrop-blur-sm;
}

.event-modal__box {
  @apply mx-4 w-full max-w-lg rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-2xl;
  animation: modal-pop 0.25s ease;
}

.event-modal__header {
  @apply mb-2 flex items-center justify-between gap-2;
}

.event-modal__source {
  @apply text-sm font-semibold text-text-secondary;
}

.event-modal__title {
  @apply mb-3 text-lg font-bold text-text-primary;
}

.event-modal__countdown {
  @apply min-w-[2rem] rounded-lg bg-bg-overlay px-2 py-1 text-center font-mono text-lg font-bold text-accent;
  transition: color 0.3s, background 0.3s;
}

.event-modal__countdown--urgent {
  @apply bg-danger/20 text-danger-light animate-pulse;
}

.event-modal__timer-track {
  @apply mb-4 h-1 overflow-hidden rounded-full bg-bg-overlay;
}

.event-modal__timer-fill {
  @apply h-full bg-accent transition-all duration-1000;
}

.event-modal__timer-fill--urgent {
  @apply bg-danger;
}

.event-modal__body {
  @apply mb-4 rounded-lg bg-bg-overlay/60 p-3 text-sm leading-relaxed text-text-secondary;
}

.event-modal__options {
  @apply flex flex-col gap-2;
}

.event-modal__option {
  @apply flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-overlay/40 px-4 py-3
         text-left transition hover:border-accent/50 hover:bg-bg-overlay;
}

.event-modal__option--a:hover { @apply border-success/50 bg-success/5; }
.event-modal__option--b:hover { @apply border-danger/50 bg-danger/5; }
.event-modal__option--c:hover { @apply border-accent/50 bg-accent/5; }

.event-modal__option-tag {
  @apply flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg-surface text-xs font-bold text-text-primary;
}

.event-modal__option--a .event-modal__option-tag { @apply bg-success/20 text-success-light; }
.event-modal__option--b .event-modal__option-tag { @apply bg-danger/20 text-danger-light; }
.event-modal__option--c .event-modal__option-tag { @apply bg-accent/20 text-accent-light; }

.event-modal__option-label {
  @apply text-sm text-text-primary;
}

.event-modal__hint {
  @apply mt-3 text-center text-xs text-text-muted;
}

@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.modal-enter-active { transition: opacity 0.2s, transform 0.2s; }
.modal-leave-active { transition: opacity 0.15s, transform 0.15s; }
.modal-enter-from   { opacity: 0; transform: scale(0.95); }
.modal-leave-to     { opacity: 0; transform: scale(0.97); }
</style>
