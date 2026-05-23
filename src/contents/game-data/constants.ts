// ---- 游戏时间设定 ----
export const GAME_DURATION_REAL_SECONDS = 120
export const INTERRUPT_INTERVAL_NORMAL = 15      // 常规打断间隔（秒）
export const INTERRUPT_INTERVAL_FAST = 8         // 高压力时打断间隔（秒）
export const STRESS_FAST_THRESHOLD = 70          // 超过此值触发快速打断
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

// ---- 特殊结局阈值 ----
export const ENDING_THRESHOLDS = {
  WIN_ALL_INTERRUPTS: 12, // 处理完全部12个打断事件
} as const
