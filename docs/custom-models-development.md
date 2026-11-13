# FashMaker 自定义图片 / 视频模型开发规格

版本：v1.1 · 2026-11-12。状态：开发交付草案，依据已确认需求制定；本文新增技术默认值是本次明确的实现口径，不表示已有线上服务或供应商已经完成适配。

目标用户：使用自有供应商额度的电商商家、内容运营和工作空间管理员。需求来源为本项目最新确认：客户可配置图片、视频与文案模型；各类型独立选平台或某个自配模型为默认，全部同类型配置进入生成选项，无选择框时直接取默认；模型选择在设置末尾；所有页面使用统一侧栏。

优先级 P0。本文覆盖模型配置、能力适配、调用及结果归档这一完整功能。UI 演示见 [配置流程](custom-models-flow.md)，通用商品字段见 [开发字段契约](developer-field-contract.md)，图片/视频正式 DTO 机器校验见 [配置 JSON Schema](contracts/custom-model-config.schema.json)，其保留 v1 媒体接口范围，不校验新增文案 DTO；三类本地存储另见[路由 Schema](contracts/local-model-routing.schema.json)。本文描述正式服务开发目标，当前 HTML 仍仅本机演示。

## 1. 交付范围与决策

1. 配置归属当前工作空间，默认所有空间成员可使用，只有 owner/admin 可管理。其他空间不能列举、使用或读取配置。个人空间中的本人视为 owner。
2. 支持 `image` / `video` / `text` 三种类型。商品分析、文案、提示词与分镜等无选择框入口使用默认文案模型，AI 参考图无选择框入口使用默认图片模型。有选择框时本次选择优先。
3. 保留平台模型；提供按类型的空间默认模型，不要求每个步骤重新选择。保存模型不自动替换默认模型，也不覆盖当前任务。用户主动设为默认后只影响之后新建任务。
4. 支持明确协议的服务；不承诺任意供应商 API 可直接填写使用。不提供用户上传执行代码、任意请求模板或自定义请求头。
5. 原图片/视频契约的两个适配器为：`image-api-v1` 和 `video-gateway-v1`。前者定义本文的图片生成/编辑兼容契约；后者定义本文的视频网关契约。v1.1 文案增加 text-chat-v1，详细 DTO 见末节，仍待后端适配。二者均为 FashMaker 接入契约，不等同于任何供应商已兼容声明。供应商不符合契约时，由后端实现新的、经过验收的适配器后才能接入。
6. 自有模型费用由客户供应商结算；平台服务、存储、工作流费用沿现有套餐，不在本功能中虚构价格。提交前显示模型来源与可能产生第三方费用，不静默回退至平台或另一家服务。
7. 允许保存未测试配置；未通过连通性测试不可提交真实生成任务。能力声明和测试通过都不代表商品保真质量保证。
8. 上线不迁移浏览器中的测试密钥。现有本地元数据可通过显式导入表单带入待确认信息，必须重新填 Key、保存并测试；不自动发起网络请求。

## 2. 用户流程与页面状态

### 2.1 入口和列表

所有页面使用统一侧栏，固定「自定义模型」入口；「设置」可进入同一管理模块。窄屏保留顶部入口。弹窗或独立设置页是同一数据源，不能维护两份配置。

列表字段：配置名称、图片/视频标签、模型 ID、接口域名、启停状态、测试状态、默认标签、最近更新时间。操作：添加、编辑、测试连接、试生成、设为默认、启用/停用、删除。无数据时显示「尚未添加自定义模型，创作时使用平台模型」。分页默认 20、最大 100，按更新时间倒序、ID 逆序稳定排序。

搜索名称/模型 ID；空字符串不筛选。搜索按 trim 后不区分大小写子串匹配，不匹配 Key 或完整地址查询参数。筛选 kind、enabled、testStatus。

### 2.2 新增、编辑和密钥

新增时选择用途后只能选择相容适配器，展示相应端点和能力字段。保存前前后端都校验；保存中禁用重复点击，成功刷新列表，不自动选中该模型。取消不写入；有未保存修改时关闭需确认舍弃。保存失败保留表单，但不在日志中记录 Key。

编辑时不回显明文 Key，展示「已配置密钥」和替换输入框。留空保持现有 Key；填写非空替换。禁止提交星号掩码作为新 Key。Key 不可查看、复制或下载。只改名称不要求重测；影响调用的任何字段变化使测试状态失效。

kind 和 adapterKey 创建后不可变，需新增配置完成类型切换。配置名称允许重复；列表用类型和模型 ID 区分，业务引用始终使用配置 ID。

### 2.3 测试与试生成

「测试连接」是独立异步操作：按适配器调用只读探测端点；验证 TLS、鉴权、模型 ID 和基础协议，不发起图片/视频生成。没有探测端点时返回 `PROBE_UNSUPPORTED`，不伪造成功，提供显式试生成。

「试生成」允许使用一张受控示例素材，显示来源、模型、请求数量、尺寸或时长和「会使用你的 API 额度，费用由供应商收取」。用户点击「确认试生成」后创建真实测试任务，走与正式任务相同的队列与归档流程，source=模型接入测试，productId=null。不自动提供价格估计。试生成成功可使连接状态变为 passed；失败不影响已生成文件。供应商无只读探测且不提供试生成，无法通过上线验收。

只读探测通过后还须以正式支持的素材类型做一次适配器验收；按功能的能力测试由供应商适配发布流程保障，不要求每次使用都重复收费测试。

### 2.4 创作选择和默认值

模型下拉位于设置末尾、生成说明与按钮之前；图文笔记在输入框之后、发送操作前。批量全局和单任务覆盖模型均为最后参数。禁用不相关参数时展示理由。

分组为「平台模型」「我的模型」。仅展示类型匹配、未删除且有 use 权限的配置；停用/未测试/能力不满足项显示禁用和具体原因；不可用的历史选择保留只读占位。新建任务未选择过时：优先空间默认；默认为平台时使用该功能平台默认。有自配默认但能力不满足时显示原因并要求选择可用模型，不静默切换供应商。没有选择框的步骤直接解析该类型默认并验证能力，失败时提示前往模型管理修改默认，不自动改用其他模型。已经选定后的失效不得自动换模型。

切换模型后先计算参数交集。原参数不支持时列出不兼容项，用户确认调整后才应用：比例取模型声明顺序中第一个共同值；清晰度取最低共同值；时长取最小共同值。无共同值时禁止选择。取消保留原模型和参数。模型不能修改需求要求的输出张数，模型单次只出一张时由工作流拆分调用。

新建清空任务输入与商品关联，模型回到当前默认选择规则；历史再次生成复制输入和模型快照为新 taskId，检查当前模型配置是否仍可用；配置已删除、停用或能力变化时要求重新选择。图文笔记历史仍只存结果，不恢复对话或输入。

### 2.5 编辑、停用和删除的并发行为

采用 `revision` 乐观锁；旧版本编辑返回 409，不覆盖别人修改。名称编辑只影响今后任务，旧快照保留旧名称。

停用阻止新提交，但已接受的任务继续执行；软删除同理，不能删除运行中任务仍引用的内部密钥版本。删除需二次确认，默认引用在同一事务中恢复平台默认并通知管理员；当前草稿标记失效，不静默替换。历史、资产和商品关联保留。

实时事件通知或页面回到前台重新请求列表；生成提交必须服务端再校验，不能依赖浏览器更新及时。相同任务在编辑配置期间提交，以提交时锁定的 revision 和凭证版本为准。

## 3. 字段、类型和统一约定

### 3.1 通用规则

外部 API 为 JSON、UTF-8、camelCase。ID 为 UUID 字符串；不接受客户端伪造 tenant/workspace/actor。时间为 UTC RFC3339 毫秒字符串，界面按用户时区展示。所有字符串长度按 Unicode 码点计算，数据库 utf8mb4；验证 trim 后长度，Key 除仅由空白组成外保留原始内容，不自动改变供应商凭证。数值必须是有限整数。未知字段返回 422，禁止透传到供应商。

PATCH：省略表示不改；明确 nullable 字段的 null 表示清空；其余字段 null 为 422；数组整体替换。新增请求不传系统字段。空数组只有明确允许时合法。

### 3.2 ModelConfig（持久化实体）

| 字段 | 类型 / 空值 | 来源、默认与定义 |
| --- | --- | --- |
| id | UUID，不可空 | 服务端生成，稳定关联 ID |
| workspaceId | UUID，不可空 | 登录上下文；禁止请求覆盖 |
| name | string 1–50 | 必填，trim，允许重复；仅显示，不用于路由 |
| kind | image / video / text | 必填，创建后不可改 |
| adapterKey | image-api-v1 / video-gateway-v1 / text-chat-v1 | 必填，必须与 kind 对应，创建后不可改 |
| modelId | string 1–150 | 必填，区分大小写，完整匹配供应商模型 ID |
| endpoints | EndpointSet | 必填，见 3.3 |
| capabilities | CapabilitySet | 必填，见 3.4；经适配器约束裁剪，不允许声明适配器不支持的能力 |
| generationDefaults | GenerationDefaults | 必填对象；可为 {}，见 3.5；只对新任务生效 |
| enabled | boolean | 默认 true；false 禁止新生成 |
| revision | integer ≥1 | 默认 1，每次配置写入递增，CAS 更新 |
| connectionRevision | integer ≥1 | 默认 1；调用字段变更递增，名称或 enabled 变更不递增 |
| credentialRef | string，内部 | Key 管理服务引用；任何客户端响应中禁止返回 |
| credentialVersion | integer ≥1，内部 | 密钥轮换递增，仅内部任务锁定使用 |
| credentialConfigured | boolean，只读 | 对外安全投影，是否具有有效密钥记录，不代表 Key 可调用 |
| credentialUpdatedAt | datetime/null | 密钥最近写入时间，对管理员可见 |
| testStatus | untested / testing / passed / failed | 默认 untested；按 connectionRevision 的最新测试确定 |
| lastTest | TestResult/null | 默认 null，见 3.7 |
| createdAt / updatedAt | datetime | 服务端时钟 |
| createdBy / updatedBy | UUID | 服务端当前操作者 |
| deletedAt / deletedBy | datetime/null、UUID/null | 初始 null；软删除时写入 |

kind / adapterKey / modelId / endpoints / capabilities / generationDefaults 或密钥变化均记录审计；其中除 name、enabled 外，所有可编辑字段影响 connectionRevision、使测试失效。可编辑字段仅 name、modelId、endpoints、capabilities、generationDefaults、enabled 和 apiKey。isDefault 为默认配置关系的派生字段，不存布尔避免多个默认冲突。

### 3.3 EndpointSet

| 字段 | 类型 / 约束 | 条件与说明 |
| --- | --- | --- |
| generateUrl | HTTPS URL，≤2048字符/null | image 且支持 textToImage 时必填，完整生成地址 |
| editUrl | HTTPS URL，≤2048字符/null | image 且支持 imageToImage 时必填，完整参考图编辑地址 |
| createUrl | HTTPS URL，≤2048字符/null | video 必填，创建异步任务地址 |
| statusUrlTemplate | HTTPS URL模板 ≤2048/null | video 必填，恰含一次 `{taskId}`，路径段位置；替换时 URL 编码，不能控制 host |
| cancelUrlTemplate | HTTPS URL模板 ≤2048/null | video 且 supportsCancel=true 必填，恰含一次 `{taskId}` |
| probeUrl | HTTPS URL ≤2048/null | 选填，只读探测地址；无值不支持无费用测试 |

所有请求完整使用地址，不补 `/chat/completions`、`/generations` 等路径。接口禁止 userinfo、fragment、query（供应商固定查询参数需新增适配器），端口只允许 443。全部端点必须同一规范化 origin；结果下载地址允许不同 origin，但须通过输出下载策略。图片配置不得携带视频端点，反之亦然。字段不适用用 null 或省略，服务端规范化为 null。生产仅 HTTPS；HTTP 仅隔离开发环境测试，不对客户开放。IP、内网、环回、链路本地、云元数据地址全部禁止，详见安全章节。

### 3.4 CapabilitySet（完整字段）

| 字段 | 类型 / 范围 | 默认、条件、用途 |
| --- | --- | --- |
| operations | 唯一 enum[]，至少1项 | image: textToImage / imageToImage；video: textToVideo / imageToVideo / avatarSpeech；用户必选，不自动根据名字推断 |
| inputFormats | 唯一 enum[] | image/jpeg、image/png、image/webp；需图片输入时至少1项，否则 [] |
| maxInputImages | integer 0–16 | 无图片输入须0；有则1–16；avatarSpeech 至少2 |
| maxInputImageBytes | integer 1–10485760/null | 图片输入启用必填，单文件上限；无输入为null |
| maxTotalInputImageBytes | integer 1–167772160/null | 图片输入启用必填，不小于单图上限；无输入为null |
| outputFormats | 唯一 enum[]，至少1项 | image: image/png、image/jpeg、image/webp；video: video/mp4；仅正式可归档格式 |
| ratios | 唯一 enum[]，至少1项 | 1:1、16:9、9:16、4:3、3:4、3:2、2:3、5:4、4:5、2:1、1:2、21:9、9:21、3:1、1:3；顺序是回退选择顺序，Auto 不作为供应商能力值 |
| resolutions | 唯一 enum[]，至少1项 | image: 1K、2K、4K；video: 480P、720P、1080P；按功能枚举取交集 |
| durationSeconds | 唯一 integer[] | image 为 []；video 从 10、15、30、60 中选至少1项 |
| maxOutputsPerRequest | integer 1–4 | 图片单次最大结果数；视频固定1；功能更多结果由平台拆分请求 |
| maxPromptChars | integer 1–32000 | 必填，最终提示词长度上限，超限不截断，返回参数错误 |
| supportsAudioInput | boolean | 默认false；avatarSpeech必须true；不提供任意音频服务配置 |
| maxAudioBytes | integer 1–20971520/null | audio输入支持时必填，否则null；正式音频格式 audio/mpeg、audio/wav，最长60秒 |
| supportsNativeAudio | boolean | 默认false，仅video；供应商能随视频生成声音；不能替代口型同步能力 |
| supportsCancel | boolean | 默认false，仅video；true要求cancelUrlTemplate |
| supportsIdempotency | boolean | 默认false，适配器/服务商保证同请求键不重复创建收费任务；不能仅客户勾选，需要服务端适配器认证 |

能力配置由管理员提交，仍受 adapter registry 的上限和允许值约束；只有供应商协议验收通过的组合可被发布。UI 不暴露「强行兼容」开关。图片输入与图片生成是不同能力，不提供聊天模型的“工具调用/思考强度/Token输入输出”字段。

### 3.5 GenerationDefaults

| 字段 | 类型 | 规则 |
| --- | --- | --- |
| ratio | ratio enum，选填 | 必须在 capabilities.ratios 中 |
| resolution | resolution enum，选填 | 必须在 capabilities.resolutions 中 |
| durationSeconds | integer，选填 | 仅video；必须在durationSeconds能力列表内 |
| outputCount | integer，选填 | image 1–4、video固定1；属于配置试生成默认，不覆盖套图数量或批量输出需求 |

缺失值优先沿用功能默认，功能默认不可用时提示用户调整；配置默认只有在功能尚未设置对应字段时应用。优先级为任务显式设置 > 单任务覆盖 > 批量全局 > 功能参数默认 > 配置默认。空间默认只决定模型，不决定参数。Auto 比例由平台根据素材解析为具体比例后再校验，不向供应商发送字符串 Auto。

### 3.6 默认关系 ModelPreference

`workspaceId:UUID` + `kind:image|video|text` 唯一；`source:platform|custom`；`modelConfigId:UUID|null`（custom必填，platform须null）；`platformModelId:string|null`（platform必填）；`revision:integer≥1`；`updatedAt:datetime`；`updatedBy:UUID`。平台 model ID 取现有模型目录，不使用显示名称作 ID。默认模型必须 enabled、测试通过且类型匹配；不要求适配所有功能，新任务依 2.4 选择。每类型只能有一条关系。

### 3.7 TestResult / ModelTest

| 字段 | 类型与定义 |
| --- | --- |
| id / modelConfigId / workspaceId | UUID，服务端生成或归属 |
| mode | probe / generation；generation关联正式测试任务 |
| status | queued / running / passed / failed / superseded |
| connectionRevision | integer≥1；被测调用版本 |
| startedAt / finishedAt | datetime/null |
| latencyMs | integer≥0/null，服务端整体耗时 |
| errorCode | 本文错误码/null |
| message | 已脱敏用户提示，≤500字符/null |
| requestId | UUID，内部链路关联 |
| generationTaskId | UUID/null，generation模式必填 |

连接字段修改后旧测试完成标为 superseded，不能覆盖新版本 testStatus。相同配置同一连接版本最多1个非终态测试，重复返回已有测试。探测从开始执行起总超时15秒。passed 不设置日历到期时间；实际调用发现401/403或模型不存在时置failed；429、余额不足或网络超时仅记录运行错误，不永久改失败。手动重测 running 时不接受再次启动。

## 4. 各功能兼容矩阵与参数处理

| 功能 feature | kind | 必需operation / 输入 | 参数、输出 |
| --- | --- | --- | --- |
| detail-image | image | imageToImage，至少1张商品图 | 单张完整长图；当前素材实际数量≤模型maxInputImages；不自动丢素材 |
| product-suite | image | imageToImage | 各选定类型逐张；一张一个子任务；共享商品素材 |
| batch-image | image | imageToImage | 至少3个商品任务，二次确认直接生图；分别校验覆盖模型 |
| tryon / repose / multi-model / multi-product | image | imageToImage | 一般至少2张；多模特逐人物拆分，多商品逐商品拆分，再计算每次实际参考图数 |
| outfit-separation | image | imageToImage，1张 | 单张平铺合集图，不拆单品资产 |
| graphic-notes | image | 无素材textToImage；有素材imageToImage | 只负责配图，文案走默认文案模型；配图数量由原有功能需求决定 |
| product-video | video | imageToVideo，至少1张商品图 | 时长/比例/清晰度取交集；需口播时依平台配音合成，不能假定视频模型有声音 |
| viral-remix | video | imageToVideo | 原视频由默认文案模型分析成文字镜头，未上传原视频给供应商；固定15秒需模型支持15秒 |
| digital-human | video | avatarSpeech、supportsAudioInput=true，至少人物/商品2张 | 平台生成或取得授权音频，传供应商同步口型；普通imageToVideo不满足，置禁用并说明 |
| model-integration-test | 对应类型 | 管理员显式选择的一项已声明operation | 无productId，单输出，真实费用确认 |

AI 人物参考图属于 image 子任务，使用空间默认可兼容图片模型；用户为最终视频选择的模型不用于生人物图。该子步骤不新增强制选择；执行前可展开查看实际模型，变更服务必须显式选择。图文笔记仅复用原图的情形不产生供应商图片任务，不因选择模型就强制改图。

若详情长图所选比例模型不支持，首期禁止使用该模型并提示调整比例/更换；不暗中分块或用拼接改变既定生成流程。保留后续平台拼接能力的独立开发空间。

兼容判定函数输入 feature、operation、实际素材清单、用户参数、model revision，输出 `compatible:boolean`、`reasons:[{field,code,message}]`、`allowedParameters`。前端预检查与服务端调用共享规则包；最终以服务端为准。能力只代表调用形状，不保证图像内容正确；商品保真、无编造仍使用各功能提示词及质量验收。

## 5. 配置管理 HTTP API

前缀 `/api/v1/workspaces/{workspaceId}`；登录认证沿平台会话，CSRF按平台规范。workspaceId 仅作路由授权定位，不信任客户端归属。成功 `Content-Type: application/json`，无正文除外；所有响应 `Cache-Control: no-store`、`X-Request-Id: UUID`。请求体≤128KiB，Key不出现在查询参数。

### 5.1 接口清单

| 方法与路径 | 权限 | 请求 | 成功响应 |
| --- | --- | --- | --- |
| GET /model-adapters | member | 无 | 200 `{items:AdapterDescriptor[]}` |
| GET /model-configs | member | cursor?、limit=20（1–100）、kind?、enabled?、testStatus?、q?≤150 | 200 `{items:ModelConfigView[],nextCursor:string|null}` |
| POST /model-configs | admin | ConfigCreate，必传Idempotency-Key | 201 `{data:ModelConfigView}` |
| GET /model-configs/{id} | member | 无 | 200 `{data:ModelConfigView}` |
| PATCH /model-configs/{id} | admin | ConfigPatch，必传If-Match | 200 `{data:ModelConfigView}` |
| DELETE /model-configs/{id} | admin | If-Match必传，无body | 204；重复删返回204 |
| POST /model-configs/{id}/tests | admin | `{mode:"probe"}`，必传Idempotency-Key | 202 `{data:ModelTest}` |
| GET /model-configs/{id}/tests/{testId} | admin | 无 | 200 `{data:ModelTest}` |
| POST /model-configs/{id}/trial-generations | admin | TrialRequest，必传Idempotency-Key | 202 `{data:GenerationTaskView}` |
| GET /model-preferences | member | 无 | 200 `{items:ModelPreference[]}`，固定image、video、text三项 |
| PUT /model-preferences/{kind} | admin | PreferencePut，If-Match必传 | 200 `{data:ModelPreference}` |
| POST /model-compatibility | member | CompatibilityRequest | 200 `{data:CompatibilityResult}`，不发起模型调用 |
| POST /generation-tasks | member | GenerationRequest，必传Idempotency-Key | 202 `{data:GenerationTaskView}` |
| GET /generation-tasks/{taskId} | member | 无 | 200 `{data:GenerationTaskView}` |
| POST /generation-tasks/{taskId}/cancel | member | 无body；只允许任务创建人/admin | 200 `{data:GenerationTaskView}` |

admin 指 owner/admin；member 包括有 use 权限的普通成员。无权读取特定ID统一404；无管理角色调用管理端点403；被撤销成员会话401/403。`If-Match: "7"` 传当前 revision；缺失428、过期409。GET单实体与写入响应带 `ETag: "revision"`。

### 5.2 DTO 完整定义

`ModelConfigView` = 3.2实体安全投影，剔除 credentialRef、credentialVersion、deletedBy、deletedAt，仅未删除项返回；附加 `isDefault:boolean`、`permissions:{canUse:boolean,canManage:boolean}`。普通成员不能获得 credentialUpdatedAt、createdBy、updatedBy，管理员可见；前端不得依赖这些可选字段渲染使用入口。

`ConfigCreate` = `{name,kind,adapterKey,modelId,endpoints,capabilities,generationDefaults?,enabled?,apiKey}`。generationDefaults默认{}，enabled默认true。apiKey:string 1–8192、非全空白、禁止CR/LF、禁止掩码。校验Schema之外还执行跨字段、能力注册表、URL安全检查。

机器Schema以2020-12版本提供，根节点校验ConfigCreate；其他DTO选择`$defs`对应定义。Schema负责静态类型/枚举/条件；trim、同origin、仅一个taskId占位符、默认值属于能力集合、maxTotal不小于单图、特性与operation匹配、enabled/测试/权限和URL安全均须服务端二次校验。PATCH先合并数据库原值，再按完整配置Schema和上述业务规则校验，不能只校验局部DTO。

`ConfigPatch` = 上述可编辑字段的任意非空子集，不含 kind/adapterKey；capabilities/endpoints/generationDefaults传入时整体替换，避免部分清空歧义；apiKey省略/空串表示保持现有密钥（编辑UI留空），null拒绝。enabled允许单独更新。无实际变化返回原revision，不制造新版本。

`PreferencePut` = `{source,modelConfigId?,platformModelId?}`，选择源的字段必填、另一字段必须null或省略；由服务端校验并补全 ModelPreference。初始化无记录时 GET 物化平台默认revision=1，避免客户端猜初始锁。

`AdapterDescriptor` = `{key,version:integer,kind,label,endpointFields:string[],authMode:"bearer",operations:string[],maxima:CapabilitySet,probeSupported:boolean,trialSupported:boolean,providerIdempotencyVerified:boolean}`。maxima是可配置上限/允许值，不是某个模型的真实能力。服务端发布，不允许客户新增或修改。

`CompatibilityRequest` = `{feature,operation,modelSelection,parameters,inputAssetIds:string[],audioAssetId?:UUID}`。服务端读取素材元信息和任务约束，禁止客户端伪造文件数量。`CompatibilityResult` = `{compatible,reasons:[{field,code,message}],allowedParameters:{ratios:string[],resolutions:string[],durationSeconds:integer[]},resolvedSelection:ModelSelection|null}`。前端只用于可视化，不生成任务。

`ModelSelection` = `{source:"platform"|"custom",modelConfigId:UUID|null,platformModelId:string|null,expectedRevision:integer|null}`。custom须id/revision且platformModelId=null；platform须platformModelId且另两项null。工作空间服务端从上下文取，不接受外空间配置。

`GenerationParameters` = `{ratio:string,resolution:string,durationSeconds?:integer,outputCount:integer}`。video durationSeconds必填、outputCount=1；image不允许durationSeconds，outputCount1–4；业务要求总张数由父任务管理。提示词通过引用而非普通客户直接覆盖后台系统提示词。

`GenerationRequest` = `{clientRequestId:UUID,feature,operation,modelSelection,parameters,inputAssetIds:UUID[],audioAssetId?:UUID,contentPlanId:UUID,contentPlanRevision:integer,productId?:UUID,batchId?:UUID,parentTaskId?:UUID,acknowledgement:{thirdPartyUsage:boolean,configRevision:integer|null}}`。custom时thirdPartyUsage必须true、configRevision必须等于expectedRevision；platform时thirdPartyUsage=false、configRevision=null。contentPlan是默认文案服务或模板生成的已确认内容；服务端校验归属、版本和非空最终提示词。没有提示词确认步骤的功能在提交前内部建立计划，不额外要求用户操作。纯上传productId=null；库商品需要稳定productId；批量父任务创建子任务，子任务不重新弹费用确认。

`TrialRequest` = `{clientRequestId:UUID,operation,parameters,inputAssetIds:UUID[],audioAssetId?:UUID,prompt:string1–2000,acknowledgement:{thirdPartyUsage:true,configRevision:integer}}`。不接受productId/batchId；测试素材归当前空间或平台许可示例。服务器内部创建contentPlan、feature=model-integration-test，使用当前模型revision并复用generation流程。

`GenerationTaskView` = `{id:UUID,clientRequestId:UUID,feature,operation,status,progressPercent:integer0–100|null,modelSnapshot:ModelSnapshot,parameters:GenerationParameters,productId:UUID|null,batchId:UUID|null,parentTaskId:UUID|null,outputAssetIds:UUID[],error:TaskError|null,createdAt,startedAt:datetime|null,finishedAt:datetime|null,canCancel:boolean,submissionUncertain:boolean}`。不返回供应商Key、内部凭证引用、原始响应或供应商私有地址。

`TaskError` = `{code,message,retryable:boolean,field:string|null,requestId:UUID}`。`retryable=true`只代表允许平台重试安全阶段，不授权重复付费提交。

### 5.3 请求示例

```json
{
  "name":"公司商品图片模型",
  "kind":"image",
  "adapterKey":"image-api-v1",
  "modelId":"merchant-image-model",
  "endpoints":{
    "generateUrl":"https://models.example.com/v1/images/generations",
    "editUrl":"https://models.example.com/v1/images/edits",
    "probeUrl":"https://models.example.com/v1/model-info"
  },
  "capabilities":{
    "operations":["textToImage","imageToImage"],
    "inputFormats":["image/png","image/jpeg"],
    "maxInputImages":6,
    "maxInputImageBytes":10485760,
    "maxTotalInputImageBytes":41943040,
    "outputFormats":["image/png"],
    "ratios":["1:1","3:4","1:3"],
    "resolutions":["1K","2K"],
    "durationSeconds":[],
    "maxOutputsPerRequest":1,
    "maxPromptChars":16000,
    "supportsAudioInput":false,
    "maxAudioBytes":null,
    "supportsNativeAudio":false,
    "supportsCancel":false,
    "supportsIdempotency":false
  },
  "generationDefaults":{},
  "enabled":true,
  "apiKey":"test-placeholder-replace-before-use"
}
```

该域名和modelId为协议示例，不是可调用的真实服务。返回实体不含apiKey。POST成功默认testStatus=untested。

### 5.4 幂等与事务

管理创建、测试、试生成及正式生成的 `Idempotency-Key` 为UUID；作用域 workspaceId+actorId+HTTP路径+key，保留24小时。相同key+规范化body哈希返回同一资源，不再调用供应商；不同body返回409 IDEMPOTENCY_CONFLICT。持久化任务与幂等记录同事务，供应商调用通过持久队列执行。

clientRequestId 在 workspace 内唯一保留，超过24小时仍不允许同ID新建另一个任务；服务端返回原任务引用。模型管理创建没有clientRequestId，幂等依24小时记录。更新/删除CAS在数据库事务内执行。最多100个未删除自定义模型/空间，超限409 CONFIG_LIMIT_REACHED；删除后释放名额。

## 6. 供应商适配协议（FashMaker定义）

### 6.1 共通

仅后端出网。请求 `Authorization: Bearer <解密后的Key>`；请求日志/trace自动删除Authorization、Cookie、签名URL及body素材。adapter版本写入任务快照。没有Cookie透传，没有客户端自定义Authorization覆盖。

probeUrl：GET，无body，200 JSON `{modelId:string,kind:"image"|"video",available:boolean}`；modelId必须准确相同，kind匹配、available=true才通过。401/403失败；404模型不存在失败；available=false为MODEL_UNAVAILABLE。不从probe响应自动覆盖客户能力声明。禁止服务商以probe实现收费生成，此约束在适配器上线联调验收。

### 6.2 image-api-v1

文生图：POST generateUrl，JSON `{model:string,prompt:string,ratio:string,resolution:string,n:integer,responseFormat:"url"|"base64"}`。图生图：POST editUrl，multipart/form-data，文本字段同上，二进制字段 `images` 可重复，按inputAssetIds顺序；Content-Type由HTTP客户端生成boundary，不手写。

响应200 JSON `{data:[{url?:string,base64?:string,mimeType:string,width:integer,height:integer}],requestId?:string}`。每项url/base64恰有一个；data条数必须等于n，缺失/多余视为OUTPUT_COUNT_MISMATCH，不生成虚假成功资产。mimeType必须在能力声明输出范围，解码魔数及尺寸必须一致；单张文件上限30MiB。url仅HTTPS；base64严格解码，禁止SVG/HTML/可执行内容。供应商直接返回图像二进制不属于本适配器契约。

image任务不支持供应商异步202；遇到返回202提示ADAPTER_RESPONSE_INVALID，不能猜测轮询字段。需要异步图片接口时另加适配器，不能复用视频协议冒充图片。

### 6.3 video-gateway-v1

创建：POST createUrl，JSON如下。inputImages每项 `{url:HTTPS signed URL,mimeType:string}`，由平台生成有效期至少2小时、只读且仅指定对象的签名地址；audioInput同结构或null。avatarSpeech时audioInput、avatarImageIndex（0基）必填且该索引指向人物图，商品图另列输入。普通视频不传avatarImageIndex。

```json
{
  "model":"merchant-video-model",
  "operation":"imageToVideo",
  "prompt":"平台最终已确认的分镜提示词",
  "inputImages":[{"url":"https://media.example.com/signed-object","mimeType":"image/png"}],
  "audioInput":null,
  "ratio":"9:16",
  "resolution":"720P",
  "durationSeconds":15,
  "n":1,
  "clientRequestId":"e68708a2-00cb-44dc-8709-944a30e9747f"
}
```

创建202 JSON `{taskId:string1–200,status:"queued"|"running"}`。供应商taskId不能作为本平台taskId，仅内部providerTaskId映射。禁止在本地存储/日志中输出完整供应商响应。

查询：GET statusUrlTemplate替换taskId后，200 JSON `{taskId,status:"queued"|"running"|"succeeded"|"failed"|"canceled",progressPercent?:integer0–100,output?:{url:string,mimeType:"video/mp4",durationMs:integer,width:integer,height:integer,hasAudio:boolean},error?:{code:string,message:string}}`。succeeded必须output，failed必须error；其他状态不得当作已完成。返回taskId必须与被查任务相同。

取消：POST cancelUrlTemplate，无body，200 JSON `{taskId,status:"cancel_requested"|"canceled"|"succeeded"}`；succeeded表示供应商已完成而取消未成功，继续下载归档。无supportsCancel时客户端不展示取消按钮，不假装供应商已取消。

每次视频结果只允许一个mp4，≤500MiB；容器可解码、实际ratio、时长检查。时长允许与目标差±1000ms，超出为OUTPUT_INVALID，不自动裁切；数字人口播必须hasAudio=true且实际有音轨。字幕、口型和内容质量由业务验收，不用容器检测虚构保证。

### 6.4 参数转换和扩展

ratio、resolution为规范化语义，不等价于供应商原始参数。实际供应商需要size/width/height等字段时，新适配器必须提供版本化映射表及fixture；不能根据模型名称拼测字段。1K/2K/4K具体像素按适配器映射表确定，在兼容响应中暴露最终宽高；首期两个兼容协议由对端网关负责按规范语义实现。

首期网关像素口径：图片1K/2K/4K分别以长边1024/2048/4096像素为目标，按ratio计算短边，再四舍五入到最近16的倍数（恰半向上）；长边保持不变。视频480P/720P/1080P分别以短边480/720/1080像素为目标，按ratio计算长边并四舍五入到最近16的倍数；短边保持不变。正方形使用目标边长。该规则是本网关约定，并非所有供应商通用标准；不满足的供应商需要独立尺寸映射适配器。返回宽高各允许偏离目标最多16像素、画面ratio相对误差≤2%，超过时OUTPUT_INVALID；不自动拉伸或裁切。probe不能验证上述输出质量，试生成与适配验收必须验证。

实际图片输入还须最长边≤8192像素、总像素≤40000000；超限由素材处理流程明确提示压缩副本，用户确认后提交，原文件不覆盖；损坏/解码炸弹拒绝。输出尺寸按解码后实际宽高校验，不能只信供应商JSON。接口能力与真实供应商文档不符时禁止标为已支持。

## 7. 任务数据、状态机与执行

### 7.1 ModelSnapshot

不可变字段：`source`、`modelConfigId|null`、`configRevision|null`、`connectionRevision|null`、`displayName`、`kind`、`modelId`、`adapterKey`、`adapterVersion:integer`、`endpoints`、`capabilities`、`generationDefaults`、`selectedAt:datetime`。平台模型使用平台目录快照，未适用的自定义字段null。Key、credentialRef、credentialVersion绝不在对外快照中；内部执行引用单独存放，权限隔离。

内部 ModelExecutionBinding：`taskId`、`workspaceId`、`modelConfigId`、`configRevision`、`credentialRef`、`credentialVersion`、`providerTaskId|null`、`providerRequestKey|null`、`submitAttemptCount:integer`、`pollAttemptCount:integer`、`leaseExpiresAt|null`。同taskId唯一，持久化锁保证仅1个提交worker。任务开始后配置编辑不改变该binding。

子任务保存operation、最终prompt或contentPlan引用+不可变版本、promptTemplateVersion、规范化参数、原始输入资产引用、实际送给模型的处理后资产引用、商品关系、providerTaskId、输出归档引用。历史完整保存业务输入，图文笔记按原约定只展示结果及必要模型元信息，不存用户对话。密钥不能进入任何历史导出。

### 7.2 状态枚举与转换

| 状态 | 定义 | 合法下一状态 |
| --- | --- | --- |
| queued | 已持久化等待worker | submitting、canceled、failed |
| submitting | 请求正在提交供应商 | running、persisting、submission_unknown、failed |
| submission_unknown | 请求可能已接受但未取得确定回执 | running、persisting、failed；保持人工/供应商查询，不自动重提 |
| running | 已有providerTaskId或等待同步图片响应 | persisting、cancel_requested、failed |
| cancel_requested | 供应商取消处理中 | canceled、persisting、running、failed |
| persisting | 已生成，正在下载校验和落库 | succeeded、failed |
| succeeded | 所有目标输出已归档 | 终态 |
| failed | 已确定失败，无本次成功输出 | 终态 |
| canceled | 已确定未提交或供应商确认取消 | 终态 |

同步图片 submitting可直接persisting。queued可取消且不调用供应商；同步图片提交后首期不支持取消。视频running可取消只在supportsCancel=true。persisting不可取消，返回409 TASK_NOT_CANCELABLE。成功必须平台文件、资产记录、历史结果关联均完成，不以供应商URL为成功依据。

未知提交自动查询最长24小时；仍不能确认时failed，错误SUBMISSION_UNCERTAIN、submissionUncertain=true，提示可能已经扣费、需联系供应商核对后再主动新建。用户不能对相同任务点“重试”直接重提交。管理员手工绑定providerTaskId需要审计并校验归属，不能由普通用户输入。

### 7.3 超时、重试与并发

- 出网连接10秒；probe总15秒；图片同步总180秒；视频创建总30秒；单次查询15秒；单个结果下载总180秒。超过供应商创建时限进入不确定状态，不宣称无扣费。
- 视频轮询：开始5秒，之后10秒、20秒、30秒封顶，每次加±20%抖动；处理总时限60分钟。达到时限标failed/TASK_TIMEOUT，保留providerTaskId供后台对账，不自动重建收费任务。
- 每workspace同时执行最多图片4、视频2；每配置最多图片2、视频1；多实例使用统一分布式配额。超限保留queued，等待不算供应商超时；队列超过24小时未执行以QUEUE_TIMEOUT失败，无调用费用。
- 只读探测/轮询/下载可重试3次，指数退避2/4/8秒；查询出现429遵守Retry-After（秒数或HTTP日期，封顶60秒），不消耗创建次数。认证错误、权限、参数、内容拒绝不重试。
- 创建请求仅在适配器经认证支持幂等时允许最多3次，始终同一个供应商幂等键；其余情况只有明确未建立连接且零字节发出才能安全重试。接收超时、断连、5xx和不明回执不能默认安全。
- 结果下载失败只重试下载，不重生图/视频；支持归档修复任务引用原providerTaskId，不能新增收费请求。
- 批量只给失败且确定未生成的子任务提供重新生成，必须新建子taskId并明确费用；部分成功父任务展示partial_failed，成功资产保留，不重复归档。

### 7.4 文件与结果归档

上传先入平台素材服务，校验魔数/MIME、大小、图片可解码，剔除EXIF敏感信息的处理副本用于外发；原文件保留规则沿各业务。供应商图片编辑按要求转换格式，不能静默删减参考图或改变顺序。音频归一化MP3/WAV，实际时长≤60秒、≤20MiB。

供应商结果临时URL只能由后端拉取；按域名解析/重定向安全校验，先下载到临时对象，完整验证后移动平台对象。输出hash用SHA-256记录校验；不跨空间做可见去重。平台对象路径含workspace/task/output索引，用户不能指定任意存储路径。

每个输出一条资产：`id`、`workspaceId`、`taskId`、`batchId|null`、`productId|null`、`type:image|video`、`source:业务来源`、`modelSnapshot`（安全投影）、`storageObjectId`、`mimeType`、`bytes`、`width`、`height`、`durationMs|null`、`createdAt`、`demo:false`。唯一约束taskId+outputIndex，网络重放不能重复建资产。

数据库事务写资产、productId关联、历史结果与任务succeeded；对象存储不参加DB事务，使用outbox+补偿清理临时/孤立文件。历史读取同一assetId引用，不复制文件。有productId同时进入AI生成与对应商品详情；纯上传只AI生成。详情长图一条完整资产，套图逐张独立资产，穿搭分离单张合集。

## 8. 权限、安全、留存和费用

- Key使用服务端KMS信封加密，工作空间为授权边界；仅执行worker的最小权限身份可解密。管理API只接收写入，不提供明文读取。加密算法/云KMS选择沿现有基础设施，不在前端自行实现“加密”。
- 禁止浏览器localStorage/sessionStorage存储生产Key；禁止把Key放URL、日志、审计、事件、任务快照、错误或分析平台。客户端保存后立即清空输入内存引用，不能承诺浏览器内存绝对不可取证。
- SSRF：入库与每次请求前验证协议、host、443端口、DNS所有A/AAAA；拒绝非公网、IPv4映射IPv6、localhost及元数据网段。HTTP客户端连接到已验证IP并校验原host TLS/SNI，防DNS重绑定。接口请求不跟随重定向；结果下载最多3跳，每跳独立校验，不转发Authorization。禁止访问平台自有管理域名和已知内部DNS后缀。
- 图片签名URL只读、有效期至少2小时，不授予列表/写权限；任务最大60分钟，后台签发素材URL时按剩余任务时限计算，必要时重新签发给经验证的重试调用，不能刷新同一已提交请求导致重复任务。供应商可能保存素材，提交前在配置和创作页说明数据将发送到对应服务域名。
- 多租户鉴权覆盖配置、测试、任务、输入素材、contentPlan、商品、下载URL和默认模型；不因拥有UUID而获得权限。撤权后禁止新生成，已接受后台任务完成归档至原空间。
- 配置软删后隐藏；审计记录保留180天（配置/Key字段变更名单、操作者、时间、revision、requestId、脱敏域名，不记录Key/完整素材URL）。运行中的密钥版本至少保留到任务终态+7天；无任务引用的旧密钥7天后销毁。软删配置30天后清理非审计元数据，历史快照独立保留。任务/资产留存遵循空间现有政策，不因删配置而缩短。
- 管理接口限每用户60次/分钟；测试probe每配置5次/分钟、每空间20次/分钟；试生成每空间10次/小时。429返回Retry-After。生产容量由队列控制，不以重试绕过限额。
- 第三方费用不从FashMaker生成积分重复扣除。平台服务收费按已存在套餐规则执行；无相关套餐字段时只显示第三方额度说明，不实现新的收费。失败、取消、超时可能仍有供应商费用，按供应商实际结算，不承诺退款。

## 9. 错误码与前端行为

错误统一：`{error:{code,message,field:null|string,requestId:UUID,retryable:boolean,details?:{reasons?:[{field,code,message}],currentRevision?:integer}}}`。message不含Key、内部IP、栈、完整供应商URL或原始响应。上游message最多保留脱敏500字符供内部定位，用户看统一文案。

| code | HTTP | 场景 / 前端动作 |
| --- | --- | --- |
| UNAUTHENTICATED / FORBIDDEN | 401/403 | 登录失效/角色不足；停止提交 |
| NOT_FOUND | 404 | 无权访问、已删除或不存在；刷新列表 |
| VALIDATION_ERROR | 422 | 字段格式/未知字段/类型或条件不符；定位field |
| ENDPOINT_NOT_ALLOWED | 422 | URL安全检查失败；修改地址 |
| ADAPTER_UNSUPPORTED | 422 | 未注册/类型不相符；选择适配器 |
| CAPABILITY_MISMATCH | 422 | 功能与模型不兼容；展示reasons |
| MODEL_DISABLED / MODEL_NOT_TESTED | 409 | 停用/未测试；管理配置或更换 |
| MODEL_CONFIG_CHANGED | 409 | 任务expectedRevision过期；刷新并重新确认 |
| REVISION_CONFLICT | 409 | PATCH旧版本；保留草稿，加载新版本比对 |
| PRECONDITION_REQUIRED | 428 | 缺If-Match；客户端重读 |
| IDEMPOTENCY_CONFLICT | 409 | 同key不同请求；修复客户端键复用 |
| CONFIG_LIMIT_REACHED | 409 | 达到100个；删除不再用配置 |
| CREDENTIAL_MISSING | 409 | 无有效密钥记录；管理员填写 |
| PROBE_UNSUPPORTED | 422 | 无只读探测；显式试生成 |
| PROVIDER_AUTH_FAILED / PROVIDER_FORBIDDEN | 502 | 上游401/403；标记测试失败，管理员更换Key |
| MODEL_NOT_FOUND / MODEL_UNAVAILABLE | 502 | 上游无模型/模型不可用；检查ID与供应商 |
| PROVIDER_BALANCE_INSUFFICIENT | 502 | 供应商返回明确余额错误；充值，不自动切换 |
| PROVIDER_RATE_LIMITED | 503 | 上游限流；按安全阶段退避 |
| PROVIDER_REJECTED | 422 | 内容拒绝或上游明确业务拒绝；调整输入 |
| ADAPTER_RESPONSE_INVALID | 502 | 状态/字段/MIME不符；配置适配问题 |
| OUTPUT_COUNT_MISMATCH / OUTPUT_INVALID | 502 | 张数、容器、尺寸/时长不符；不伪造成功 |
| PROVIDER_NETWORK_ERROR | 502 | 已确定安全失败；按retryable提示 |
| SUBMISSION_UNCERTAIN | 502 | 可能已付费提交；禁止一键自动重生 |
| TASK_TIMEOUT / QUEUE_TIMEOUT | 504 | 生成/排队超时；明确是否已提交 |
| OUTPUT_DOWNLOAD_FAILED / ARCHIVE_FAILED | 502 | 已生成未归档；后台修复，不重提交 |
| TASK_NOT_CANCELABLE | 409 | 已归档中或不可取消；保留状态 |
| RATE_LIMITED | 429 | 平台限流；按Retry-After等待 |

异步任务执行错误放TaskError，查询接口正常200；不将供应商运行失败直接伪装成GET任务的HTTP502。表中HTTP用于同步调用/创建阶段；后台执行复用code和message。

## 10. 可观测性和非功能验收

管理/列表接口P95≤500ms（不含外部供应商），任务创建P95≤1秒返回202，测量条件单空间100配置、服务正常且数据库无故障。列表不调用供应商。前端获取列表失败不得清空用户已有模型选择；显示刷新入口。

日志维度：workspaceId、taskId、configId、configRevision、adapterKey/version、providerRequestId（脱敏）、status、errorCode、latencyMs、outputCount；请求量、失败率、未知提交数、排队时长、归档耗时和上游429率监控。不得对Key或提示词做metric label，避免泄露和高基数。

同一适配器5分钟≥20次调用且协议失败率>20%触发内部告警；未知提交任一发生记录告警事件；归档失败5分钟未修复升级。告警不自动替换客户模型。管理写操作、密钥轮换和默认变更有审计。

桌面1440/1920、窄屏390px验证；弹窗可滚动无横向溢出，表单有label，错误聚焦首字段，Esc关闭、焦点返回入口；按钮加载与禁用有文字，不仅颜色区分。支持最近两个稳定版Chrome/Edge/Safari及iOS Safari，服务端能力不依赖浏览器长时间停留，关页后任务继续。

## 11. 验收用例（开发与QA共同执行）

| ID | Given / When | Then |
| --- | --- | --- |
| M01 | 管理员填合法图片配置并保存 | 201，ID稳定，Key不回显，默认untested；图片功能出现禁用待测试项，视频不出现 |
| M02 | 普通成员打开配置列表/尝试编辑 | 可查看可用模型；编辑403，不能获取密钥元数据 |
| M03 | 任意成员用其他空间配置或素材ID提交 | 404，无上游调用，无空间数据泄露 |
| M04 | 新建遗漏Key、全空白名称、长度越界、未知字段 | 422并定位field；不写库 |
| M05 | 编辑留空Key，仅改名称 | 保持密钥，revision+1、connectionRevision不变，旧测试仍有效 |
| M06 | 改地址/参数/能力/Key后旧测试才返回 | 新连接版本untested，旧测试superseded，不能变passed |
| M07 | 两个管理员基于同revision编辑 | 第一个成功，第二个409，不覆盖 |
| M08 | 无probeUrl点测试 | PROBE_UNSUPPORTED，不触发收费生成；用户确认试生成后才调用 |
| M09 | probe返回鉴权通过但modelId不一致 | 测试failed，不能提交正式任务 |
| M10 | 同创建key重复点击/网络重放 | 同一任务/配置；不同body409；无重复上游调用 |
| M11 | 自定义图片模型配置maxInputImages=1，在换装传2张 | 能力不兼容、提示数量原因；不丢图、不调用 |
| M12 | 普通imageToVideo模型用于数字人口播 | 禁用，说明缺avatarSpeech/audio；不生成虚假口型视频 |
| M13 | 换模型不支持已选比例或时长 | 显示调整确认；取消保留旧选择，确认后按交集规则更新 |
| M14 | 显式设空间默认后新建任务/已有草稿 | 新建按默认；草稿保持原选项，失效时提示，不静默切换 |
| M15 | 三个批量商品分别继承/覆盖不同模型 | 校验每个子任务，二次确认直接生成，模型快照逐子任务保存 |
| M16 | 提交后轮换Key/改接口/停用/删除配置 | 已接受任务继续用旧绑定；新提交拒绝；旧资产不删 |
| M17 | 创建网络超时，供应商可能已接收 | submission_unknown，不自动重提；显示可能费用与查询状态 |
| M18 | 供应商返回success但文件下载失败 | 不显示已完成，重试下载；不重生图/视频 |
| M19 | 供应商输出数不符、伪装HTML、SVG、超大文件、时长不符 | OUTPUT_INVALID或COUNT_MISMATCH，不建成功资产 |
| M20 | 结果下载302到内网/IPv6映射内网/DNS重绑定 | 被安全策略阻断；不带Key追随重定向 |
| M21 | 结果归档相同回执重复到达 | task+outputIndex唯一，不重复建资产或商品关联 |
| M22 | 选择库商品和纯上传分别生成 | 前者AI生成及该商品详情同assetId，后者只AI生成 |
| M23 | 历史再次生成时模型已删除/修改 | 新taskId，旧历史不变；要求确认当前配置/重新选；不含Key |
| M24 | 生成中关闭浏览器，再次打开历史 | 后台继续，能查看状态与最终结果，无依赖前端计时 |
| M25 | 成员取消queued/支持取消视频/已persisting | 分别canceled、等供应商确认、409；不承诺退费 |
| M26 | 图文笔记历史与下载 | 只结果及模型元数据，无用户对话/生成要求/Key |
| M27 | 检查日志、审计、API、对象元数据、浏览器存储 | 均无明文Key，签名URL不进入分析平台 |
| M28 | 从任一侧栏跳转至其他功能，390px/1440px | 侧栏结构、宽度和排序一致，仅当前项变化；模型在设置最后 |
| M29 | 视频gateway完成音频数字人口播 | 正确传人物索引/音频，实际mp4有音轨且时长合规才成功 |
| M30 | 首次新建兼容模型配置但试生成失败 | 不将failed标passed；错误保留可修复，无成功输出占位 |

适配器发布必须有成功、鉴权失败、限流、超时、非法响应、重复回执fixture，并用隔离测试账号完成至少一次实际图片参考编辑/视频创建轮询下载；不以静态原型计时结果作为联调证据。

## 12. 开发拆分与上线依赖

| 工作包 | 交付物 | 前置 |
| --- | --- | --- |
| A 数据与权限 | 配置/版本/默认/测试/幂等/审计表，密钥仓库与CAS | 工作空间身份、KMS |
| B 管理API与前端 | 完整字段表单、能力编辑、测试/试生成、默认/启停/删除 | A、适配器目录 |
| C 适配器执行 | 图片multipart、视频异步gateway、只读probe、安全出网 | 供应商或客户网关满足本文契约 |
| D 任务服务 | 状态机、幂等提交、轮询、取消、并发、未知提交对账 | C、持久队列 |
| E 功能接入 | 全功能能力过滤、参数交集、计划版本、批量覆盖、历史快照 | B、D、平台文字/计划服务 |
| F 归档与验收 | 对象下载校验、asset/product/history事务、补偿、M01–M30 | E、资产及商品服务 |

上线硬依赖：真实供应商/网关联调账号、符合契约的协议样例、KMS与权限服务、队列和对象存储、平台contentPlan服务、资产/商品归档服务、数字人口播所需平台音频服务。缺少某类供应商适配时该适配器不得上架；缺少avatarSpeech时数字人口播中自定义模型入口禁用并说明，不宣称支持。本文不指定未确认的真实供应商品牌或型号，避免把通用契约当作已接入名单。

## 13. 当前原型差异与实施边界

| 项 | 当前HTML已实现 | 正式服务开发目标 |
| --- | --- | --- |
| 类型与选择 | 图片/视频，按类型填下拉 | 能力级过滤和参数交集 |
| 配置字段 | name/kind/protocol/endpoint/modelId/Key | 本文完整endpoints/capabilities/defaults/revision |
| 协议标识 | image-api / video-task，占位 | image-api-v1 / video-gateway-v1，明确契约 |
| 地址 | 本地检查HTTP(S) | HTTPS/443、SSRF与供应商适配 |
| 密钥 | 当前标签页sessionStorage测试Key | 服务端加密，不进浏览器持久存储 |
| 测试 | 只检查配置格式 | 只读probe及用户确认后的收费试生成 |
| 默认/启停/权限 | 未实现正式空间默认和鉴权 | ModelPreference、启停、空间RBAC |
| 生成 | 固定素材/计时演示 | 服务端任务与真实输出归档 |
| 历史 | 本机浏览器快照 | 服务端不可变快照，图文笔记结果例外保留 |
| 导航与位置 | 已统一侧栏、模型在设置末尾 | 继续保持，不引入每步强制模型选择 |

本次只补开发交付文档，不把正式目标伪装为HTML已实现，不更改已确认生成提示词。模型接入本身不新增内容生成提示词；平台现有业务提示词按各功能 `*-prompt.md` 执行并保存版本，新功能或规则变更仍需同步独立提示词交付。


## 14. 原型进度补充（2026-11-12）

已补齐独立模型管理页面、本机默认模型、启停、筛选详情及检查/试生成演示；精确字段与行为见[模型管理流程](model-management-flow.md)。本补充更新第13节“默认/启停未实现”的界面进度，RBAC、空间默认持久化、真实测试passed、完整能力配置与真实调用仍待后端实现。当前format_valid只代表本地格式通过；不能代替第2节及第3.7节真实passed，也不因此满足上线验收。

## v1.1 三类默认与文案接入扩展（2026-11-12）

本节与更新后的第 1 节、字段契约共同覆盖旧版「文案固定平台」规定；未更新的 EndpointSet、CapabilitySet、GenerationRequest、图片/视频探测与网关细节明确仅适用于 image/video，不可用于 text。当前仅实现本机演示的配置、默认解析与路由，不代表以下正式接口已接入。

### 默认与路由

ModelPreference 按 workspaceId + kind=image|video|text 各保留一条；source=platform|custom；custom 指向一个已启用、正式服务测试通过且类型匹配的 modelConfigId。设置平台不隐藏自配模型；所有有权限且类型匹配的已配置模型进入生成选择框，停用/未验证/能力不足显示禁用原因。有选择框的本次值优先，无选择框直接用该类型默认。图片参考图步骤不得误用页面的视频选择值。

删除/停用默认项需确认，事务内恢复该类型平台默认；其他类型不变。重新启用不会自动恢复默认。保存新配置不会替换默认；新建按当前默认初始化，已打开任务保留本次选择。没有选择框的生成步骤在提交时锁定默认 ID、revision 和安全快照；之后修改默认不改变已接受任务。平台默认与本次选择相互独立。

### 文案正式 DTO 与适配边界（待开发）

- TextConfigCreate：name（trim后1–50）、kind 固定 text、adapterKey 固定 text-chat-v1、modelId（1–150）、endpoint（完整 HTTPS 地址）、apiKey（服务端保密输入）、enabled（默认 true）。返回实体沿用 ModelConfig 的租户、revision、credentialConfigured、检查状态与时间字段；不返回 Key。PATCH 可更新名称、endpoint、modelId、enabled、apiKey，类型与适配器不可改；endpoint/modelId/Key 修改使连接检查失效。测试/删除/默认权限和租户隔离沿用原规则。
- text-chat-v1 是待实现的内部适配器标识，不宣称兼容任意供应商。适配器将业务系统提示词、用户输入和可选已授权图片引用转换成供应商请求。商品图识别必须支持图文输入；结构化脚本/卖点需验证 JSON 输出及业务 Schema；不支持时显式报能力不匹配。
- TextGenerationRequest：clientRequestId、feature（product-analysis / copywriting / prompt-planning / script-planning / content-package / graphic-notes）、modelSelection（沿用 source/id/revision 结构）、input（业务文本与受控素材 ID）、promptVersion、productId?、parentTaskId?。modelSelection 由本次选择或类型默认在服务端解析后锁定；不能由客户端传任意系统提示词替换后台业务规则。
- 输出：taskId、status、modelSnapshot、result（由对应业务 Schema 校验的文字/结构化结果）、usage（供应商提供才填写）。不把纯文字结果归档成图片/视频资产；历史按业务规则保存结果及模型元信息，图文笔记仍不保存对话/输入。文案试生成只创建文案测试结果，不产生图片资产。
- 失败：鉴权、连接、额度、能力或结构校验失败均显示原因，不静默回退平台/其他模型。密钥加密、日志脱敏、SSRF、权限、异步幂等、超时与限流沿用媒体服务同等级要求。供应商计费不在原型中模拟扣款。

### 原型与验收

本地 text-chat 为占位协议，不等于 text-chat-v1 已实现。元数据和默认存 localStorage，测试 Key 仅 sessionStorage；不联网。shared 模块 resolve(kind, select?) 统一解析；文案按钮没有新增选择框，直接取 text 默认，AI 模特与数字人参考图直接取 image 默认。既有图片/视频下拉展示全部同类型配置，停用可见禁选。新增验收：配置两个图片模型、一个视频模型、一个文案模型；分别设默认并刷新；平台和自配切换不隐藏配置；修改默认不覆盖跨页已有选择；无框按钮解析正确类型；停用/删除默认只重置同类；启用不复原默认；密钥不进入快照/历史。
