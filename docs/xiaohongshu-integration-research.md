# FashMaker × 小红书店铺：全目录阅读与接入结论

版本 v1.0｜核查日期 2026-11-11｜研究与开发建议，尚未接入真实店铺。

## 1. 来源、范围和阅读边界

本次同时检查三套公开资料：

| 来源 | 取得范围 | 定位 |
| --- | --- | --- |
| 用户提供的 school.xiaohongshu.com/en/open | 扩展检查中英文及正文内链接共127个URL，61篇有正文，63个为空、3个旧链接访问失败 | 旧版模型、状态语义和历史背景 |
| 用户提供的 xiaohongshu.apifox.cn | llms.txt列出的114个文档/API/模型页面均取得Markdown | 易读的接口与消息文档参考，不能假定总是最新 |
| open.xiaohongshu.com | 当前公开目录11个API分类的111个接口详情、37篇开发文档全部取得 | 当前电商接入的主要依据 |

上述是公开目录范围，不等于所有登录后可见、定向准入、广告、小程序或社区接口。全目录梳理了用途；核心授权、应用权限、商品、类目、素材和消息进行了重点精读；订单、售后、结算等未逐字段联调。图片流程图未逐图识别。未调用真实店铺业务接口，更未发布商品。

[逐页阅读索引](xiaohongshu-docs-index.json)记录来源、URL、读取结果及新版接口元信息。原始文档仅作本机阅读缓存，不把全站原文复制进仓库。

## 2. 对 FashMaker 的直接结论

可以设计“授权店铺商品同步 → 内容创作 → 新品发布/更新已有商品 → 上下架与状态跟踪”。首期宜聚焦普通实物现货、单店单商品、主图/详情图/主图视频，不把订单履约扩为首期。

FashMaker 已有内部商品标题、描述、卖点及关联素材，可复用为内容候选；但类目、品牌、规格、价格、库存、条形码、物流与资质须补齐并由用户确认。图片上的外观不能证明材质、认证或经营授权。

商品发布接口不是图文笔记发布接口；上传到素材中心不是发布笔记；商品主图视频不是短视频作品发布。此次阅读没有证明 FashMaker 可通过这些接口自动发布种草笔记或给笔记挂品。

## 3. 应用类型是首要门槛

当前官方“应用开发”权限表中，图片工具只有授权接口、公共接口；商品优化/一键搬家则包含商品、库存、素材及商品消息等能力。FashMaker 若要写回店铺，不应仅凭自己是AI图片工具就申请“图片工具”并假定有发品权限。

建议以“商品优化”为主要业务描述：商品图片与主图视频制作、完整度检查、商品编辑及发布；若侧重跨平台采集铺货，则核实“一键搬家”。实际可获权限取决于平台审核。[官方应用开发](https://open.xiaohongshu.com/document/developer/file/33)。

SaaS 应申请第三方开发者身份。商家自研模式对授权主体和店铺有限制，不能借其AppKey给不相关商家提供服务。[自研授权](https://open.xiaohongshu.com/document/developer/file/341)。

服务商授权文档要求应用上线、注册服务并完成测试授权；商家主账号授权后回调code，服务端换取Token。服务可采用“仅分享链接可见”或“服务市场公开可见”等展示方案。[三方服务商新版授权](https://open.xiaohongshu.com/document/developer/file/342)。

服务市场还涉及资质、服务审核和保证金等要求，公开规则含历史生效时间，不将旧阈值直接当作2026年确定准入承诺；申请前以控制台及官方审核确认为准。[发布服务](https://open.xiaohongshu.com/document/developer/file/43)、[商品管理类目规则](https://open.xiaohongshu.com/document/developer/file/107)。

## 4. 授权与服务端协议

当前电商文档使用统一网关 `https://ark.xiaohongshu.com/ark/open_api/v3/common_controller`，POST JSON携带appId、timestamp、version、method、sign及商家业务accessToken。不能把接口详情中 `/ark/product.xxx` 的展示路径直接当业务调用URL，也不能将本体系与社区账号登录开放平台混用。[系统参数](https://open.xiaohongshu.com/document/developer/file/40)。

签名规则按系统参数排序、拼接method与appSecret计算MD5；不能照旧大学文档的header签名方式调用新版。appSecret及Token只在服务端管理。[签名算法](https://open.xiaohongshu.com/document/developer/file/39)。

Token需按返回的accessTokenExpiresAt、refreshTokenExpiresAt维护并发刷新与轮换；过期时间字段是毫秒，系统timestamp是秒。新版文档说明接近过期时的刷新才会轮换，不能假定每次刷新都会产生新Token。[新版授权](https://open.xiaohongshu.com/document/developer/file/342)。开发建议：state签名绑定登录用户/空间、防CSRF；日志脱敏；授权取消或失效后阻断发布并要求重连。

## 5. 新商品与已有商品

### 新品创建

优先验证当前官方目录的 `product.createItemAndSku`（API ID 38757）：一次提交商品内容和createSkuList。必填结构包括name、categoryId、images、shippingTemplateId及SKU列表；品牌与属性等还受类目要求限制。不要把“Schema未列必填”理解为所有类目都可省略。[新版创建](https://open.xiaohongshu.com/document/api?apiId=38757&apiNavigationId=305&gatewayId=103&gatewayVersionId=1661&id=108&apiParentNavigationId=17)。

SKU承载价格、库存、规格、物流方案、发货时间等信息；售价及市场价以分处理。部分品类需要条形码。UI可用元显示，但后端用整数分和明确转换，不复用旧接口浮点元价格习惯。

### 商品内容更新

新版 `product.updateItemAndSku`（38758）有createSkuList、updateSkuList、deleteSkuIdList，应明确区分新增/修改/删除SKU，并传入已有未删除SKU；先读取当前版本再合并，不能从FashMaker的简化商品卡直接重建覆盖线上商品。[新版更新](https://open.xiaohongshu.com/document/api?apiId=38758&apiNavigationId=306&gatewayId=103&gatewayVersionId=1661&id=109&apiParentNavigationId=17)。

只改主图或主图视频时，可验证 `product.updateItemImage`（27225）：图片列表全量覆盖，视频取第一个。预览需展示最终全部主图顺序，避免用户以为只追加一张。[修改主图](https://open.xiaohongshu.com/document/api?apiId=27225&apiNavigationId=233&gatewayId=103&gatewayVersionId=1661&id=75&apiParentNavigationId=17)。详情图、标题等不能假定由此接口更新。

## 6. 素材与动态类目

`material.uploadMaterial`接受IMAGE/VIDEO，通过字节文件序列化编码上传；返回materialId、url及status。不要直接把当前浏览器blob:地址、演示SVG或视频封面作为可上传的视频文件。视频/大文件应核实当前大小、格式和传输限制，本次未找到足以统一承诺的完整限制表，不套用微信小店限额。[上传素材](https://open.xiaohongshu.com/document/api?apiId=14416&apiNavigationId=238&gatewayId=103&gatewayVersionId=1661&id=80&apiParentNavigationId=19)。

素材上传可能处于上传中或失败，需查询material.queryMaterial确认可用再发布。FashMaker保留自有assetId、原文件、内容版本与平台映射；素材中心URL不替代内部资产模型。

类目依次用common.getCategories获取叶子，common.getVariations获取规格，common.getAttributeLists/getAttributeValues获取属性及值。当前属性接口包含必填、多选、自定义、单位、正则及条件联动/隐藏等信息，需要动态表单，不能仅写死“颜色/尺码”。[类目属性](https://open.xiaohongshu.com/document/api?apiId=5749&apiNavigationId=56&gatewayId=103&gatewayVersionId=1661&id=3&apiParentNavigationId=14)。

当前目录推荐common.categoryMatchV2，而旧categoryMatch注明迁移。类目预测只作候选，不能代表商家有资质。另有违禁词检查接口，可作为发布辅助，不是完整合规或审核保证。

## 7. 状态与事件

用户给的旧状态页揭示了重要语义：不同实体的status含义不同，pending_changes还拥有独立状态；不能统一把status=2解释为已在售。available是商家上架意愿，buyable才是实际可售标志。[旧状态页](https://school.xiaohongshu.com/en/open/product/product-status.html)、[旧上下架语义](https://school.xiaohongshu.com/en/open/product/availability.html)。这些只作历史模型参考，不原样当新版枚举。

当前product.updateSkuAvailable在SKU维度设置available；详情查询返回skuInfos中的buyable。UI需分开展示“提交结果/内容审核”“商品/规格可售状态”“同步状态”，最终状态通过当前查询与消息验证。

消息接入需配置推送开关、地址并订阅，且商家授权和Token有效。服务端应验签并迅速持久化入队，按文档2秒应答要求处理，业务异步执行；多次重试仍不能取代主动对账。[应用消息推送](https://open.xiaohongshu.com/document/developer/file/41)。

Apifox还有商品新建、上下架、审核驳回、删除的独立消息页。与官方综合指南存在item/sku事件命名差异，不把任一历史示例写成唯一枚举；按控制台实际订阅类型及联调消息确认。[Apifox消息目录](https://xiaohongshu.apifox.cn/llms.txt)。

开发建议：用workspaceId、sellerId、内部productId、平台itemId与skuId建立关联；发布快照不可变。超时先查询确认，避免重复创建；未发现这些接口提供可直接依赖的通用幂等键，不作平台幂等承诺。

## 8. 三套文档的版本差异

| 项目 | 观察到的差异 | 开发处理 |
| --- | --- | --- |
| 旧大学目录 | 历史记录止于2018，包含SPU/SPL/SPV分层与旧REST路径 | 不直接用于新应用实现 |
| Apifox目录覆盖 | 114项中未列出新版createItemAndSku/updateItemAndSku | 读起来方便，但不能替代当前官方目录 |
| 主图更新method | Apifox示例mock为product.updateSpuImage；官方目录为product.updateItemImage | 使用官方当前方法并联调，不复制mock |
| 官方目录自身 | 创建ITEM导航写V2/即将废弃，详情path写V3；部分schema有类型或结构异常 | 新功能优先新合并接口；保留差异记录，测试环境确认 |
| 属性规则类型 | 官方描述中部分字段注明“忽略前参数类型”，实际为字符串列表 | 以字段说明和真实响应校验，不盲信生成Schema |
| 授权流程 | Apifox是较早流程；官方有新版三方授权前提与刷新细则 | 当前官方342为主要依据 |
| 消息名称 | 综合指南与独立消息页存在item/sku层级差异 | 控制台订阅+实际通知核对 |

本次未发现足够证据确认Apifox站点发布者身份；将其作为用户指定的参考文档，不仅凭“小红书API”站名宣称为官方唯一最新文档。[Apifox首页](https://xiaohongshu.apifox.cn/)。

## 9. 全目录能力图谱

当前公开API分组：公共20、商品15、素材4、库存11、订单26、售后8、物流7、财务6、即时零售1、会员通3、供货商10，共111。开发文档37篇另含测试、授权、SDK、消息、数据加解密、电子面单及规则。

| 模块 | 对 FashMaker 的作用 |
| --- | --- |
| 授权/应用/测试/服务市场 | SaaS上线必要条件 |
| 公共/类目/品牌/属性/物流模板 | 发布配置与校验 |
| 商品/素材/商品消息 | 创作结果到店铺的核心 |
| 库存/价格 | 可选后续维护，不建立无依据自动同步 |
| 订单/售后/物流/供货商 | 后续独立业务，首期不做ERP |
| 财务/会员 | 首期无关，不能因商品授权默认可用 |
| 笔记与社区发布 | 不在本套电商接口已证实能力中 |

Apifox已读取的订单/售后/数据模型条目不表示新版全部同名接口仍可调用；索引保留每项来源与版本信息。

## 10. 建议的 FashMaker 首期方案（未实现）

商品详情“发布到店铺” → 选择小红书及目标授权店铺 → 新建或更新已关联商品 → 选择主图/详情图/可选视频 → 补齐动态类目、规格、售价、库存与物流 → 上传并确认素材可用 → 展示最终内容与SKU差异 → 用户确认 → 提交 → 查看同步/审核/可售结果。

针对现有商品内容创作，最小有价值交付为“生成后换主图”和“新商品上架”两个入口；申请权限与开发测试先行。第一期不承诺自动审核通过、自动发笔记、自动挂品或实时全店数据同步。

验收覆盖：工作空间/店铺隔离、Token过期阻断、素材上传失败、图片覆盖顺序、分元转换、规格完整性、保存线上SKU映射、异步状态不误判、重复点击与网络超时、消息重复乱序、历史快照可追溯、已删除源商品保留发布记录。

本次只交付阅读研究与索引，不修改现有HTML、生成逻辑或提示词；也不将尚未完成的1688组件称为已完成发布功能。正式原型/开发规格仍需按统一字段契约与流程文档同步交付。
