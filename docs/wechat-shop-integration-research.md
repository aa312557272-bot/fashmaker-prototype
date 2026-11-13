# FashMaker × 微信小店：官方文档阅读与接入结论

版本：v1.0｜核查日期：2026-11-11｜性质：研究与开发建议，不代表已完成接口接入。

## 1. 阅读范围与证据

从用户提供的[添加商品](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_addproduct.html)页面展开微信小店商家文档目录，共检查 574 个唯一 URL：351 个 API/模块目录、56 个通知/通知目录、25 个开发指南、6 个开发须知、130 个资质示例及其余入口/连接/变更页面。

成功提取 474 个长正文、99 个短正文/目录/图片示例页面；另有 1 个“查看 Markdown”替代链接未取得正文，同一添加商品 HTML 正文已经成功读取。额外读取 6 个官方第三方平台接入依赖页面。URL 数含无扩展名别名及目录，不等于独立 API 数。图片资质示例只检查文字说明与图片引用，未逐图识别。核心商品发布链路精读了参数、注意事项、错误码和事件；其余业务梳理模块、接口用途与权限边界，不声称逐字段审计全部订单/结算接口。

完整逐页清单及可追溯 URL 见 [阅读索引](wechat-shop-docs-index.json)。原始正文仅作为本机阅读缓存，不将整套官方原文复制进仓库。本次范围是微信小店商家文档，不包括带货助手、联盟带货机构、供货商的独立整套文档。

## 2. 结论：FashMaker 可以做什么

建议产品定位：在商品内容创作后提供“发布到微信小店”，并支持将新内容更新到已关联的线上商品。标题、主图、详情图和商品头图视频可以作为发布素材，销售与资质信息由商家确认。完整链路需要授权、类目、品牌、素材、发布、查询和事件接口组合，不能只调用添加商品。

首期建议：单商品、单授权店铺、普通实物现货；支持发布草稿、平台发品前检查、素材转换、预览、明确确认、提交、状态同步、失败修正。生成内容必须准确，不推断材质、品牌、认证、价格、库存。可用生成结果与当前原型的演示封面必须区分；演示封面不能当成可上传的真实视频。

后续可增加批量发布、商品内容更新、库存/价格管理及经营效果分析。订单发货、售后、资金、会员是官方平台具备的其他能力，但不应自动纳入内容创作产品首期。

商品主图视频属于商详素材，不等于发布视频号短视频，也不等于给视频或直播挂品。此次文档不能作为自动发布视频号视频及挂品的能力证明。

## 3. SaaS 接入条件

FashMaker 为多个商家服务，应采用第三方服务商模式，而不是要求每个用户向网页或浏览器扩展提供 AppSecret。核心商品操作需相应权限，使用 authorizer_access_token 在服务端代调用。商品管理权限集为 129；其他模块按接口分别检查，不能推定取得一个权限即能操作全部业务。[开发者使用指南](https://developers.weixin.qq.com/doc/store/shop/dev_before/guide.html)、[第三方模式](https://developers.weixin.qq.com/doc/store/shop/dev_before/third_party_platforms)。

官方服务市场指引包含服务商入驻、第三方平台权限申请及全网发布、上架工具服务、商家订购后授权等步骤。产品的“连接店铺”应反映真实订购/授权状态，不能画成必定扫码即可开通。服务有效期与接口授权分开判断；不能仅凭授权通知判定支付成功或套餐有效。[服务市场接入指引](https://developers.weixin.qq.com/doc/oplatform/partner/service_market/provider_guideline/enter_guideline/sph_enter_guideline)。

开发建议：凭证服务集中刷新和加密存储，日志不记明文 Token；店铺绑定工作空间和商家授权主体；断开授权立即停止后续写操作。上架预览中明确店铺，防止串店。

## 4. 类目与动态表单

新类目树 cats_v2 不是固定三级，应按返回层级显示直到叶子。旧 cats 仍兼容，但新设计优先采用 cats_v2。已上架商品不能任意改变一级类目。[类目管理](https://developers.weixin.qq.com/doc/store/shop/guide/catalog/category.html)。

先确认店铺类目权限，调用 categoryprecheck 检查店铺/类目、保证金、运费险等，再用 getcategoryproductrule 获取规则。预检查不是商品内容审核，也不保证最终能发布。[发品前校验](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_categoryprecheck.html)。

规则涵盖商品属性、销售属性、资质、尺码表、最低价格、额外服务、条形码及预售条件。type_v2 有文本、单/多选、整数、四位小数及带单位数字；required_rule 包含条件必填与组合条件。后端和前端要使用同一规则版本；不能写死“材质/颜色”两项，更不能将样例类目当平台完整枚举。[发布规则接口](https://developers.weixin.qq.com/doc/store/shop/API/category-rule/api_getcategoryproductrule.html)。

平台可按标题和主图推荐类目，并返回权限信息；类目推荐不等于权限开通。[类目推荐](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_product_classify.html)。

跨平台商品可借助 externalproductmappingnew 推荐属性；结果仅供参考，需商家确认，不能据此凭空填充资质。[属性映射及推荐](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_externalproductmappingnew.html)。

品牌库中的品牌存在，不等于当前店铺拥有该品牌经营资质；品牌申请/生效资质必须按店铺检查。[品牌资质指南](https://developers.weixin.qq.com/doc/store/shop/guide/catalog/brand.html)。

## 5. 图片与视频

商品图片用 img_upload，resp_type=1 获取平台 img_url；支持二进制或 URL 拉取，URL 模式不支持 301/302。此模式文件上限 10MB，支持 BMP/JPEG/PNG/WEBP。返回的图片地址适合平台接口传参，但访问有限频，不应替代 FashMaker 自有资产展示和存储。[上传图片](https://developers.weixin.qq.com/doc/store/shop/API/apimgnt/resource/api_img_upload.html)。

不要因为名字有 V2 就用 img_uploadv2 替代商品上传：该文档要求仅在其他接口明确指定时使用，当前列出的场景 170 为售后。[上传图片V2](https://developers.weixin.qq.com/doc/store/shop/API/apimgnt/resource/api_img_uploadv2.html)。

商品视频 scene_type=162，上传接口列出的上限为 500MB、180 秒，file_type 为 mp4。完整流程为初始化、分块上传、完成上传、轮询获取转码后临时 URL，再填入商品视频字段。上传上限不是内容审核通过保证。[视频初始化](https://developers.weixin.qq.com/doc/store/shop/API/apimgnt/resource/api_video_initupload.html)、[视频临时URL](https://developers.weixin.qq.com/doc/store/shop/API/apimgnt/resource/api_video_getplayinfo.html)。

FashMaker 应保留原文件与 assetId，按店铺、素材内容版本缓存上传映射；不把临时视频 URL 当作永久资产。长图如需裁切或压缩，保留原图并创建发布衍生文件；这是本产品建议，不是官方强制裁切规则。不得复制同一主图凑最低数量。

## 6. 商品字段与发布模型

添加商品的关键约束：标题最多 60 字符并有内容字符限制；主图通常 3–9 张，食品饮料/生鲜至少 4 张；详情对象中的图片通常 1–50 张，食品饮料/生鲜至少 3 张；SKU 1–500；图片列表不能重复。短标题最多 20 字符，旧 sub_title 已废弃。售卖价以分处理，并结合当前类目规则验证。out_product_id 可携带内部映射，但平台不保证其唯一性。以上以[添加商品参数](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_addproduct.html)及实时规则为准，不能把本地表单校验当成官方最终判定。

### 草稿与线上双版本

添加与普通更新写 edit_product；线上生效内容为 product。getproduct 的 data_type=1/2/3 分别查询线上、草稿或两者。首次未上架商品可能没有线上数据。因此发布记录至少分别显示“编辑/上传/审核进度”和“线上售卖状态”，不能用一个成功标志替代。[商品管理指南](https://developers.weixin.qq.com/doc/store/shop/guide/catalog/product.html)。

### 创建与提审

listing 默认 0；在创建/普通更新中传 listing=1 可将后续上架/提审流程交由平台处理，无需再盲目调用 listing。SKU 超过 25 时可能异步写入；edit_status=7 表示上传中，此时再次上架可能报 10020067。最终按查询及事件确认结果。[添加商品注意事项](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_addproduct.html)、[上架商品](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_listingproduct.html)。

### 普通更新不是补丁

updateproduct 为覆盖草稿写：保留旧 SKU 必须正确携带 sku_id；遗漏旧 SKU 视为删除；无 sku_id 的项视为新增。FashMaker “只换图片”也应先读取当前完整数据、合并修改，再展示差异并提交，不能只传图片和标题。[更新商品](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_updateproduct.html)。

免审更新只更新线上版本的指定字段；不能用它换标题、主图或详情图。审核中也不能直接免审更新；仅改库存应使用快速库存接口。[免审更新](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_updateproductauditfree.html)。

## 7. 状态、回调和重试

接收 product_spu_audit、product_spu_listing、product_spu_update。审核事件中的 2/3/4 分别表示失败/通过/撤销；不要与草稿 edit_status 的 2/3/4 含义混淆。[审核事件](https://developers.weixin.qq.com/doc/store/shop/notify/product_callback/ProductSpuAudit.html)。

上下架事件需处理自主下架、系统下架、保证金违规、品牌到期和封禁等原因。线上“已上架”应由状态查询/事件证据更新；HTTP 成功和 errcode=0 不直接表示审核通过。[上下架事件](https://developers.weixin.qq.com/doc/store/shop/notify/product_callback/ProductSpuListing.html)。

通知接入需要安全模式 JSON 的验签、解密和应答。原型本地状态不模拟为真实回调。[消息通知](https://developers.weixin.qq.com/doc/store/shop/dev_before/message_push.html)。

开发建议：持久化原始事件与处理结果；去重、处理乱序，事件触发后再查询最新商品；设置有界轮询兜底。按店铺调度，查询提审限额；业务参数错误/无权限不自动重试，超时后先对账，避免重复创建。用内部 submissionId、版本锁及映射记录实现幂等，不能依赖 out_product_id。

## 8. 全套其他能力与 FashMaker 的关系

| 模块 | 官方目录能力 | FashMaker 建议 |
| --- | --- | --- |
| 店铺与主页 | 基本信息、主页商品、背景及展示位 | 店铺识别优先，装修可后续 |
| 商品与素材 | 创建、编辑、上下架、图片及视频、库存、赠品/活动 | 创作到发布的核心 |
| 类目与品牌 | 权限申请、规则、资质审核 | 首期读取与选择，资质申请可引导商家后台 |
| 订单、发货、仓库 | 订单处理、物流、电子面单、区域仓、代发 | 首期不做 ERP |
| 售后、纠纷、保障、工单 | 查询、处理与通知 | 超出首期内容发布范围 |
| 资金结算 | 余额、流水、提现等 | 不因商品权限自动获得，也不纳入首期 |
| 优惠券、联盟 | 营销活动、推广分销 | 后续独立需求 |
| 数据分析 | 罗盘店铺、商品、带货者、直播数据 | 后续支持内容效果复盘 |
| 会员、客服、国补 | 各有特定账号/模式限制 | 不能默认 SaaS 都可调用 |
| 小程序/公众号连接 | 商品展示、交易跳转及连接 | 不是视频号内容发布接口 |

依据：官方 [API 总目录](https://developers.weixin.qq.com/doc/store/shop/API/)及逐页索引。限制示例：罗盘指南标明 T+1，不是实时销量；会员营销、商家客服、国补指南中存在不支持第三方模式的限制，应按各接口再确认。[数据分析](https://developers.weixin.qq.com/doc/store/shop/guide/operation/analytics.html)、[会员营销](https://developers.weixin.qq.com/doc/store/shop/guide/marketing/vip.html)、[商家客服](https://developers.weixin.qq.com/doc/store/shop/guide/connect/kf.html)、[国补](https://developers.weixin.qq.com/doc/store/shop/guide/trade/subsidy.html)。

## 9. 对之前讨论的修正及文档歧义

1. 不是接口未公开，也不是必须在浏览器自动化中上传：官方 SaaS 代调用路径明确存在；是否能获准接入需申请审核。
2. 不是“创建成功后一定再调用上架”：优先根据 listing 参数与真实状态处理，避免重复提审。
3. 不把“更新商品”当增量补丁，否则有删除 SKU 的风险。
4. 不把“上架策略”理解成只有一个审核后自动上架开关。该接口实际字段涉及信息隐藏、相似品、低风险规则等店铺级策略；FashMaker 首期不要自动改这些策略。[策略接口](https://developers.weixin.qq.com/doc/store/shop/API/channels-shop-product/shop/api_setproductauditstrategy.html)。
5. 官方商品管理指南的流程示意与具体 API 的 listing 描述存在简化差异；以上使用 API 注意事项制定流程，仍需联调验证。上下架回调样例中的 status=3 不在该页状态枚举中，不能照抄样例，应按枚举并查询最新状态处理。这些差异已记录，不替平台臆定行为。
6. 当前仓库的 publish-1688.js / .css 是先前未完成的独立组件，未接入资产库页面；本次只读文档和整理研究，不宣称 1688 原型完成，也未因此增加真实微信发布能力。

## 10. 后续开发建议（尚未实施）

数据分层：商品主体保留稳定 productId；平台配置按 workspaceId/shopId/productId 存储类目与销售字段；发布任务保存不可变输入快照、素材版本、平台 product_id/sku_id、草稿与线上状态以及错误与事件。

用户流程：商品详情“发布到店铺” → 选择平台/已连接店铺 → 选择新建或更新已关联商品 → 补全动态类目字段与销售资料 → 选主图/详情图/可选视频 → 发品检查 → 展示最终差异及确认 → 提交进度 → 发布记录。

首期验收重点：串店拦截、失效授权拦截、缺图和重复图拦截、条件属性校验、分/元转换、SKU覆盖保护、异步上传不重复提审、失败原因定位、回调乱序与遗漏兜底、超时不重复创建、源商品改名不影响平台映射、原型与真实服务明确区分。

本研究不修改图片/视频生成提示词，未新增生成能力，因此不产生新的后台提示词交付；如后续增加自动文案改写或素材加工，应另按项目规则补齐相应提示词与验收文档。
