# 模型管理页面：交互与本地字段

版本 v1.0，2026-11-12。原型 [model-management.html](../model-management.html)；正式服务 [完整开发规格](custom-models-development.md)，统一 [字段契约](developer-field-contract.md)。试生成示例见 [提示词](model-management-prompt.md)。本节描述实际本地演示，不替代正式服务契约。

## 入口与结构

全站侧栏原「自定义模型」更名「模型管理」，设置按钮和窄屏入口进入同一独立页面。各创作设置末尾保留选择框，新增「管理模型」链接；旧 index.html?modelSettings=1 自动转到管理页。没有文字模型管理，资产、商品详情、店铺页不加生成模型字段。

顶部显示默认图片和视频模型；每类保留一条「平台默认模型」，表示沿用各功能原有平台选项，并非新上线的供应商模型。页签分图片/视频，列表包括平台及自定义模型。搜索trim后按名称/模型ID不区分大小写子串匹配；来源all/platform/custom，状态all/enabled/disabled；三个条件取交集。空态保留添加入口。列表显示名称、来源、默认标签、模型ID、接口域名、启停、格式检查状态及操作。

## 操作

- 添加/编辑复用原配置弹窗；保存即时刷新管理页。编辑不可改用途；API Key不回显，留空仅在当前标签页已有Key时保留，否则要求重新填写。name1–50、modelId1–150、endpoint有效HTTP(S)且无嵌入账号密码，protocol与kind对应。编辑会重置格式检查状态；lastTrial试生成记录保留。新建默认enabled=true。
- 默认设置每类型一项，写入后只初始化新打开的创作页及表单reset默认项；已有页面草稿不因跨页默认变更而静默切换。原型不设“必须真实测试通过”的限制，提示未验证真实可用性。正式服务按开发规格要求passed。
- 停用模型在下拉中禁用，当前已选停用项保留，提交时拦截。停用默认模型需确认并恢复平台默认；启用不会自动恢复旧默认。删除需确认，默认恢复平台，Key会话记录删除，历史和资产不删除。
- 「测试连接（演示）」只检查当前配置URL与当前标签页是否有测试Key，约450ms演示等待；成功为format_valid并明确“未验证连接”，缺Key为failed并给出修复原因。不会联网或调用真实模型。
- 「试生成演示」需已启用模型及当前标签页测试Key；弹窗可编辑1–2000字符测试提示词；运行仅约650ms等待并显示文字流程示意，不输出实际图片或视频，不创建资产、商品关联或任务历史。lastTrial只保存时间和演示说明，不保存Key、提示词或用户素材。关闭弹窗不触发外部操作。
- 详情按字段展示名称、类型、来源、modelId、协议、完整地址、Key是否存在、状态、最近检查/试生成、能力边界和更新时间。不能读取、复制明文Key。当前仅按模型类型筛选，参考图数、尺寸、音频和口型等能力仍待真实适配，不伪造能力探测。

## 数据字典（实际实现）

localStorage `fashmaker-custom-models-v1` 数组继续兼容原{id,kind,name,protocol,endpoint,modelId}。新增：

| 字段 | 类型与规则 |
| --- | --- |
| enabled | boolean，旧记录缺失等同true；false禁用新选择和提交 |
| updatedAt | number，浏览器Date.now毫秒；旧记录为空展示“暂无记录” |
| testStatus | untested / format_valid / failed；旧记录缺失=untested，不使用passed冒充联网成功 |
| lastTest | null或{at:number,message:string,demo:true}，最近本地检查 |
| lastTrial | null或{at:number,message:string,demo:true}，最近试生成演示，仅元数据 |

localStorage `fashmaker-model-preferences-v1`：{image?:custom配置ID,video?:custom配置ID}，不含字段表示使用该功能平台默认；不存平台显示名称作为真实模型ID。sessionStorage `fashmaker-custom-models-v1:<id>`仍仅当前标签页测试Key。新标签页共享配置和默认但没有Key，检查失败需重新填写。生产不得使用浏览器存Key。

同页以fashmaker-models-changed事件更新，跨页以storage事件刷新模型列表；默认变更不改变打开中的已选模型。模型停用/删除保持旧历史名称和结果，只禁止再次直接调用；历史复制时需选择有效模型。原型多localStorage键不具备服务端事务保证，存储异常提示操作失败，正式服务须使用事务。

## 验收

1. 所有侧栏及设置能进入独立管理页，样式保持统一，当前管理入口高亮。
2. 两类列表有平台默认；添加后进入对应类型列表和创作下拉，不串类型。
3. 搜索、来源和状态筛选、空态、编辑、详情、删除可操作。
4. 设置默认后新打开创作页选中自定义模型；停用后默认恢复平台，模型下拉禁用；已有草稿不自动切换。
5. Key不回显、不进入localStorage、详情、日志、测试记录或提示词。跨标签页缺Key明确提示。
6. 检查只能显示格式通过，试生成只显示流程示意；无真实网络请求、图片、视频、计费或资产归档。
7. 桌面1440px、窄屏390px无横向溢出；Esc关闭弹窗，按钮有可见焦点与状态提示。

完整端点、能力编辑、RBAC、真实probe/付费试生成、服务端加密、正式任务与资产归档均仍按正式开发规格待接入。本次补管理界面和本地交互，不修改业务生成提示词或宣称服务已上线。
