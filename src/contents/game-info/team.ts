/**
 * 团队与成员信息 — 只放数据，类型定义见 types.ts
 * 如需为某位成员添加详细介绍，在 team-intro/ 目录下创建同名 .md 文件。
 */

import type { TeamInfo } from '.'

export const TEAM_INFO: TeamInfo = {
  teamName: 'Momakoding',
  description:
    '2026年5月深圳文博会igda Vibejam 活动作品（2）',
  members: [
    {
      name: 'Saša',
      role: '策划 / 程序 / 美术',
      avatar: '👤',
    }
  ],
}
