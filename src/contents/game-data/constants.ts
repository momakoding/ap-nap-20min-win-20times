// ---- 游戏时间设定 ----
export const GAME_DURATION_REAL_SECONDS = 120
export const INTERRUPT_COUNT = 12                // 每局固定触发的打断事件数
export const INTERRUPT_DECISION_SECONDS = 8      // 玩家决策时间
export const STRESS_HEALTH_DRAIN_THRESHOLD = 70  // 压力超此值时健康值被动扣减

// ---- 初始数值 ----
export const INITIAL_STATS = {
  health: 40,
  diplomacy: 60,
  stress: 30,
} as const

// ---- 数值上下限 ----
export const STAT_CAPS = {
  health:    { min: 0, max: 100 },
  diplomacy: { min: 0, max: 100 },
  stress:    { min: 0, max: 100 },
} as const

// ---- 行动重复衰减 ----
export const ACTION_REPEAT_DECAY = 0.5   // multiplier = 1 / (1 + useCount * DECAY)

// ---- 特殊结局阈值 ----
export const ENDING_THRESHOLDS = {
  WIN_ALL_INTERRUPTS: 12, // 处理完全部12个打断事件
  WIN_MIN_DIPLOMACY:  50, // 外交声誉下限
  WIN_MAX_STRESS:     79, // 压力值上限（全defer=81，恰好卡掉）
  WIN_MIN_HEALTH:     25, // 健康值下限
} as const
