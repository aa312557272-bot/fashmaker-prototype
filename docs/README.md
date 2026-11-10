# FashMaker 商品内容创作原型文档

本目录记录最新原型的页面字段、任务状态、历史、资产归档与开发交付。文档统一链接到本仓库 `main` 分支，不再使用旧 Gist 副本；原型链接指向同步后的 GitHub Pages。最近更新：2026-11-10。

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
| 资产库与商品库 | [asset-library-flow.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/asset-library-flow.md) | [asset-library.html](https://aa312557272-bot.github.io/fashmaker-prototype/asset-library.html?v=20261110-layout-4) |
| 自定义图片 / 视频模型 | [custom-models-development.md](https://github.com/aa312557272-bot/fashmaker-prototype/blob/main/docs/custom-models-development.md) | [模型配置入口](https://aa312557272-bot.github.io/fashmaker-prototype/index.html?modelSettings=1&v=20261110-layout-4) |

自定义模型的[配置流程](custom-models-flow.md)、[完整字段与接口规格](custom-models-development.md)及[JSON Schema](contracts/custom-model-config.schema.json)为同一交付，完整规格包含 30 条验收用例。文字固定使用 FashMaker 平台模型，客户只配置图片和视频模型。

[开发字段字典与结果归档规则](developer-field-contract.md)是全功能字段枚举、默认值、条件显示与商品结果关联的统一入口。自定义模型正式服务以完整规格为准；本机测试 Key、格式检查和演示选择不等于真实模型接入。

## 共同交互原则

1. 所有页面使用统一侧栏，品牌、216px宽度、菜单顺序及底部账号区一致，仅当前功能高亮变化。已移除顶部横向快捷导航。
2. 模型选择统一位于设置末尾、生成操作之前。保存的图片/视频配置分别加入对应功能下拉；当前原型只按类型演示，正式服务还需能力校验和服务端鉴权。
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
| 自定义模型元数据 / 测试 Key | 模型配置 | localStorage / 当前标签页 sessionStorage；仅测试，不用于生产密钥 |

正式服务需要后端任务、对象存储、密钥加密和空间权限，完整接入规范见自定义模型开发文档。

## 后台提示词与专项交付

- [数字人口播提示词 v1.2](digital-human-prompt.md)：商品文字、口播三方案、人物与内容包装；[完整历史与原文件](digital-human-flow.md#8-完整历史详情与原文件本次修订)。
- [穿搭分离提示词](outfit-separation-prompt.md)：可复制提示词、输入输出、版本与效果验收。
- [图文笔记提示词 v1.0](graphic-notes-prompt.md)：文字与配图要求；历史仅保存结果的规则见[流程](graphic-notes-flow.md)。
- [自定义模型 JSON Schema](contracts/custom-model-config.schema.json)：类型与字段校验；跨字段、安全、能力及租户规则仍由服务端校验。

基于用户素材和后台预设提示词的图片/视频功能，规则变更须同步对应 `*-prompt.md`。自定义模型接入沿用业务提示词，不单独改变生成内容规则。
