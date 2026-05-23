# AP-NAP: 20 Minutes — 实现 Todo

## 进行中

- [ ] 样式打磨：进度条动画、CSS shake、倒计时红色紧张感

## 待办

- [ ] 立绘接入：将 `portraitSrc` 替换为实际图片路径（`src/pages/game.vue` line 77）
- [ ] 选项回复展示：选完事件后显示 Tonald 的 `reply` 台词（`actionFeedback` 已挂载，需验证）
- [ ] 背景音效 / BGM（可选）

## 已完成

- [x] 定义游戏数据层：types、constants、8 个 Tonald 健康行动、12 个打断事件、结局矩阵（`src/contents/game-data/`）
- [x] 实现 `useGameState` composable：health / diplomacy / stress 三值、主循环、行动执行、即死判断、handledInterrupts 计数
- [x] 打断事件系统：15s / 8s 动态间隔、5s 倒计时、超时默认选 C、defer 重入队、stress > 70 加速
- [x] 结局计算器：双轴评价（外交 + 健康）+ 特殊结局优先判断（12 事件全处理 → 终极赢圣）
- [x] Vue 组件拆分（kebab-case 命名）：`stats-bar`、`health-actions`、`event-modal`、`end-screen`（`src/components/ap-nap/`）
- [x] 移除旧 `isTonaldEvent` / `dumpVolatility` / `winCounter`，全面对齐新 spec（Tonald Dump 视角）
- [x] `game.vue` 直接作为游戏主界面，预留 `portraitSrc` 立绘插槽，路由 `/game` 不变
- [x] Phaser 调用已从 `game.vue` 移除，`engine/` 架构保留不删
