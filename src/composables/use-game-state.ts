import { ref, computed, readonly } from 'vue'
import type { GameStats, GamePhase, HealthAction, InterruptEvent, GameEnding } from '@/contents/game-data'
import {
  INITIAL_STATS, STAT_CAPS,
  GAME_DURATION_REAL_SECONDS,
  INTERRUPT_COUNT, INTERRUPT_DECISION_SECONDS,
  STRESS_HEALTH_DRAIN_THRESHOLD,
  EVENT_LOCALE_EN, ACTION_LOCALE_EN,
} from '@/contents/game-data'
import { INTERRUPT_EVENTS } from '@/contents/game-data'
import { resolveSpecialEnding, resolveNormalEnding, INSTANT_DEATH_ENDINGS } from '@/contents/game-data'
import { useLocale } from './use-locale'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function useGameState() {
  const { lang } = useLocale()

  // ---- 核心状态 ----
  const phase = ref<GamePhase>('playing')
  const stats = ref<GameStats>({ ...INITIAL_STATS })
  const timeLeft = ref(GAME_DURATION_REAL_SECONDS)
  const actionFeedback = ref('')
  const isBusy = ref(false)
  const busyAction = ref<HealthAction | null>(null)
  const busyTimeLeft = ref(0)

  // ---- 打断事件状态 ----
  const currentEvent = ref<InterruptEvent | null>(null)
  const decisionTimeLeft = ref(0)

  // ---- 결국 ----
  const ending = ref<GameEnding | null>(null)
  const handledInterrupts = ref(0)

  // ---- 计时器句柄 ----
  let mainTimer: ReturnType<typeof setInterval> | null = null
  let decisionTimer: ReturnType<typeof setInterval> | null = null
  let busyTimer: ReturnType<typeof setInterval> | null = null

  // ---- 事件触发检查点（timeLeft 阈值，从大到小，pop 消费）----
  let triggerPoints: number[] = []

  function buildTriggerPoints(): number[] {
    // 12个触发点，均匀分布：首个在5秒后（timeLeft=115），末个在5秒前（timeLeft=5）
    const first = GAME_DURATION_REAL_SECONDS - 5
    const last = 5
    const step = (first - last) / (INTERRUPT_COUNT - 1)
    return Array.from({ length: INTERRUPT_COUNT }, (_, i) => Math.round(first - i * step))
      .sort((a, b) => a - b) // 升序存储，pop 从最大值开始消费
  }

  // ---- 事件队列（随机洗牌后循环使用）----
  let eventQueue: InterruptEvent[] = []

  function refillQueue() {
    eventQueue = [...INTERRUPT_EVENTS].sort(() => Math.random() - 0.5)
  }

  function nextEvent(): InterruptEvent {
    if (eventQueue.length === 0) refillQueue()
    return eventQueue.pop()!
  }

  // ---- 数值变更（带边界）----
  function applyDeltas(health = 0, diplomacy = 0, stress = 0) {
    stats.value.health    = clamp(stats.value.health    + health,    STAT_CAPS.health.min,    STAT_CAPS.health.max)
    stats.value.diplomacy = clamp(stats.value.diplomacy + diplomacy, STAT_CAPS.diplomacy.min, STAT_CAPS.diplomacy.max)
    stats.value.stress    = clamp(stats.value.stress    + stress,    STAT_CAPS.stress.min,    STAT_CAPS.stress.max)
  }

  // ---- 即死检查 ----
  function checkInstantDeath(): boolean {
    if (stats.value.health <= 0) {
      triggerEnding(INSTANT_DEATH_ENDINGS.health_zero); return true
    }
    if (stats.value.diplomacy <= 0) {
      triggerEnding(INSTANT_DEATH_ENDINGS.diplomacy_zero); return true
    }
    if (stats.value.stress >= 100) {
      triggerEnding(INSTANT_DEATH_ENDINGS.stress_max); return true
    }
    return false
  }

  // ---- 结局 ----
  function triggerEnding(e: GameEnding) {
    phase.value = 'ended'
    ending.value = e
    clearAllTimers()
  }

  function finalizeGame() {
    const special = resolveSpecialEnding(stats.value, handledInterrupts.value)
    triggerEnding(special ?? resolveNormalEnding(stats.value, lang.value))
  }

  // ---- 计时器清理 ----
  function clearAllTimers() {
    if (mainTimer)     { clearInterval(mainTimer);     mainTimer = null }
    if (decisionTimer) { clearInterval(decisionTimer); decisionTimer = null }
    if (busyTimer)     { clearInterval(busyTimer);     busyTimer = null }
  }

  function showInterruptEvent() {
    if (isBusy.value) cancelBusyAction(true)
    currentEvent.value = nextEvent()
    phase.value = 'interrupted'
    decisionTimeLeft.value = INTERRUPT_DECISION_SECONDS

    if (decisionTimer) clearInterval(decisionTimer)
    decisionTimer = setInterval(() => {
      decisionTimeLeft.value--
      if (decisionTimeLeft.value <= 0) {
        clearInterval(decisionTimer!); decisionTimer = null
        chooseOption(2)
      }
    }, 1000)
  }

  function chooseOption(optionIndex: 0 | 1 | 2) {
    if (!currentEvent.value) return
    if (decisionTimer) { clearInterval(decisionTimer); decisionTimer = null }

    const option = currentEvent.value.options[optionIndex]
    const { health = 0, diplomacy = 0, stress = 0 } = option.deltas

    handledInterrupts.value++
    applyDeltas(health, diplomacy, stress)
    const enReply = EVENT_LOCALE_EN[currentEvent.value.id]?.options[optionIndex]?.reply
    actionFeedback.value = lang.value === 'en' && enReply ? enReply : option.reply

    currentEvent.value = null
    phase.value = 'playing'

    if (checkInstantDeath()) return
    if (timeLeft.value <= 0) { finalizeGame(); return }
  }

  // ---- 健康行动 ----
  function executeAction(action: HealthAction) {
    if (phase.value !== 'playing' || isBusy.value) return
    isBusy.value = true
    busyAction.value = action
    busyTimeLeft.value = action.realSeconds

    busyTimer = setInterval(() => {
      busyTimeLeft.value--
      if (busyTimeLeft.value <= 0) {
        clearInterval(busyTimer!); busyTimer = null
        finishAction(action)
      }
    }, 1000)
  }

  function finishAction(action: HealthAction) {
    isBusy.value = false
    busyAction.value = null
    applyDeltas(action.healthGain, 0, action.stressDelta)
    const enTooltip = ACTION_LOCALE_EN[action.id]?.tooltip
    actionFeedback.value = lang.value === 'en' && enTooltip ? enTooltip : action.tooltip
    checkInstantDeath()
  }

  function cancelBusyAction() {
    if (busyTimer) { clearInterval(busyTimer); busyTimer = null }
    isBusy.value = false
    busyAction.value = null
    busyTimeLeft.value = 0
  }

  // ---- 主游戏循环 ----
  function startGame() {
    stats.value = { ...INITIAL_STATS }
    timeLeft.value = GAME_DURATION_REAL_SECONDS
    actionFeedback.value = ''
    ending.value = null
    handledInterrupts.value = 0
    isBusy.value = false
    busyAction.value = null
    currentEvent.value = null
    refillQueue()
    triggerPoints = buildTriggerPoints()
    phase.value = 'playing'

    // 主计时器：决策期间暂停倒计时
    mainTimer = setInterval(() => {
      if (phase.value === 'interrupted') return
      // 高压时被动扣血
      if (stats.value.stress > STRESS_HEALTH_DRAIN_THRESHOLD) {
        applyDeltas(-1, 0, 0)
        if (checkInstantDeath()) return
      }
      timeLeft.value--
      // 检查点触发：timeLeft 降到阈值时弹出事件
      if (triggerPoints.length > 0 && timeLeft.value <= triggerPoints[triggerPoints.length - 1]) {
        triggerPoints.pop()
        showInterruptEvent()
        return
      }
      if (timeLeft.value <= 0) finalizeGame()
    }, 1000)
  }

  function restartGame() {
    clearAllTimers()
    startGame()
  }

  // 游戏内时间显示（1现实秒 = 10游戏秒）
  const gameTimeLeft = computed(() => {
    const total = timeLeft.value * 10
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  return {
    phase: readonly(phase),
    stats: readonly(stats),
    timeLeft: readonly(timeLeft),
    gameTimeLeft,
    actionFeedback: readonly(actionFeedback),
    isBusy: readonly(isBusy),
    busyAction: readonly(busyAction),
    busyTimeLeft: readonly(busyTimeLeft),
    currentEvent: readonly(currentEvent),
    decisionTimeLeft: readonly(decisionTimeLeft),
    ending: readonly(ending),
    handledInterrupts: readonly(handledInterrupts),

    startGame,
    restartGame,
    executeAction,
    chooseOption,
  }
}
