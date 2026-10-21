# FashMaker 商品内容创作原型文档

本目录以当前可交互原型为准，记录页面字段、任务状态、历史与资产库衔接，以及可验收的交互规则。原型使用演示内容模拟 AI 生成；文档中的“应”描述产品预期，“当前原型”说明已实现的演示边界。

| 功能 | 文档 | 原型 |
| --- | --- | --- |
| 商品详情长图 | [detail-page-flow.md](detail-page-flow.md) | [index.html](https://aa312557272-bot.github.io/fashmaker-prototype/index.html) |
| 商品套图 | [product-suite-flow.md](product-suite-flow.md) | [product-suite.html](https://aa312557272-bot.github.io/fashmaker-prototype/product-suite.html) |
| 商品生视频 | [product-video-flow.md](product-video-flow.md) | [product-video.html](https://aa312557272-bot.github.io/fashmaker-prototype/product-video.html) |
| 批量生图 | [batch-flow.md](batch-flow.md) | [batch.html](https://aa312557272-bot.github.io/fashmaker-prototype/batch.html) |
| 资产库与商品库 | [asset-library-flow.md](asset-library-flow.md) | [asset-library.html](https://aa312557272-bot.github.io/fashmaker-prototype/asset-library.html) |

## 共同交互原则

1. 当前任务始终占据创作页面右侧工作区。历史记录只在点击顶部「历史」后以抽屉出现。
2. 单品任务生成完成后可直接查看本次结果，点击「新建」开始下一次；历史中的「以此任务再次生成」将快照复制成新任务。
3. 历史保存任务字段、输入素材、提示词或分镜与结果预览；资产库「AI生成」保存按件浏览的结果素材记录。
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
