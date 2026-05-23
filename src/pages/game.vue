<template>
  <div class="ap-nap">

    <!-- 游戏主界面 -->
    <div v-if="phase !== 'ended'" class="ap-nap__layout">

      <!-- 左侧：数值栏 + 立绘插槽 -->
      <aside class="ap-nap__sidebar">
        <StatsBar
          :stats="stats"
          :game-time-left="gameTimeLeft"
          :time-left="timeLeft"
        />

        <!-- 立绘区 -->
        <div class="ap-nap__portrait">
          <SpritePortrait :index="portraitIndex" />
        </div>
      </aside>

      <!-- 右侧：行动区 + 反馈 -->
      <main class="ap-nap__main">
        <HealthActions
          :is-busy="isBusy"
          :busy-action="busyAction"
          :busy-time-left="busyTimeLeft"
          :streak-action-id="streakActionId"
          :streak-count="streakCount"
          @execute="executeAction"
        />

        <!-- 行动历史气泡（最新在上） -->
        <TransitionGroup
          v-if="recentActions.length"
          name="fade-up"
          tag="div"
          class="ap-nap__action-history"
        >
          <div
            v-for="(record, i) in recentActions"
            :key="record.id"
            class="ap-nap__action-bubble"
            :class="{ 'ap-nap__action-bubble--interrupted': record.interrupted }"
            :style="{ opacity: 1 - i * 0.2 }"
          >
            <span class="ap-nap__action-icon">{{ record.interrupted ? '⚡' : '✓' }}</span>
            <p class="ap-nap__action-text">{{ record.text }}</p>
            <div class="ap-nap__action-meta">
              <span v-if="record.multiplier < 1" class="ap-nap__action-half">×½</span>
              <span class="ap-nap__action-time">{{ record.gameTime }}</span>
            </div>
          </div>
        </TransitionGroup>

        <!-- 选择气泡列表（最新在上） -->
        <TransitionGroup
          v-if="recentChoices.length"
          name="fade-up"
          tag="div"
          class="ap-nap__choice-history"
        >
          <div
            v-for="(record, i) in recentChoices"
            :key="record.id"
            class="ap-nap__choice-bubble"
            :style="{ opacity: 1 - i * 0.18 }"
          >
            <span :class="`ap-nap__choice-tag ap-nap__choice-tag--${['a','b','c'][record.optionIndex]}`">
              {{ ['A','B','C'][record.optionIndex] }}
            </span>
            <p class="ap-nap__choice-reply">{{ record.reply }}</p>
            <span class="ap-nap__choice-time">{{ record.gameTime }}</span>
          </div>
        </TransitionGroup>
      </main>
    </div>

    <!-- 打断事件弹窗 -->
    <EventModal
      :event="currentEvent"
      :decision-time-left="decisionTimeLeft"
      @choose="chooseOption"
    />

    <!-- 结局 -->
    <EndScreen
      v-if="phase === 'ended' && ending"
      :ending="ending"
      :stats="stats"
      :handled-interrupts="handledInterrupts"
      :choice-history="choiceHistory"
      @restart="restartGame"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameState } from '@/composables'
import StatsBar from '@/components/ap-nap/stats-bar.vue'
import HealthActions from '@/components/ap-nap/health-actions.vue'
import EventModal from '@/components/ap-nap/event-modal.vue'
import EndScreen from '@/components/ap-nap/end-screen.vue'
import SpritePortrait from '@/components/ap-nap/sprite-portrait.vue'

const {
  phase,
  stats,
  timeLeft,
  gameTimeLeft,
  actionFeedbackList,
  streakActionId,
  streakCount,
  isBusy,
  busyAction,
  busyTimeLeft,
  currentEvent,
  decisionTimeLeft,
  ending,
  handledInterrupts,
  choiceHistory,
  startGame,
  restartGame,
  executeAction,
  chooseOption,
} = useGameState()

const recentActions = computed(() =>
  [...actionFeedbackList.value].reverse().slice(0, 4)
)

const recentChoices = computed(() =>
  [...choiceHistory.value].reverse().slice(0, 5)
)

// Map health + stress → sprite frame index (0–6)
// 0: 正常  1: 精神焕发  2: 精神萎靡  3: 苦恼  4: 精神萎靡(重)  5: 苦恼(重)  6: 困得不行
const portraitIndex = computed(() => {
  const { health, stress } = stats.value
  if (stress >= 80 || health <= 10) return 6
  if (stress >= 60 && health <= 30) return 5
  if (stress >= 60) return 3
  if (health <= 20) return 4
  if (health <= 40) return 2
  if (health >= 70 && stress <= 30) return 1
  return 0
})

onMounted(() => {
  startGame()
})
</script>

<style lang="css" scoped>
@reference "@/style.css";

.ap-nap {
  @apply relative min-h-screen flex items-center justify-center bg-bg-page text-text-primary;
}

.ap-nap__layout {
  @apply w-full mx-auto flex max-w-5xl flex-col gap-4 p-4 md:flex-row md:items-start md:gap-6 md:p-6;
}

.ap-nap__sidebar {
  @apply flex flex-col gap-4 md:w-64 md:shrink-0;
}

.ap-nap__main {
  @apply flex flex-1 flex-col gap-4;
}

.ap-nap__portrait {
  @apply flex items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-bg-surface/40;
  min-height: 200px;
}

.ap-nap__portrait-img {
  @apply h-full w-full object-contain object-bottom;
  max-height: 360px;
}

.ap-nap__portrait-placeholder {
  @apply flex flex-col items-center gap-2 py-8 text-text-muted;
}

.ap-nap__portrait-placeholder span:first-child {
  @apply text-5xl opacity-30;
}

.ap-nap__portrait-hint {
  @apply text-xs;
}

.ap-nap__action-history {
  @apply flex flex-col gap-2;
}

.ap-nap__action-bubble {
  @apply grid items-center rounded-xl border border-border-subtle bg-bg-surface/60
         px-4 py-2.5 text-sm text-text-secondary;
  grid-template-columns: 1.25rem 1fr auto;
  gap: 0 0.625rem;
  transition: opacity 0.3s;
}

.ap-nap__action-bubble--interrupted {
  @apply border-danger/30 bg-danger/5;
}

.ap-nap__action-icon {
  @apply text-xs;
}

.ap-nap__action-text {
  @apply italic leading-snug;
}

.ap-nap__action-meta {
  @apply flex items-center gap-1.5;
}

.ap-nap__action-half {
  @apply rounded px-1 text-xs font-bold bg-accent/20 text-accent-light;
}

.ap-nap__action-time {
  @apply font-mono text-xs text-text-muted whitespace-nowrap;
}

.ap-nap__tonald-badge {
  @apply mb-3 rounded-lg bg-danger/20 px-3 py-1.5 text-center text-sm font-bold text-danger-light;
}

.ap-nap__choice-history {
  @apply flex flex-col gap-2;
}

.ap-nap__choice-bubble {
  @apply grid rounded-xl border border-border-subtle bg-bg-surface/60
         px-4 py-3 text-sm leading-relaxed text-text-secondary;
  grid-template-columns: 1.5rem 1fr auto;
  grid-template-rows: auto;
  gap: 0 0.75rem;
  align-items: start;
  transition: opacity 0.3s;
}

.ap-nap__choice-reply {
  @apply italic;
}

.ap-nap__choice-time {
  @apply font-mono text-xs text-text-muted self-center whitespace-nowrap;
}

.ap-nap__choice-tag {
  @apply flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold not-italic;
}

.ap-nap__choice-tag--a { @apply bg-success/20 text-success-light; }
.ap-nap__choice-tag--b { @apply bg-danger/20 text-danger-light; }
.ap-nap__choice-tag--c { @apply bg-accent/20 text-accent-light; }

.fade-up-enter-active, .fade-up-leave-active { transition: opacity 0.25s, transform 0.25s; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(6px); }
</style>
