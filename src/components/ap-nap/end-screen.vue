<template>
  <div class="end-screen">
    <div class="end-screen__box" :class="{ 'end-screen__box--special': ending.isSpecial }">
      <div class="end-screen__badge">
        {{ ending.isSpecial ? (lang === 'en' ? '🏅 Special Ending' : '🏅 特殊结局') : (lang === 'en' ? '📋 Final Report' : '📋 结算报告') }}
      </div>

      <h2 class="end-screen__title">{{ lang === 'en' && ending.titleEn ? ending.titleEn : ending.title }}</h2>

      <p class="end-screen__body">{{ lang === 'en' && ending.bodyEn ? ending.bodyEn : ending.body }}</p>

      <!-- 最终数值 -->
      <div class="end-screen__stats">
        <div class="end-screen__stat">
          <span>{{ lang === 'en' ? '❤️ Health' : '❤️ 健康值' }}</span>
          <span class="end-screen__stat-val">{{ stats.health }}</span>
        </div>
        <div class="end-screen__stat">
          <span>{{ lang === 'en' ? '🌐 Diplomacy' : '🌐 外交声誉' }}</span>
          <span class="end-screen__stat-val">{{ stats.diplomacy }}</span>
        </div>
        <div class="end-screen__stat">
          <span>{{ lang === 'en' ? '😤 Stress' : '😤 压力值' }}</span>
          <span class="end-screen__stat-val">{{ stats.stress }}</span>
        </div>
        <div class="end-screen__stat end-screen__stat--win">
          <span>{{ lang === 'en' ? '📋 Events Handled' : '📋 处理打断事件' }}</span>
          <span class="end-screen__stat-val end-screen__stat-val--win">{{ handledInterrupts }} / 12</span>
        </div>
      </div>

      <!-- 选择记录 -->
      <div v-if="choiceHistory.length" class="end-screen__log">
        <h3 class="end-screen__log-title">
          {{ lang === 'en' ? 'Choice Log' : '选择记录' }}
        </h3>
        <div class="end-screen__log-list">
          <div
            v-for="record in choiceHistory"
            :key="record.id"
            class="end-screen__log-item"
          >
            <div class="end-screen__log-meta">
              <span :class="`end-screen__log-tag end-screen__log-tag--${['a','b','c'][record.optionIndex]}`">
                {{ ['A','B','C'][record.optionIndex] }}
              </span>
              <span class="end-screen__log-source">{{ record.eventSource }}</span>
              <span class="end-screen__log-time">{{ record.gameTime }}</span>
            </div>
            <p class="end-screen__log-reply">{{ record.reply }}</p>
          </div>
        </div>
      </div>

      <div class="end-screen__actions">
        <button class="end-screen__btn end-screen__btn--restart" @click="$emit('restart')">
          {{ lang === 'en' ? 'Win Again' : '再赢一次' }}
        </button>
        <RouterLink to="/" class="end-screen__btn end-screen__btn--home">
          {{ lang === 'en' ? 'Back to Home' : '回到主页' }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameStats, GameEnding, ChoiceRecord } from '@/contents/game-data'
import { useLocale } from '@/composables'

defineProps<{
  ending: GameEnding
  stats: GameStats
  handledInterrupts: number
  choiceHistory: ChoiceRecord[]
}>()

defineEmits<{
  restart: []
}>()

const { lang } = useLocale()
</script>

<style lang="css" scoped>
@reference "@/style.css";

.end-screen {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-overlay-scrim/80 backdrop-blur-md;
}

.end-screen__box {
  @apply mx-4 w-full max-w-lg rounded-2xl border border-border-subtle bg-bg-surface p-8 shadow-2xl
         max-h-[90vh] overflow-y-auto;
}

.end-screen__box--special {
  @apply border-accent/60 bg-accent/5;
}

.end-screen__badge {
  @apply mb-4 inline-block rounded-full bg-bg-overlay px-3 py-1 text-xs font-semibold text-text-muted;
}

.end-screen__title {
  @apply mb-4 text-xl font-bold leading-snug text-accent-light;
}

.end-screen__body {
  @apply mb-6 whitespace-pre-line text-sm leading-relaxed text-text-secondary;
}

.end-screen__stats {
  @apply mb-6 grid grid-cols-2 gap-3;
}

.end-screen__stat {
  @apply flex flex-col gap-1 rounded-xl bg-bg-overlay px-4 py-3 text-xs text-text-muted;
}

.end-screen__stat--win {
  @apply col-span-2;
}

.end-screen__stat-val {
  @apply font-mono text-2xl font-bold text-text-primary;
}

.end-screen__stat-val--win {
  @apply text-accent-light;
}

.end-screen__log {
  @apply mb-6;
}

.end-screen__log-title {
  @apply mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted;
}

.end-screen__log-list {
  @apply flex max-h-52 flex-col gap-2 overflow-y-auto pr-1;
}

.end-screen__log-item {
  @apply rounded-lg bg-bg-overlay px-3 py-2;
}

.end-screen__log-meta {
  @apply mb-1 flex items-center gap-2;
}

.end-screen__log-tag {
  @apply flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold;
}

.end-screen__log-tag--a { @apply bg-success/20 text-success-light; }
.end-screen__log-tag--b { @apply bg-danger/20 text-danger-light; }
.end-screen__log-tag--c { @apply bg-accent/20 text-accent-light; }

.end-screen__log-source {
  @apply flex-1 truncate text-xs text-text-secondary;
}

.end-screen__log-time {
  @apply font-mono text-xs text-text-muted;
}

.end-screen__log-reply {
  @apply text-xs leading-relaxed text-text-muted italic;
}

.end-screen__actions {
  @apply flex gap-3;
}

.end-screen__btn {
  @apply flex-1 rounded-xl py-3 text-center font-semibold transition;
}

.end-screen__btn--restart {
  @apply bg-accent text-text-dark hover:bg-accent-light;
}

.end-screen__btn--home {
  @apply bg-bg-overlay text-text-secondary hover:bg-border-subtle hover:text-text-primary;
}
</style>
