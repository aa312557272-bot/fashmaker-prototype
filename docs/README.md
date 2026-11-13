# FashMaker 商品内容创作原型文档

本目录记录最新原型的页面字段、任务状态、历史、资产归档与开发交付。文档统一链接到本仓库 `main` 分支，不再使用旧 Gist 副本；原型链接指向同步后的 GitHub Pages。最近更新：2026-11-13。

当前 HTML 为静态交互演示，使用本机浏览器存储，不调用真实 AI 服务。开发文档中的正式服务目标不代表已上线。

| 功能 | 最新开发 / 流程文档 | 最新原型 |
| --- | --- | --- |
| 商品详情长图 | [detail-page-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/detail-page-flow.md) | [index.html](https://aa312557272-bot.github.io/fashmaker-prototype/index.html?v=20261110-layout-4) |
| 商品套图 | [product-suite-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/product-suite-flow.md) | [product-suite.html](https://aa312557272-bot.github.io/fashmaker-prototype/product-suite.html?v=20261110-layout-4) |
| AI 换装 / 改姿势 / 多模特 / 多商品 | [ai-tryon-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/ai-tryon-flow.md) | [ai-tryon.html](https://aa312557272-bot.github.io/fashmaker-prototype/ai-tryon.html?v=20261110-layout-4) |
| 穿搭分离 | [outfit-separation-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/outfit-separation-flow.md) | [outfit-separation.html](https://aa312557272-bot.github.io/fashmaker-prototype/outfit-separation.html?v=20261110-layout-4) |
| 图文笔记 Agent | [graphic-notes-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/graphic-notes-flow.md) | [graphic-notes.html](https://aa312557272-bot.github.io/fashmaker-prototype/graphic-notes.html?v=20261110-layout-4) |
| 数字人口播 | [digital-human-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/digital-human-flow.md) | [digital-human.html](https://aa312557272-bot.github.io/fashmaker-prototype/digital-human.html?v=20261110-layout-4) |
| 商品生视频 | [product-video-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/product-video-flow.md) | [product-video.html](https://aa312557272-bot.github.io/fashmaker-prototype/product-video.html?v=20261110-layout-4) |
| 爆款复刻 · 结构复刻 | [viral-remix-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/viral-remix-flow.md) | [viral-remix.html](https://aa312557272-bot.github.io/fashmaker-prototype/viral-remix.html?v=20261110-layout-4) |
| 批量生图 | [batch-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/batch-flow.md) | [batch.html](https://aa312557272-bot.github.io/fashmaker-prototype/batch.html?v=20261110-layout-4) |
| 店铺管理 · 小红书导入与回写演示 | [shop-management-flow.md](shop-management-flow.md) | [shop-management.html](../shop-management.html) |
| 资产库与商品库 | [asset-library-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/asset-library-flow.md) | [asset-library.html](https://aa312557272-bot.github.io/fashmaker-prototype/asset-library.html?v=20261110-layout-4) |
| 账户中心 · 积分 / 订单 / 多团队成员 | [account-center-flow.md](account-center-flow.md) | [账户中心](../account-center.html?tab=credits) |
| 自定义图片 / 视频 / 文案模型 | [custom-models-development.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/custom-models-development.md) | [模型管理](https://aa312557272-bot.github.io/fashmaker-prototype/model-management.html?v=20261112-model-management) |

自定义模型的[配置流程](custom-models-flow.md)、[完整字段与接口规格](custom-models-development.md)及[JSON Schema](contracts/custom-model-config.schema.json)为同一交付，完整规格包含 30 条验收用例。图片、视频、文案分别可设平台或某个自配模型为默认；有选择框使用本次选择，无选择框采用该类型默认。

[开发字段字典与结果归档规则](developer-field-contract.md)是全功能字段枚举、默认值、条件显示与商品结果关联的统一入口。自定义模型正式服务以完整规格为准；本机测试 Key、格式检查和演示选择不等于真实模型接入。

## 价格体系与个人菜单独立交付（2026-11-13）

| 独立文档 | 交付范围 |
| --- | --- |
| [价格体系与套餐权益](pricing-system.md) | 月付/年付/积分包三Tab、会员价格、完整权益、积分包与待定项 |
| [个人菜单与账户中心](personal-menu-flow.md) | 菜单入口、多团队切换、积分/订单/成员、派送积分及记录 |

[旧混合文档](account-membership-flow.md)仅保留兼容导航，不再作为重复口径来源。[账户中心实现说明](account-center-flow.md)及[字段契约](developer-field-contract.md)继续保留精确数据定义。

## 共同交互原则

1. 所有页面使用统一侧栏，品牌、216px宽度、菜单顺序及底部账号区一致，仅当前功能高亮变化。已移除顶部横向快捷导航。
2. 模型选择统一位于设置末尾、生成操作之前。保存的图片/视频配置全部加入对应类型功能下拉，文案默认用于没有选择框的写作与分析入口；当前原型只按类型演示，正式服务还需能力校验和服务端鉴权。
3. 当前任务占据右侧工作区；历史通过「历史」抽屉查看。新建清空本次输入与商品关联；历史再次生成复制为新任务，不覆盖旧记录。
4. 历史保存完整输入、素材、生成内容与结果。图文笔记例外：仅保存结果版本、必要模型元信息、关联和发布状态，不保存对话或输入快照。
5. 已引用商品的结果通过稳定 productId 同时进入资产库「AI生成」和该商品详情；纯上传只进入「AI生成」。
6. 详情长图输出一张完整长图；商品套图逐张输出；穿搭分离输出一张完整平铺合集图。批量至少三个商品任务，二次确认后直接生图。
7. 页面使用预设文字、图片或本地素材演示；不宣称真实模型调用、云端持久化或真实发布。穿搭分离可以下载完整 PNG 示例，图文笔记可以下载结果 JSON。

## 数据归属与存储

| 数据 | 展示位置 | 当前演示存储 |
| --- | --- | --- |
| 当前输入与未提交草稿 | 各创作设置区 | 页面内状态 |
| 单品任务、图文笔记结果 | 对应功能历史抽屉 | 本机 IndexedDB，部分功能本地存储回退 |
| 批次与子任务 | 批量生图历史 | 本机 localStorage |
| 生成图片 / 视频演示项 | 资产库「AI生成」与关联商品详情 | 本机 localStorage |
| 商品信息与关联素材 | 资产库「商品」 | 本机 localStorage |
| 账户空间 / 积分流水 / 订单 / 成员与邀请 | 账户中心与头像菜单 | 本机 localStorage `fashmaker-account-center-v1`，仅演示 |
| 自定义模型元数据 / 测试 Key | 模型配置 | localStorage / 当前标签页 sessionStorage；仅测试，不用于生产密钥 |

正式服务需要后端任务、对象存储、密钥加密和空间权限，完整接入规范见自定义模型开发文档。

## 后台提示词与专项交付

- [数字人口播提示词 v1.2](digital-human-prompt.md)：商品文字、口播三方案、人物与内容包装；[完整历史与原文件](digital-human-flow.md#8-完整历史详情与原文件本次修订)。
- [穿搭分离提示词](outfit-separation-prompt.md)：可复制提示词、输入输出、版本与效果验收。
- [图文笔记提示词 v1.0](graphic-notes-prompt.md)：文字与配图要求；历史仅保存结果的规则见[流程](graphic-notes-flow.md)。
- [自定义模型 JSON Schema](contracts/custom-model-config.schema.json)：类型与字段校验；跨字段、安全、能力及租户规则仍由服务端校验。

基于用户素材和后台预设提示词的图片/视频功能，规则变更须同步对应 `*-prompt.md`。自定义模型接入沿用业务提示词，不单独改变生成内容规则。

## 店铺发布接入研究（2026-11-11）

[微信小店整套文档阅读与 FashMaker 接入结论](wechat-shop-integration-research.md)及[逐页阅读索引](wechat-shop-docs-index.json)记录官方能力、服务商准入、素材处理、动态类目规则、草稿与线上版本、发布状态及未核实边界。本次为研究交付，未接入真实发布，未改变现有生成规则。

[小红书店铺全目录阅读与 FashMaker 接入研究](xiaohongshu-integration-research.md)及[逐页来源索引](xiaohongshu-docs-index.json)：对照旧大学文档、用户提供的Apifox目录和当前电商开放平台，记录新版接口、授权类目、素材、SKU状态及版本差异。仅研究交付，无真实发布。

### 小红书单平台上架开发规格

[小红书店铺发布接入：流程、字段与开发规格](xiaohongshu-publishing-development.md)独立说明服务商准入、商家授权、多店铺、官方接口、字段映射、发布/更新流程、五张流程图及32条验收。属于待开发方案，当前HTML无真实发布能力。

小红书规格已更新至 **v1.1**：新增授权店铺选品/全店导入、来源素材及SKU映射、刷新冲突和原商品回写，第9节给出同步全流程。仍为待开发方案，无真实同步。

## 店铺管理 Demo 已接入（2026-11-11）

[当前交互流程](shop-management-flow.md)覆盖模拟连接、选品/全店导入、来源筛选、标题描述差异、图片新品发布/原商品回写与记录；[正式开发规格](xiaohongshu-publishing-development.md)仍描述待接入的真实服务目标。当前以本机示例链接和单规格模拟，不调用小红书接口、不下载真实商品原文件。全站管理区域新增店铺管理，窄屏保留入口。

## 商品详情独立页（2026-11-11）
商品库点击直接进入 [product-detail.html](../product-detail.html)（需携带 product ID，通常从商品库进入）；新增商品资料、SKU、履约、发布按钮及状态历史。交互与实现边界见 [product-detail-flow.md](product-detail-flow.md)，统一字段见字段字典末节。平台类目及物流仍为本地示例配置。

商品列表已补充发布状态列、卡片状态、发布/更新/重发操作及发布状态筛选，详见 [资产库流程](asset-library-flow.md)。所有状态均为本地模拟记录。


## 模型管理页面（2026-11-12）

[模型管理原型](https://aa312557272-bot.github.io/fashmaker-prototype/model-management.html?v=20261112-model-management)已补齐图片/视频/文案页签、平台/自定义列表、搜索及筛选、详情、默认模型、启停、添加/编辑/删除、检查及试生成流程。[交互与本地字段](model-management-flow.md)、[试生成提示词与边界](model-management-prompt.md)和[正式开发规格](custom-models-development.md)分别说明已实现演示与待接入服务。文案已支持自配模型和独立默认设置。

## 个人菜单与会员充值（2026-11-12）

全站头像展开个人菜单，充值打开三版本会员弹窗，新增「自定义模型版」：免费、创作功能开放、不含团队管理、不赠送积分，点击「去配置模型」进入现有模型管理页。[交互与验收](account-membership-flow.md)说明套餐示例、窄屏、键盘和静态演示边界。

## 模型默认选择 v1.1（2026-11-12）

模型管理顶部三类默认卡片可选平台或某个已启用自配模型，生成选择框保留全部同类型配置；无选择框的文案、分析、脚本、AI 参考图自动取对应默认。启停、删除与已有草稿规则见[模型管理流程](model-management-flow.md)和[字段契约](developer-field-contract.md)。[本地三类模型与默认路由 Schema](contracts/local-model-routing.schema.json)仅用于演示存储，正式接入边界见[开发规格 v1.1](custom-models-development.md#v11-三类默认与文案接入扩展2026-11-12)。

## 套餐精简（2026-11-13）

充值弹窗保留免费自定义模型版，付费改为个人版 ¥999/年和团队版 ¥1999/年。团队版比个人版多团队管理与更多积分，其他权益一致；积分数量待定，不沿用旧额度和折扣。详见[套餐与交互 v1.1](account-membership-flow.md)。

套餐卡片列出9项创作功能与店铺管理，单列团队管理差异；不展示首页、资产库、创作记录、设置和模型管理。见[套餐清单 v1.3](account-membership-flow.md)。

套餐已按补充截图增加4项独家功能和2项其他权益（1v1专属客服、去除品牌水印），保留核心功能清单，个人版仍不含团队管理。见[权益 v1.4](account-membership-flow.md)。

套餐 v1.5 已移除创作工具「魅力画布」条目，保留独家功能「无限画布全部组件」，其他权益不变。

## 购买方式Tab（2026-11-13）

充值弹窗新增按月、按年、充值积分包三个Tab，默认按年；已确认年费不变，月付价格待定，积分包按参考图四档演示。无真实支付或余额变更。见[会员流程 v1.7](account-membership-flow.md)。

## 账户中心与多团队（2026-11-13）

头像菜单新增积分明细，充值记录更名订单明细，打开独立[账户中心](../account-center.html?tab=credits)的积分、订单、成员三个页签。当前团队支持个人及多个团队切换、创建和成员管理；每团队可创建待加入邀请，显式模拟接受，不发送真实邮件。积分流水同时展示消费、退款、充值、赠送和邀请好友奖励，新增成员字段。完整[交互、数据和验收](account-center-flow.md)。

共享本地存储fashmaker-account-center-v1，首次提供个人及两个团队示例；菜单余额改由当前空间流水计算，替代旧固定0。当前创建的团队为团队版演示空间，个人和自定义套餐仍不含团队管理；没有真实付款、奖励或会员开通。原有商品、资产和模型配置尚未因切换实现团队租户隔离。

账户中心已补充个人向团队「派送积分」及「派送记录」：个人支出与团队收入按同一派送单号关联，仅本机模拟，两侧余额同步；不产生付款订单。见[派送流程 v1.1](account-center-flow.md#8-个人向团队派送积分v112026-11-13)。

账户中心操作已收敛：充值/升级、派送记录、派送积分仅保留在积分明细页；成员管理和订单明细移除相关入口。

头像菜单当前团队行已改为右侧「切换」文案，点击直接进入成员管理页，在页面顶部选择框切换团队。
