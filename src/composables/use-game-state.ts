import { ref, computed, readonly } from 'vue'
import type { GameStats, GamePhase, HealthAction, InterruptEvent, GameEnding, ChoiceRecord, ActionRecord } from '@/contents/game-data'
import {
  INITIAL_STATS, STAT_CAPS,
  GAME_DURATION_REAL_SECONDS,
  INTERRUPT_COUNT, INTERRUPT_DECISION_SECONDS,
  STRESS_HEALTH_DRAIN_THRESHOLD,
  ACTION_REPEAT_MULTIPLIER, ACTION_MAX_CONSECUTIVE,
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
  const isBusy = ref(false)
  const busyAction = ref<HealthAction | null>(null)
  const busyTimeLeft = ref(0)

  // ---- 行动历史 & 连续重复追踪 ----
  const actionFeedbackList = ref<ActionRecord[]>([])
  const streakActionId  = ref<string | null>(null)  // 最近完成的行动 id
  const streakCount     = ref(0)                    // 该行动连续完成次数
  let actionFeedbackIdCounter = 0
  let currentActionMultiplier = 1

  // ---- 打断事件状态 ----
  const currentEvent = ref<InterruptEvent | null>(null)
  const decisionTimeLeft = ref(0)
  const decisionElapsed = ref(0)

  // ---- 결국 ----
  const ending = ref<GameEnding | null>(null)
  const handledInterrupts = ref(0)
  const choiceHistory = ref<ChoiceRecord[]>([])
  let choiceIdCounter = 0

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
    decisionElapsed.value = 0

    if (decisionTimer) clearInterval(decisionTimer)
    decisionTimer = setInterval(() => {
      decisionTimeLeft.value--
      decisionElapsed.value++
      if (decisionTimeLeft.value <= 0) {
        clearInterval(decisionTimer!); decisionTimer = null
        chooseOption(2)
      }
    }, 1000)
  }

  function chooseOption(optionIndex: 0 | 1 | 2) {
    if (!currentEvent.value) return
    if (decisionTimer) { clearInterval(decisionTimer); decisionTimer = null }

    const event = currentEvent.value
    const option = event.options[optionIndex]
    const enLocale = EVENT_LOCALE_EN[event.id]
    const { health = 0, diplomacy = 0, stress = 0 } = option.deltas

    handledInterrupts.value++
    applyDeltas(health, diplomacy, stress)

    const reply = lang.value === 'en' && enLocale?.options[optionIndex]?.reply
      ? enLocale.options[optionIndex].reply
      : option.reply
    const optionLabel = lang.value === 'en' && enLocale?.options[optionIndex]?.label
      ? enLocale.options[optionIndex].label
      : option.label

    choiceHistory.value.push({
      id: ++choiceIdCounter,
      eventSource: lang.value === 'en' && enLocale?.source ? enLocale.source : event.source,
      eventTitle: lang.value === 'en' && enLocale?.title ? enLocale.title : event.title,
      optionIndex,
      optionLabel,
      reply,
      gameTime: gameTimeLeft.value,
      decisionElapsed: decisionElapsed.value,
      deltas: { health, diplomacy, stress },
    })

    currentEvent.value = null
    phase.value = 'playing'

    if (checkInstantDeath()) return
    if (timeLeft.value <= 0) { finalizeGame(); return }
  }

  // ---- 健康行动 ----
  function executeAction(action: HealthAction) {
    if (phase.value !== 'playing' || isBusy.value) return
    if (action.id === streakActionId.value && streakCount.value >= ACTION_MAX_CONSECUTIVE) return
    currentActionMultiplier = action.id === streakActionId.value ? ACTION_REPEAT_MULTIPLIER : 1
    if (action.id === streakActionId.value) {
      streakCount.value++
    } else {
      streakActionId.value = action.id
      streakCount.value = 1
    }

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
    const m = currentActionMultiplier
    applyDeltas(Math.round(action.healthGain * m), 0, Math.round(action.stressDelta * m))
    const enName = ACTION_LOCALE_EN[action.id]?.name
    const enTooltip = ACTION_LOCALE_EN[action.id]?.tooltip
    actionFeedbackList.value.push({
      id: ++actionFeedbackIdCounter,
      actionName: lang.value === 'en' && enName ? enName : action.name,
      text: lang.value === 'en' && enTooltip ? enTooltip : action.tooltip,
      gameTime: gameTimeLeft.value,
      interrupted: false,
      multiplier: m,
    })
    checkInstantDeath()
  }

  function cancelBusyAction(partial = false) {
    if (busyTimer) { clearInterval(busyTimer); busyTimer = null }
    if (partial && busyAction.value) {
      const action = busyAction.value
      const elapsed = action.realSeconds - busyTimeLeft.value
      const ratio = elapsed / action.realSeconds
      const m = currentActionMultiplier
      const partialHealth = Math.round(action.healthGain * ratio * 0.5 * m)
      const partialStress = Math.round(action.stressDelta * ratio * 0.5 * m)
      if (partialHealth > 0 || partialStress !== 0) applyDeltas(partialHealth, 0, partialStress)
      const enName = ACTION_LOCALE_EN[action.id]?.name
      const name = lang.value === 'en' && enName ? enName : action.name
      actionFeedbackList.value.push({
        id: ++actionFeedbackIdCounter,
        actionName: name,
        text: lang.value === 'en' ? `(Interrupted) ${name}` : `（被打断）${name}`,
        gameTime: gameTimeLeft.value,
        interrupted: true,
        multiplier: m * 0.5,
      })
    }
    isBusy.value = false
    busyAction.value = null
    busyTimeLeft.value = 0
  }

  // ---- 主游戏循环 ----
  function startGame() {
    stats.value = { ...INITIAL_STATS }
    timeLeft.value = GAME_DURATION_REAL_SECONDS
    actionFeedbackList.value = []
    actionFeedbackIdCounter = 0
    streakActionId.value = null
    streakCount.value = 0
    currentActionMultiplier = 1
    ending.value = null
    handledInterrupts.value = 0
    choiceHistory.value = []
    choiceIdCounter = 0
    decisionElapsed.value = 0
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
    actionFeedbackList,
    streakActionId: readonly(streakActionId),
    streakCount: readonly(streakCount),
    isBusy: readonly(isBusy),
    busyAction: readonly(busyAction),
    busyTimeLeft: readonly(busyTimeLeft),
    currentEvent: readonly(currentEvent),
    decisionTimeLeft: readonly(decisionTimeLeft),
    decisionElapsed: readonly(decisionElapsed),
    ending: readonly(ending),
    handledInterrupts: readonly(handledInterrupts),
    choiceHistory,

    startGame,
    restartGame,
    executeAction,
    chooseOption,
  }
}
