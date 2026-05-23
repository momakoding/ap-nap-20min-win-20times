// ---- 核心数值 ----
export interface GameStats {
  health: number      // 健康值，初始40，上限100
  diplomacy: number   // 外交声誉，初始60，上限100
  stress: number      // 压力值，初始30，上限100；达到100触发"摔手机破防"结局
}

// ---- 选项效果（均为可选，缺省为0）----
export interface OptionDeltas {
  health?: number
  diplomacy?: number
  stress?: number
}

// ---- 事件选项 ----
export interface EventOption {
  label: string
  reply: string       // Tonald 的回应台词
  deltas: OptionDeltas
  defer?: boolean     // 是否重新入队
}

// ---- 打断事件 ----
export interface InterruptEvent {
  id: string
  source: string      // 来源标签（含emoji）
  title: string
  body: string
  options: readonly EventOption[]
}

// ---- 健康行动 ----
export interface HealthAction {
  id: string
  name: string
  realSeconds: number   // 现实消耗（秒）
  healthGain: number
  stressDelta: number   // 压力变动（负数=减压，正数=加压）
  tooltip: string
}

// ---- 游戏状态机 ----
export type GamePhase = 'playing' | 'interrupted' | 'ended'

// ---- 结局 ----
export interface GameEnding {
  title: string
  titleEn?: string
  body: string
  bodyEn?: string
  isSpecial: boolean
}
