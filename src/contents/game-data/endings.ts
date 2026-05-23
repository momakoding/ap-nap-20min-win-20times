import type { GameStats, GameEnding } from './types'
import { ENDING_THRESHOLDS } from './constants'
import { ENDING_LOCALE_EN } from './locale-en'

// ---- 即死结局 ----
export const INSTANT_DEATH_ENDINGS: Record<string, GameEnding> = {
  health_zero: {
    title: '彻底气炸 / 心脏停摆',
    titleEn: ENDING_LOCALE_EN.instantDeath.health_zero.title,
    body: '健康值归零。高强度的政务对线最终把你的心脏逼到了极限。特勤局已在推特上替你发布了最后一条"我们正在赢"的声明，闭幕式由副总统代为出席。',
    bodyEn: ENDING_LOCALE_EN.instantDeath.health_zero.body,
    isSpecial: true,
  },
  diplomacy_zero: {
    title: '被踢出群聊',
    titleEn: ENDING_LOCALE_EN.instantDeath.diplomacy_zero.title,
    body: '外交声誉归零。你的一系列强硬操作终于导致 APEC 各成员国集体将你移出峰会工作群。下午的圆桌会议议程里，你的座位牌已被悄悄撤走，输麻了。',
    bodyEn: ENDING_LOCALE_EN.instantDeath.diplomacy_zero.body,
    isSpecial: true,
  },
  stress_max: {
    title: '摔手机破防',
    titleEn: ENDING_LOCALE_EN.instantDeath.stress_max.title,
    body: '压力值拉满，你在休息室里将手机狠狠砸向地面，屏幕碎成了蜘蛛网。随行摄像团队全程直播了这一幕，推特上"懂总统摔机"迅速登上热搜第一，多边谈判就此失控。',
    bodyEn: ENDING_LOCALE_EN.instantDeath.stress_max.body,
    isSpecial: true,
  },
}

// ---- 特殊隐藏结局 ----
export function resolveSpecialEnding(stats: GameStats, handledInterrupts: number): GameEnding | null {
  if (
    handledInterrupts >= ENDING_THRESHOLDS.WIN_ALL_INTERRUPTS &&
    stats.diplomacy  >= ENDING_THRESHOLDS.WIN_MIN_DIPLOMACY   &&
    stats.stress     <= ENDING_THRESHOLDS.WIN_MAX_STRESS       &&
    stats.health     >= ENDING_THRESHOLDS.WIN_MIN_HEALTH
  ) {
    return {
      title: '20分钟赢了20次：终极赢圣（20 Min, Win 20 Times）',
      titleEn: ENDING_LOCALE_EN.special.title,
      body: '不可思议！你在短短 20 分钟的午休时间里，见缝插针地在外交、健康、推特和亲情战场上连续赢了足足 20 次！无论是搞屎、普丁还是 CNM，全都在你的掌控之中。你成功向世界证明：没人比我更懂如何在 20 分钟内拯救身体并赢下亚太！',
      bodyEn: ENDING_LOCALE_EN.special.body,
      isSpecial: true,
    }
  }
  return null
}

// ---- 外交维度评价 ----
function getDiplomacyRating(diplomacy: number, lang: 'zh' | 'en'): string {
  if (lang === 'en') {
    if (diplomacy >= 80) return ENDING_LOCALE_EN.diplomacyRating.high
    if (diplomacy >= 40) return ENDING_LOCALE_EN.diplomacyRating.mid
    return ENDING_LOCALE_EN.diplomacyRating.low
  }
  if (diplomacy >= 80) return '【多边交易的终极操盘手 (The Master of the Deal)】所有的多边协定都在你的极限施压下变成了有利于你的双赢，你让大国合作再次赢麻了！'
  if (diplomacy >= 40) return '【傲慢的单边主义关税侠 (The Tariff Man)】虽没能说服所有人，但你靠加税大棒成功敲碎了几个硬骨头，基本稳住了基本盘，勉强算赢。'
  return '【被亚太群聊彻底孤立的局外人 (The Isolated Outcast)】电话挂得太爽，下午你发现自己的座位被挪到了圆桌会议最边缘靠近洗手间的位置，输麻了。'
}

// ---- 健康/压力维度评价 ----
function getHealthRating(health: number, lang: 'zh' | 'en'): string {
  if (lang === 'en') {
    if (health >= 80) return ENDING_LOCALE_EN.healthRating.high
    if (health >= 40) return ENDING_LOCALE_EN.healthRating.mid
    return ENDING_LOCALE_EN.healthRating.low
  }
  if (health >= 80) return '【医学史上的永生奇迹 (The Dynamic Genius)】顶着山呼海啸的政务压力，你竟然靠麦当劳和无糖可乐把健康度拉满了，连医生都惊呼你是养生界的神迹！'
  if (health >= 40) return '【血压两极分化的亚健康政客】典型的懂氏身体结构。虽然你的大脑依然极度亢奋，但你的胃和心脏已经在强烈抗议高强度的对线。'
  return '【气炸在长椅上的政坛流星】极度敬业但毫无章法。你和媒体对线了太多次，高压直接冲破临界值，下午的大会你只能在特护病房里通过推特参与了。'
}

// ---- 常规结局（双轴拼接）----
export function resolveNormalEnding(stats: GameStats, lang: 'zh' | 'en' = 'zh'): GameEnding {
  return {
    title: lang === 'en' ? ENDING_LOCALE_EN.normalTitle : '午休结束',
    body: `${getDiplomacyRating(stats.diplomacy, lang)}\n\n${getHealthRating(stats.health, lang)}`,
    isSpecial: false,
  }
}
