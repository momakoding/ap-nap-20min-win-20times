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
          @execute="executeAction"
        />

        <Transition name="fade-up">
          <div v-if="actionFeedback" class="ap-nap__feedback">
            <p>{{ actionFeedback }}</p>
          </div>
        </Transition>
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
  actionFeedback,
  isBusy,
  busyAction,
  busyTimeLeft,
  currentEvent,
  decisionTimeLeft,
  ending,
  handledInterrupts,
  startGame,
  restartGame,
  executeAction,
  chooseOption,
} = useGameState()

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
  @apply relative min-h-screen bg-bg-page text-text-primary;
}

.ap-nap__layout {
  @apply mx-auto flex max-w-5xl flex-col gap-4 p-4 md:flex-row md:items-start md:gap-6 md:p-6;
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

.ap-nap__feedback {
  @apply rounded-xl border border-border-subtle bg-bg-surface/60 px-4 py-3 text-sm
         leading-relaxed text-text-secondary italic;
}

.ap-nap__tonald-badge {
  @apply mb-3 rounded-lg bg-danger/20 px-3 py-1.5 text-center text-sm font-bold text-danger-light;
}

.fade-up-enter-active, .fade-up-leave-active { transition: opacity 0.25s, transform 0.25s; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(6px); }
</style>
