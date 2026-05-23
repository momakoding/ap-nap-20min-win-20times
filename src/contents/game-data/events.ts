import type { InterruptEvent } from './types'

export const INTERRUPT_EVENTS: InterruptEvent[] = [
  {
    id: 'jp_semi_tpp',
    source: '🇯🇵 搞屎（日本首相）',
    title: '半导体供应链与TPP回群施压',
    body: '"Dump总统，关于重返CPTPP以及限制对特定区域出口高端光刻胶的备忘录，您考虑得如何了？日本国民都在等待您的智慧。"',
    options: [
      {
        label: '接听（强势索要巨额保护费）',
        reply: '"听着，搞屎。想要我们回群，日本必须全额承担驻军费，并且向底特律采购更多汽车！这是一个 GREAT DEAL！"',
        deltas: { diplomacy: 10, stress: 15, health: -8 },
      },
      {
        label: '挂断（指责其出口限制破坏市场）',
        reply: '"Sorry, 你们的半导体政策是一场 DISASTER。我现在要吃我的汉堡了。"',
        deltas: { diplomacy: -12, stress: -5, health: 5 },
      },
      {
        label: '延后（让经贸团队先打太极）',
        reply: '"让 DJ Wangz 拿数据和他们扯皮，二十分钟后再叫我。"',
        deltas: { stress: 5 },
        defer: true,
      },
    ],
  },
  {
    id: 'ru_gas_supply',
    source: '🇷🇺 普丁（俄罗斯总统）',
    title: '全球天然气定价与供应链私密连线',
    body: '"Tonald, APEC 那些关于碳关税的绿色提案就是一纸空文。下午的能源会议，我们要不要重新定义一下天然气供应链的跨区域定价？"',
    options: [
      {
        label: '接听（进行老熟人间的拉扯）',
        reply: '"Puddin, 你是个聪明人。但你们的定价太高了，这让我们的制造业很不高兴。我们可以合作，但你得先在供应链上让步。"',
        deltas: { diplomacy: 15, stress: 20, health: -10 },
      },
      {
        label: '挂断（展现强硬姿态以自证）',
        reply: '"我现在正忙着拯救亚太经济，你的气留着下午开会再说吧。"',
        deltas: { diplomacy: -15, stress: 5, health: 2 },
      },
      {
        label: '延后（丢给五角大楼做安全评估）',
        reply: '"让国防部先发个供应链安全简报，我稍后研判。"',
        deltas: { stress: 2 },
        defer: true,
      },
    ],
  },
  {
    id: 'kr_battery_tax',
    source: '🇰🇷 李在暗（韩国总统）',
    title: '电车电池补贴与新能源加税争议',
    body: '"Dump总统，您提议的全新补贴法案排除了我们的高能电池，同时还在讨论加征碳关税，这严重违反了自贸精神！"',
    options: [
      {
        label: '接听（直接痛斥其抢占本土市场）',
        reply: '"李先生，你们把廉价电池倾销过来，抢走了我们工人的工作！如果想拿补贴，立刻把工厂全部搬到俄亥俄州来！"',
        deltas: { diplomacy: 8, stress: 12, health: -5 },
      },
      {
        label: '挂断（单方面终止争论）',
        reply: '"没有人比我更懂自由贸易，如果有，那一定是我加税的时候。再见。"',
        deltas: { diplomacy: -10, stress: -5, health: 4 },
      },
      {
        label: '延后（甩给商务部对接）',
        reply: '"把这通电话转接给垃比奥，让他用供应链规则去应对。"',
        deltas: { stress: 3 },
        defer: true,
      },
    ],
  },
  {
    id: 'media_cnm_covid',
    source: '🚪 CNM 记者（走廊围堵）',
    title: '关于新冠余波与全球公共卫生支出的质问',
    body: '"Dump总统！有报告称您计划削减 APEC 框架下的全球公共卫生专项援助，这是否意味着您对新冠余波带来的长期健康威胁毫无责任感？"',
    options: [
      {
        label: '接听（当面痛斥其制造假新闻）',
        reply: '"你问了一个非常愚蠢且充满恶意的问题！CNM 就是 FAKE NEWS！我们的医疗体系是全世界最棒的，那些援助全被官僚浪费了！"',
        deltas: { diplomacy: -15, stress: 25, health: -15 },
      },
      {
        label: '挂断（让安保人员直接关门）',
        reply: '"（砰的一声关上休息室大门）他们真是一群可怜的失败者。"',
        deltas: { diplomacy: -5, stress: -10, health: 10 },
      },
      {
        label: '延后（等下午新闻发布会统一应付）',
        reply: '"告诉外面的新闻官，下午发布会我会亲自用事实让他们闭嘴。"',
        deltas: { stress: 8 },
        defer: true,
      },
    ],
  },
  {
    id: 'media_fux_beef',
    source: '🚪 Fux News 记者（专访敲门）',
    title: '加州牛肉禁令与农业选票游说',
    body: '"总统先生，APEC 某些成员国正以"疯牛病残留风险"为由，计划联合对加州牛肉实施进口禁令。德州和加州的农场主们现在非常恐慌！"',
    options: [
      {
        label: '接听（顺势为本土农业疯狂背书）',
        reply: '"我们的美国牛肉是世界上最安全、最美味的！哪个国家敢搞禁令，我就对他们的全部农产品加征 100% 的超级关税！"',
        deltas: { diplomacy: 12, stress: 15, health: -6 },
      },
      {
        label: '挂断（拒绝透露具体反制手段）',
        reply: '"转告农场主们，懂普永远和他们站在一起。我现在需要二十分钟来保持我的精力。"',
        deltas: { diplomacy: 5, stress: -5, health: 5 },
      },
      {
        label: '延后（让农业部长先发表强硬声明）',
        reply: '"让我的发言人先在推特上发一篇严正警告。"',
        deltas: { stress: 4 },
        defer: true,
      },
    ],
  },
  {
    id: 'apec_sugar_tax',
    source: '🎙️ APEC 秘书处',
    title: '多边框架下的"肥胖税与糖税"联合提案',
    body: '"Dump总统，秘书处正在拟定一份旨在降低亚太地区青少年肥胖率的《减糖自律宣言》，提议各国联合加征高糖反式脂肪税。我们需要您的签字。"',
    options: [
      {
        label: '接听（严词拒绝该干预法案）',
        reply: '"这简直是荒谬至极！糖税会毁了食品行业！没人比我更懂肥胖，这完全取决于基因和运动，而不是搞什么愚蠢的加税！"',
        deltas: { diplomacy: -10, stress: 18, health: -10 },
      },
      {
        label: '挂断（直接无视联合提案）',
        reply: '"把那份文件扔进碎纸机。顺便帮我点一杯大号无糖可乐。"',
        deltas: { diplomacy: -12, stress: -5, health: 8 },
      },
      {
        label: '延后（要求评估对本土跨国巨头的影响）',
        reply: '"让经贸代表团评估一下这会不会影响可口可乐和女王蜂的亚太销量，下午再说。"',
        deltas: { stress: 6 },
        defer: true,
      },
    ],
  },
  {
    id: 'ulon_mask_starlink',
    source: '📱 推特上 Ulon Mask',
    title: '火星供应链与亚太微卫星宽带网络',
    body: '"Tonald，听说 APEC 下午要讨论亚太低轨卫星频谱划分？官僚们想把好频段分给多边财团，我的星链需要你的关键一票。"',
    options: [
      {
        label: '接听（建立极客与资本的双赢同盟）',
        reply: '"Ulon，你是个天才，我喜欢你的火箭。放心吧，那些官僚根本不懂什么叫太空经济。下午我会确保天才拿到最好的资源！"',
        deltas: { diplomacy: 15, stress: 10, health: -5 },
      },
      {
        label: '挂断（敲打对方不要试图绑架决策）',
        reply: '"我现在正忙于亚太元首的健康休整。即使是你，Ulon，也得在我的休息时间后面排队。"',
        deltas: { diplomacy: -5, stress: -2, health: 6 },
      },
      {
        label: '延后（留作下午闭门会议的筹码）',
        reply: '"给他发个私信：\'我知道了，下午圆桌会议看我眼色行事。\'"',
        deltas: { stress: 2 },
        defer: true,
      },
    ],
  },
  {
    id: 'family_elamia',
    source: '📱 Elamia Dump（第一夫人）',
    title: '海湖庄园草坪修缮与突击健康抽查',
    body: '"Tonald，我在电视直播里看到你中午居然又在吃高热量全家桶了！随行医生说你的收缩压已经拉警报了。立刻放下手里的垃圾食品！"',
    options: [
      {
        label: '接听（心虚地打哈哈并转移话题）',
        reply: '"哦亲爱的，电视上的镜头欺骗了你，那其实是一盘非常健康的加州有机蔬菜沙拉！海湖庄园的草坪你尽管按照最高标准修，我有钱！"',
        deltas: { diplomacy: -2, stress: 15, health: 12 },
      },
      {
        label: '挂断（强行挂掉电话并极力否认）',
        reply: '"（假装信号不好）喂？喂？会场信号太差了亲爱的，多边干扰太严重了，回去再说！"',
        deltas: { stress: 20, health: -10 },
      },
      {
        label: '延后（安排秘书编造工作借口）',
        reply: '"让大国元首的私人秘书给她回电话，说我正在进行一场关乎供应链生死的闭门谈判。"',
        deltas: { stress: 5 },
        defer: true,
      },
    ],
  },
  {
    id: 'family_ton_jr',
    source: '📱 儿子 Ton Jr.',
    title: '家族加密货币项目与绿色能源合规',
    body: '"老爸！APEC 会议上那些环保主义者正计划通过一项决议，对高能耗的加密货币挖矿课以重税。这会彻底毁了我们家族刚上线的链上项目！"',
    options: [
      {
        label: '接听（面传机宜，教儿子如何借壳避税）',
        reply: '"别慌，小汤。下午我会正式对外宣布，我们的加密货币项目完全采用\'清洁的美式煤炭\'发电，这是最纯正的绿色金融！"',
        deltas: { diplomacy: 5, stress: 18, health: -12 },
      },
      {
        label: '挂断（恨铁不成钢地训斥）',
        reply: '"在这个大国博弈的紧要关头，你居然只关心你的电子玩具？先自己去和德州油田谈合作！"',
        deltas: { diplomacy: -2, stress: 10, health: -5 },
      },
      {
        label: '延后（转交家族信托律师团）',
        reply: '"让纽约的律师团队先去研读 APEC 环保宣言的漏洞，寻找豁免条款。"',
        deltas: { stress: 4 },
        defer: true,
      },
    ],
  },
  {
    id: 'brief_rubbio',
    source: '✉️ Murdo Rubbio 简报',
    title: '关键矿产脱钩与供应链风险提示',
    body: '"总统先生，情报显示几个核心成员国计划在下午签署《亚太关键矿产联合保障协定》，试图绕开我们的稀有金属定价体系。这是紧急应对方案。"',
    options: [
      {
        label: '接听（在简报上批示极限施压策略）',
        reply: '"告诉他们，如果敢签署任何绕开我们的协定，我们将立刻切断他们核心软件的授权。我们要主导供应链！"',
        deltas: { diplomacy: 14, stress: 15, health: -8 },
      },
      {
        label: '挂断（自信认为对方不敢成气候）',
        reply: '"没有我们的参与，他们连一吨高纯度矿产都运不出港口。把这份悲观的报告拿走。"',
        deltas: { diplomacy: -8, stress: -5, health: 4 },
      },
      {
        label: '延后（拖延时间以便在会场搞分化）',
        reply: '"压下这份简报，等下午茶歇时间，我去单独找两个意志不坚定的元首谈谈。"',
        deltas: { stress: 5 },
        defer: true,
      },
    ],
  },
  {
    id: 'brief_wangz',
    source: '✉️ D.J Wangz 简报',
    title: '铁锈地带制造业回流与碳税对冲机制',
    body: '"总统，五大湖区的钢铁工人群体发来联名信，强烈要求我们在 APEC 峰会上对所有不符合我们环保标准的进口钢材课征\'反向对冲碳税\'。"',
    options: [
      {
        label: '接听（全面采纳，稳固核心基本盘）',
        reply: '"伟大的蓝领工人是我们的脊梁！Wangz，通知经贸组，下午直接把\'美国制造钢铁关税法案\'甩到全体代表的脸上！"',
        deltas: { diplomacy: 12, stress: 10, health: -6 },
      },
      {
        label: '挂断（认为时机不成熟暂缓执行）',
        reply: '"关税是世界上最伟大的词汇，但底牌要留在最后闭幕式再亮出来。"',
        deltas: { diplomacy: -5, stress: -2, health: 5 },
      },
      {
        label: '延后（让经贸智囊团润色措辞）',
        reply: '"让那帮高薪雇来的经济学家把加税的措辞写得更像是多边共赢一点。"',
        deltas: { stress: 3 },
        defer: true,
      },
    ],
  },
  {
    id: 'brief_pentagon',
    source: '✉️ 五角大楼简报',
    title: '亚太生物安全防线与防御供应链评估',
    body: '"紧急密函：峰会主场周边发现不明来源的数据流量波动，可能涉及针对防御战略供应链的定向网络滋扰，建议提升安全戒备。"',
    options: [
      {
        label: '接听（启动最高级别反制授权）',
        reply: '"命令我们的网络部队立刻进行对等威慑！没有人能在大国元首睡觉的时候搞小动作，没有人！"',
        deltas: { diplomacy: 15, stress: 22, health: -12 },
      },
      {
        label: '挂断（斥其大惊小怪破坏午休气氛）',
        reply: '"这只是一场低级的技术故障。别用这种科幻小说里的东西打扰我的二十分钟健康恢复。"',
        deltas: { diplomacy: -10, stress: -5, health: 6 },
      },
      {
        label: '延后（交给现场特勤局线下排查）',
        reply: '"让现场的特工便衣去机房看看，这种小事别来烦我。"',
        deltas: { stress: 4 },
        defer: true,
      },
    ],
  },
]
