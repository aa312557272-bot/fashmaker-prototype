# FashMaker 商品内容创作原型文档

本目录以当前可交互原型为准，记录页面字段、任务状态、历史与资产库衔接，以及可验收的交互规则。原型使用演示内容模拟 AI 生成；文档中的“应”描述产品预期，“当前原型”说明已实现的演示边界。

| 功能 | 文档 | 原型 |
| --- | --- | --- |
| 商品详情长图 | [detail-page-flow.md](https://gist.github.com/aa312557272-bot/d6c17fa4a4b7d57e34b2b97ca6f71d84#file-detail-page-flow-md) | [index.html](https://aa312557272-bot.github.io/fashmaker-prototype/index.html) |
| 商品套图 | [product-suite-flow.md](https://gist.github.com/aa312557272-bot/d6c17fa4a4b7d57e34b2b97ca6f71d84#file-product-suite-flow-md) | [product-suite.html](https://aa312557272-bot.github.io/fashmaker-prototype/product-suite.html) |
| AI 换装 / 改姿势 / 多模特 / 多商品 | [ai-tryon-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/ai-tryon-flow.md) | [ai-tryon.html](https://aa312557272-bot.github.io/fashmaker-prototype/ai-tryon.html) |
| 图文笔记 Agent | [graphic-notes-flow.md](graphic-notes-flow.md) | [graphic-notes.html](https://aa312557272-bot.github.io/fashmaker-prototype/graphic-notes.html) |
| 数字人口播 | [digital-human-flow.md](digital-human-flow.md) | [digital-human.html](https://aa312557272-bot.github.io/fashmaker-prototype/digital-human.html) |
| 商品生视频 | [product-video-flow.md](https://gist.github.com/aa312557272-bot/d6c17fa4a4b7d57e34b2b97ca6f71d84#file-product-video-flow-md) | [product-video.html](https://aa312557272-bot.github.io/fashmaker-prototype/product-video.html) |
| 爆款复刻 · 结构复刻（可开发说明） | [viral-remix-flow.md](https://gist.github.com/aa312557272-bot/d6c17fa4a4b7d57e34b2b97ca6f71d84#file-viral-remix-flow-md) | [viral-remix.html](https://aa312557272-bot.github.io/fashmaker-prototype/viral-remix.html) |
| 批量生图 | [batch-flow.md](https://gist.github.com/aa312557272-bot/d6c17fa4a4b7d57e34b2b97ca6f71d84#file-batch-flow-md) | [batch.html](https://aa312557272-bot.github.io/fashmaker-prototype/batch.html) |
| 资产库与商品库 | [asset-library-flow.md](https://gist.github.com/aa312557272-bot/d6c17fa4a4b7d57e34b2b97ca6f71d84#file-asset-library-flow-md) | [asset-library.html](https://aa312557272-bot.github.io/fashmaker-prototype/asset-library.html) |

[开发字段字典与结果归档规则](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/developer-field-contract.md)列出所有页面的精确选项、默认值与商品结果关联规则。

## 共同交互原则

1. 当前任务始终占据创作页面右侧工作区。历史记录只在点击顶部「历史」后以抽屉出现。
2. 单品任务生成完成后可直接查看本次结果，点击「新建」开始下一次；历史中的「以此任务再次生成」将快照复制成新任务。
3. 历史保存任务字段、输入素材、提示词或分镜与结果预览；每项生成结果进入资产库「AI生成」，引用商品库商品时还进入对应商品详情素材区。
4. 批量任务从详情长图或套图页面进入；至少 3 个商品任务，二次确认后直接生图。批次历史按批次和商品任务两级查看。
5. 当前 HTML 原型不调用真实生成模型；结果、下载和视频播放能力需在产品开发阶段接入真实服务。

## 数据归属

| 数据 | 应展示位置 | 原型持久化方式 |
| --- | --- | --- |
| 当前编辑内容 | 各创作页左侧 | 页面内状态 |
| 已完成单品任务 | 对应创作页历史抽屉 | 本机浏览器 IndexedDB，必要时本地存储回退 |
| 已提交批次任务 | 批量页生图历史 | 本机浏览器本地存储 |
| 生成后的图片 / 视频演示项 | 资产库「素材 → AI生成」 | 本机浏览器本地存储 |
| 商品标题、描述、卖点、关联素材 | 资产库「商品」 | 本机浏览器本地存储 |

这些存储方式仅用于原型演示；上线时应统一由服务端任务与资产模型管理。


## 后台提示词文档

- [数字人口播 · 后台提示词](digital-human-prompt.md)：商品文字生成、口播三方案、三种人物来源、我的声音、AI 人物参考图与内容包装提示词，版本 v1.2。


同类基于用户素材和后台预设提示词的图片或视频功能，均需同步交付独立提示词 Markdown 文档，并随需求修改更新。

数字人口播历史现按原上传文件、创作输入、生成内容、内容包装、分发设置及历次生成记录分区展示。新上传文件保留原始字节供本机下载；旧记录仅有预览时明确说明。完整规则见 [数字人口播历史说明](digital-human-flow.md#8-完整历史详情与原文件本次修订)。

- [图文笔记 Agent · 后台提示词](graphic-notes-prompt.md)：完整对话生成与配图提示词，v1.0；直接工作台入口、三种预览、版本、历史及模拟发布见[流程](graphic-notes-flow.md)。

图文笔记例外：按用户修订，历史仅保存图文结果及必要关联、时间与发布状态，不保存对话、生成要求和输入素材快照，旧历史自动清理上述输入字段；其他功能仍沿用完整任务历史。


## 自定义模型正式开发交付（v1.0）

- [完整开发规格](custom-models-development.md)：字段、条件校验、空间权限、适配协议、HTTP接口、任务状态、幂等重试、密钥管理、结果归档及30条验收用例。
- [配置流程与原型边界](custom-models-flow.md)。
- [JSON Schema](contracts/custom-model-config.schema.json)：创建/编辑配置、能力、模型选择和生成请求的数据校验。

文字继续使用FashMaker平台模型，仅开放客户图片/视频模型。正式开发以完整规格为准。本文档中的“当前原型”指本机已更新演示版本；本次只同步开发文档，GitHub现有HTML不代表这些目标已完成。正式服务使用后端安全存储和版本化适配器，不使用浏览器保存生产密钥。
